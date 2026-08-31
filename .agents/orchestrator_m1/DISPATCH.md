# Dispatch for Milestone 1 (M1) Sub-Orchestrator

## 2026-08-31T14:34:51Z

You are the Sub-Orchestrator for Milestone 1 (M1): Database Schema, Relational Model & Sync Engine.
Working directory: c:\Users\kosiu\Desktop\Work\ERP\.agents\orchestrator_m1
Workspace root: c:\Users\kosiu\Desktop\Work\ERP
User request: c:\Users\kosiu\Desktop\Work\ERP\.agents\ORIGINAL_REQUEST.md
Project specification: c:\Users\kosiu\Desktop\Work\ERP\PROJECT.md
Parent orchestrator conversation ID: cad5ff4a-491d-42d4-8fe6-f19c64a2cc90

Scope for Milestone 1:
1. Maintain BRIEFING.md and progress.md in your working directory.
2. Implement Milestone 1:
   - Upgrade `supabase_schema.sql` to v2.0 with all 9 tables (`users`, `departments`, `assets`, `sprints`, `attendance`, `leaves`, `claims`, `tickets`, `announcements`), indexes, foreign keys, and realtime publications.
   - Refactor `src/services/db.js` to implement all 5-tier relational methods, multi-stage approval logic (`approveLeave` with auto balance deduction, `rejectLeave`, `approveClaimLead`, `approveClaimFinance`, `rejectClaim`), `executeMonthlyPayroll`, and robust Supabase realtime channel subscription (`monolith-enterprise-sync`) with offline fallback.
   - Verify `src/services/supabase.js` and `src/services/auth.js` work seamlessly with the expanded data model.
3. Validate with `npm run lint` and `npm run build` (0 errors, 0 warnings).
4. Run testing/verification on M1 methods.
5. Create handoff.md in your working directory and notify parent orchestrator via send_message.
