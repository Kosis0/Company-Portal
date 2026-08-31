# Empirical Challenge Report — Milestone 1 (M1)
**Database Schema, Relational Model & Sync Engine**
**Author**: Challenger 2 (`challenger_m1_2`)
**Date**: 2026-08-31
**Target Commit/State**: Milestone 1 Implementation

---

## Challenge Summary

**Overall risk assessment**: **LOW** (Production-ready with advisory hardening notes)

Milestone 1 successfully delivers a complete, relational 9-table schema in `supabase_schema.sql` and a unified relational service layer in `src/services/db.js`. Empirical execution across 28 automated stress tests demonstrates that foreign key cascades, unique constraints, realtime publication bindings, statutory payroll calculations (at $0, <$50, fractional cents, and $1,000,000 extreme values), multi-stage leave/expense approval workflows, and dual-write offline cache recovery operate stably.

---

## Challenges

### [Low/Advisory] Challenge 1: Negative Leave Days Input Vulnerability in Leave Balance Mutation

- **Assumption challenged**: Assumes all incoming leave request records provide strictly positive integers for `days`.
- **Attack scenario**: A malicious or malformed client payload submits a leave request with `days: -10`. When a Line Manager or Admin approves the leave, `db.approveLeave` executes:
  ```javascript
  const daysToDeduct = leave.days || 1;
  updates.annualLeaveBalance = Math.max(0, (user.annualLeaveBalance || 20) - daysToDeduct);
  ```
  Subtracting a negative number (`14 - (-10) = 24`) mathematically increases the user's leave balance rather than deducting from it.
- **Blast radius**: Low/Internal. Restricted to users who can submit custom raw JSON payloads or if form validation fails to clamp min value to 1.
- **Mitigation**: 
  1. In `src/services/db.js`: Enforce `const daysToDeduct = Math.max(1, Math.abs(leave.days || 1));` or reject negative days at submission time.
  2. In `supabase_schema.sql`: Add `CHECK (days > 0)` constraint on `public.leaves(days)`.

### [Low/Advisory] Challenge 2: Absence of Explicit PostgreSQL CHECK Constraints on Relational Tables

- **Assumption challenged**: Assumes client application layer will always validate tier ranges (1-5), positive salary numbers, and non-negative leave balances.
- **Attack scenario**: Direct SQL queries or third-party database clients could insert invalid data (e.g. `tier = 99`, `monthly_base_pay = -5000.00`, `annual_leave_balance = -5`).
- **Blast radius**: Low. Internal database integrity under direct bypass of ERP service layer.
- **Mitigation**: Add defensive SQL CHECK constraints in future schema migrations:
  - `ALTER TABLE public.users ADD CONSTRAINT chk_tier CHECK (tier BETWEEN 1 AND 5);`
  - `ALTER TABLE public.users ADD CONSTRAINT chk_base_pay CHECK (monthly_base_pay >= 0);`
  - `ALTER TABLE public.users ADD CONSTRAINT chk_leave_bal CHECK (annual_leave_balance >= 0);`

---

## Stress Test Results

Executed automated test suite `tests/m1_empirical_challenger.test.js` comprising 28 test cases:

| Test ID | Test Scenario | Expected Behavior | Actual Behavior | Result |
|---|---|---|---|---|
| **SQL-01** | Schema defines all 9 tables with `public.` prefix | All 9 tables defined with `CREATE TABLE IF NOT EXISTS` | Matches 9/9 tables (`users`, `departments`, `assets`, `sprints`, `attendance`, `leaves`, `claims`, `tickets`, `announcements`) | **PASS** |
| **SQL-02** | Primary keys on all 9 tables | `id TEXT PRIMARY KEY` defined on every table | Present and validated on all 9 tables | **PASS** |
| **SQL-03** | Foreign key cascading & SET NULL | `ON DELETE CASCADE` for owned logs (attendance, leaves, claims, tickets); `ON DELETE SET NULL` for optional references (`manager_id`, `head_id`, `assigned_to_id`, `lead_id`) | Exact DDL constraints verified | **PASS** |
| **SQL-04** | Unique constraints | `users.email UNIQUE`, `departments.code UNIQUE`, `assets.serial UNIQUE` | Exact unique constraints verified | **PASS** |
| **SQL-05** | Realtime publication bindings | All 9 tables added to `supabase_realtime` publication with duplicate object exception safety | Verified `DO $$ ... ALTER PUBLICATION supabase_realtime ADD TABLE ... END $$;` | **PASS** |
| **SQL-06** | Performance indexing | Indexes on all foreign keys, status flags, emails, and tiers | 20 performance indexes confirmed | **PASS** |
| **SQL-07** | Seed data relational integrity | Foreign keys in seed data resolve to valid existing parent rows | All `manager_id`, `head_id`, `assigned_to_id`, `lead_id` references valid | **PASS** |
| **PAY-01** | Zero base pay ($0.00) | Net pay clamped to $0.00 (not negative due to $50 HMO) | `gross: 0, netPay: 0, totalDeductions: 50` | **PASS** |
| **PAY-02** | Low salary below HMO ($30.00) | Deductions ($55.83) exceed gross ($30.00), net pay clamped to $0.00 | `gross: 30, totalDeductions: 55.83, netPay: 0` | **PASS** |
| **PAY-03** | Extreme executive salary ($1,000,000.00) | Accurate PAYE ($114,300.00) and Pension ($80,000.00) | `gross: 1000000, netPay: 805650.00` | **PASS** |
| **PAY-04** | Fractional cents rounding ($3,500.55) | Rounded to exactly 2 decimal places without IEEE-754 drift | `gross: 3500.55, paye: 400.11, pension: 280.04, netPay: 2770.40` | **PASS** |
| **PAY-05** | Missing monthlyBasePay fallback | Safely parses salary string (e.g. `"$7,500/mo"` -> `7500`) or defaults to 3500 | Successfully parsed various currency string formats | **PASS** |
| **PAY-06** | Monthly payroll batch execution | Excludes `Terminated` and `On Leave` users from active batch | Headcount = 8 active users, total sum matches payslips sum | **PASS** |
| **REL-01** | Hierarchical 5-tier Org Tree | Traverses CEO -> VP -> Lead -> Staff (4 levels depth) without cycles | Depth = 4, tree root = `USR-001` (Tier 5 CEO) | **PASS** |
| **REL-02** | Orphaned root fallback | If CEO record missing, selects next highest tier node | Graceful fallback to next available root | **PASS** |
| **REL-03** | Direct reports isolation | Filters reports strictly by `managerId` | Sarah Chen -> 2 reports; David Okonjo -> 0 reports | **PASS** |
| **WORKFLOW-01** | Leave balance deduction clamp | Deducting 30 days when 14 available clamps balance to 0 (no negative balance) | `annualLeaveBalance: 0` | **PASS** |
| **WORKFLOW-02** | Category-specific leave balance | Sick & Casual leaves deduct only from their respective counters | `sickLeaveBalance: 5, annualLeaveBalance: 14` (untouched) | **PASS** |
| **WORKFLOW-03** | 2-Stage claim approval | `Pending Lead` -> `Pending Finance` -> `Approved` with approver IDs & batch ID | All audit fields (`leadApproverId`, `financeApproverId`, `payoutBatchId`, timestamps) set | **PASS** |
| **WORKFLOW-04** | Non-existent entity mutations | Approving non-existent leave/claim returns `null` safely | Returned `null` without throwing unhandled exceptions | **PASS** |
| **CACHE-01** | Corrupted localStorage JSON | Invalid JSON string automatically resets to 10 seed users | Caught `SyntaxError` and recovered seed defaults | **PASS** |
| **CACHE-02** | Empty cache keys | Missing storage keys fall back to initial seed data | Returned default arrays for assets and sprints | **PASS** |
| **CACHE-03** | Dual-write resilience | Writes to localStorage synchronously even when Supabase is unconfigured | Item retrieved immediately from localStorage cache | **PASS** |
| **ADV-01** | Negative gross pay input | Gross: -500 clamps net pay to 0 | `gross: -500, netPay: 0` | **PASS** |
| **ADV-02** | Department over-budget utilization | Spent > Allocated computes `utilization > 100%` and `remaining: 0` | `budgetUtilization: "460%", remainingAmount: 0` | **PASS** |
| **ADV-03** | Case-insensitive duplicate email | Rejects duplicate registration regardless of uppercase/lowercase | Throws `"already exists"` | **PASS** |
| **ADV-04** | Negative leave days input observation | Verifies calculation behavior when negative days provided | Observed balance addition behavior (advisory finding logged) | **PASS** |
| **ADV-05** | Realtime subscription unsubscription | Unsubscribe callable without memory leaks or errors | Callable no-op function returned | **PASS** |

---

## Unchallenged Areas

- **Live Supabase PostgreSQL Cloud Latency**: Physical WebSocket disconnects under poor cellular networks (handled conceptually via optimistic offline cache dual-write).
- **Multi-Tenant Database Row-Level Security (RLS)**: RLS policies are planned for subsequent milestones (M5/M6) once production Supabase authentication bindings are finalized.
