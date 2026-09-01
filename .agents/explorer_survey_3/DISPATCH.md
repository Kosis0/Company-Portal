## 2026-09-01T00:54:32Z
You are teamwork_preview_explorer_survey_3 (RBAC, Supabase Sync & Build/Test Specialist).
Your working directory is: c:\Users\kosiu\Desktop\Work\ERP\.agents\explorer_survey_3

Read the authoritative user request at:
c:\Users\kosiu\Desktop\Work\ERP\ORIGINAL_REQUEST.md

Your mission is to perform a comprehensive survey of the existing ERP codebase focusing on:
1. Role-Based Access Control (RBAC):
   - Current implementation of the 5 authority tiers (Tier 1 Staff to Tier 5 CEO)
   - HR/Lead approval queues and permissions across all views/actions
   - Auth context, user profile state, permission checking hooks or guards
2. Supabase Integration:
   - Supabase client configuration, schema models, database tables
   - Live multi-device sync, realtime subscriptions, data mutations
   - State management layers (e.g. Zustand, React Query, Context) and how they interact with Supabase
3. Build, Lint & Test Infrastructure:
   - package.json scripts, ESLint configuration, TypeScript / compiler settings
   - Existing test framework (Vitest, Jest, Playwright, Cypress, etc.) or lack thereof
   - Current linting and build health status (commands to verify: npm run lint, npm run build)

Output requirements:
- Write a detailed analysis and survey report to `c:\Users\kosiu\Desktop\Work\ERP\.agents\explorer_survey_3\analysis.md`
- Write a complete handoff report to `c:\Users\kosiu\Desktop\Work\ERP\.agents\explorer_survey_3\handoff.md` with:
  * Full assessment of RBAC architecture, Supabase hooks/realtime sync, and build/test configuration
  * Guidance on how to ensure 0 lint errors, 0 build errors, and preserve all auth/sync capabilities during UI overhaul
- Send a completion message back to the orchestrator when finished.
