# E2E Test Infra: Monolith ERP Visual & Operational Suite

## Test Philosophy
- Opaque-box, requirement-driven testing based on `ORIGINAL_REQUEST.md`.
- Systematic 4-tier methodology: Category-Partition (Tier 1), Boundary Value Analysis (Tier 2), Pairwise Combinations (Tier 3), Real-World Application Workloads (Tier 4).
- No dependency on internal implementation hacks.

## Feature Inventory & Test Coverage Mapping
| # | Feature | Requirement Source | Tier 1 (Coverage) | Tier 2 (Boundaries) | Tier 3 (Pairwise) | Tier 4 (Workloads) |
|---|---------|-------------------|:-----------------:|:-------------------:|:-----------------:|:------------------:|
| F1 | Visual Design System Tokens | ORIGINAL_REQUEST §1 | 5 cases | 5 cases | ✓ | ✓ |
| F2 | Top Navbar & Circular Avatar | ORIGINAL_REQUEST §1 | 5 cases | 5 cases | ✓ | ✓ |
| F3 | Deep Slate Navy & Sage Pills | ORIGINAL_REQUEST §1 | 5 cases | 5 cases | ✓ | ✓ |
| F4 | Organization Overview Screen | ORIGINAL_REQUEST §2 | 5 cases | 5 cases | ✓ | ✓ |
| F5 | Financial Performance Screen | ORIGINAL_REQUEST §2 | 5 cases | 5 cases | ✓ | ✓ |
| F6 | Inventory & Supply Chain Screen | ORIGINAL_REQUEST §2 | 5 cases | 5 cases | ✓ | ✓ |
| F7 | SVG Multi-Line Trend Chart | ORIGINAL_REQUEST §3 | 5 cases | 5 cases | ✓ | ✓ |
| F8 | SVG Donut Chart & Legend | ORIGINAL_REQUEST §3 | 5 cases | 5 cases | ✓ | ✓ |
| F9 | Grouped & Horizontal Bar Charts | ORIGINAL_REQUEST §3 | 5 cases | 5 cases | ✓ | ✓ |
| F10 | Vertical Shipment Timeline | ORIGINAL_REQUEST §3 | 5 cases | 5 cases | ✓ | ✓ |
| F11 | 5-Tier RBAC & Approval Queues | ORIGINAL_REQUEST §4 | 5 cases | 5 cases | ✓ | ✓ |
| F12 | Supabase Realtime & Offline Cache | ORIGINAL_REQUEST §4 | 5 cases | 5 cases | ✓ | ✓ |

## Test Architecture
- Test Runner: Node.js native test runner (`node --test`) with mock DOM environment.
- Test Structure:
  * `tests/tier1_features/` — Feature coverage tests verifying each component and token in isolation.
  * `tests/tier2_boundaries/` — Edge cases, empty states, zero amounts, overflow labels, extreme viewport scaling.
  * `tests/tier3_combinations/` — Cross-feature interactions (e.g. Theme toggle + Chart rendering, RBAC Tier 1 vs Tier 5 access to Financials/Inventory, Create PO + Stock update).
  * `tests/tier4_applications/` — Full end-to-end operational workflows (CEO monthly review, Inventory Manager reorder workflow, Finance invoice reconciliation).

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | CEO Executive Review & Financial Drilldown | F1, F3, F4, F5, F7, F8, F9, F11 | High |
| 2 | Supply Chain Manager Low Stock Reorder & PO Creation | F1, F3, F6, F10, F11, F12 | High |
| 3 | Finance Controller Invoice Reconciliation & Cash Flow Analysis | F1, F2, F5, F9, F11, F12 | High |
| 4 | Employee Tier 1 Self-Service & Attendance Logging | F1, F2, F3, F11, F12 | Medium |
| 5 | Cross-Device Multi-Tier Approval & Realtime Update | F4, F5, F6, F11, F12 | High |

## Pass/Fail Semantics
- Command: `node --test tests/**/*.test.js` or `npm test`
- Criteria: 100% tests pass with exit code 0.
