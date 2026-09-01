## 2026-09-01T00:18:12Z

You are teamwork_preview_challenger_2 (Adversarial RBAC & Data Integrity Challenger).
Your working directory is: c:\Users\kosiu\Desktop\Work\ERP\.agents\challenger_2

Read the authoritative specifications at:
- c:\Users\kosiu\Desktop\Work\ERP\ORIGINAL_REQUEST.md
- c:\Users\kosiu\Desktop\Work\ERP\PROJECT.md
- c:\Users\kosiu\Desktop\Work\ERP\TEST_READY.md

Your mission:
1. Adversarially stress-test RBAC boundaries, multi-tier approvals, and data synchronization:
   - Tier privilege escalation attempts (e.g. Tier 1 trying to access Executive Cockpit or approve claims).
   - Idempotency of approval actions (repeated approvals, concurrent leave requests, balance underflow).
   - Cache corruption recovery and offline-online sync convergence.
2. Execute the full test suite (`node --test tests/**/*.test.js`) and build (`npm run build`).

Output requirements:
- Write stress testing findings to `c:\Users\kosiu\Desktop\Work\ERP\.agents\challenger_2\analysis.md`
- Write handoff report to `c:\Users\kosiu\Desktop\Work\ERP\.agents\challenger_2\handoff.md` with an explicit verdict: `APPROVE` or `REQUEST_CHANGES`.
- Send completion message to orchestrator.
