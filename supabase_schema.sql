-- =========================================================================
-- MONOLITH ENTERPRISE ERP • SUPABASE DATABASE SCHEMA v2.0
-- Full 9-Table Relational Schema with Foreign Keys, Indexes & Realtime Setup
-- Run this in your Supabase SQL Editor to initialize all tables and seed data
-- =========================================================================

-- 1. USERS TABLE (5-Tier Organizational Hierarchy)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Staff Member',
  department TEXT NOT NULL DEFAULT 'Engineering',
  role TEXT NOT NULL DEFAULT 'employee', -- 'employee' | 'senior_contributor' | 'manager' | 'director' | 'finance' | 'admin' | 'executive'
  tier INT NOT NULL DEFAULT 1, -- 1: Staff, 2: Senior Contributor, 3: Lead/Manager, 4: Director/Head, 5: Executive/CEO
  manager_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  manager_name TEXT,
  phone TEXT DEFAULT '+234 800 000 0000',
  location TEXT DEFAULT 'Port Harcourt, Nigeria',
  bank_name TEXT DEFAULT 'First Bank of Nigeria',
  account_number TEXT DEFAULT '0000000000',
  tax_id TEXT DEFAULT 'TIN-00000000',
  pension_pin TEXT DEFAULT 'PEN-00000000',
  salary TEXT DEFAULT '$3,500/mo',
  monthly_base_pay NUMERIC DEFAULT 3500.00,
  score TEXT DEFAULT '4.5 / 5.0',
  status TEXT DEFAULT 'Active', -- 'Active' | 'On Leave' | 'Terminated'
  annual_leave_balance INT DEFAULT 20,
  sick_leave_balance INT DEFAULT 10,
  casual_leave_balance INT DEFAULT 5,
  avatar_initials TEXT DEFAULT 'EM',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEPARTMENTS TABLE (Department Management & Budgets)
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY, -- e.g. 'DEP-ENG'
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  head_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  head_name TEXT NOT NULL,
  head_title TEXT NOT NULL,
  headcount INT DEFAULT 1,
  monthly_budget TEXT DEFAULT '$25,000',
  budget_utilization TEXT DEFAULT '0%',
  primary_location TEXT DEFAULT 'Lagos Headquarters',
  lead_objective TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. IT ASSETS REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY, -- e.g. 'AST-101'
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Workstation' | 'Display & Peripheral' | 'Security Token' | 'Networking'
  serial TEXT UNIQUE NOT NULL,
  assigned_to_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  assigned_to_name TEXT,
  department TEXT NOT NULL,
  deployed_date TEXT NOT NULL,
  condition TEXT DEFAULT 'Excellent', -- 'New' | 'Excellent' | 'Good' | 'Fair' | 'Retired'
  status TEXT DEFAULT 'Deployed', -- 'Deployed' | 'In Stock' | 'Maintenance'
  value TEXT DEFAULT '$0.00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENGINEERING SPRINTS TABLE
CREATE TABLE IF NOT EXISTS public.sprints (
  id TEXT PRIMARY KEY, -- e.g. 'SPR-42'
  title TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'Engineering',
  lead_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  lead_name TEXT NOT NULL,
  status TEXT DEFAULT 'Active', -- 'Upcoming' | 'Active' | 'Completed'
  progress TEXT DEFAULT '0%',
  velocity TEXT DEFAULT '0 Story Points',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  goals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ATTENDANCE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
  id TEXT PRIMARY KEY, -- e.g. 'ATT-101'
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  date TEXT NOT NULL,
  in_time TEXT NOT NULL,
  out_time TEXT DEFAULT '—',
  hours TEXT DEFAULT 'In Progress',
  location TEXT DEFAULT 'Port Harcourt Office',
  status TEXT DEFAULT 'On Time', -- 'On Time' | 'Present' | 'Late' | 'Remote'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEAVE REQUESTS TABLE (Multi-Stage Approval Workflow)
CREATE TABLE IF NOT EXISTS public.leaves (
  id TEXT PRIMARY KEY, -- e.g. 'LV-201'
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  manager_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'Annual Leave' | 'Sick Leave' | 'Casual Leave'
  dates TEXT NOT NULL,
  days INT DEFAULT 1,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'Pending Manager', -- 'Pending Manager' | 'Approved' | 'Rejected'
  applied_on TEXT NOT NULL,
  approver_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  approver_name TEXT,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EXPENSE CLAIMS TABLE (2-Stage Approval: Lead -> Finance)
CREATE TABLE IF NOT EXISTS public.claims (
  id TEXT PRIMARY KEY, -- e.g. 'CLM-301'
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  manager_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  amount TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  receipt TEXT DEFAULT 'receipt_invoice.pdf',
  status TEXT DEFAULT 'Pending Lead', -- 'Pending Lead' | 'Pending Finance' | 'Approved' | 'Rejected'
  lead_approver_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  lead_approver_name TEXT,
  lead_approved_at TIMESTAMPTZ,
  finance_approver_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  finance_approver_name TEXT,
  finance_approved_at TIMESTAMPTZ,
  payout_batch_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUPPORT TICKETS TABLE (IT & HR SLA Triage Queue)
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY, -- e.g. 'TCK-401'
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  subject TEXT NOT NULL,
  category TEXT NOT NULL, -- 'IT Hardware' | 'Software Access' | 'HR Inquiry' | 'Facilities'
  priority TEXT DEFAULT 'Medium', -- 'Low' | 'Medium' | 'High' | 'Critical'
  details TEXT,
  assigned_to TEXT DEFAULT 'Dennis V. (IT Support)',
  status TEXT DEFAULT 'Open', -- 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ANNOUNCEMENTS TABLE (Company Broadcast Bulletins)
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY, -- e.g. 'ANN-501'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'Important', -- 'Important' | 'General' | 'Policy' | 'Urgent'
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INVOICES TABLE (Financial Receivables & Settlement)
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY, -- e.g. 'INV-2026-089'
  customer TEXT NOT NULL,
  email TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  amount TEXT NOT NULL,
  amount_num NUMERIC DEFAULT 0,
  days_overdue INT DEFAULT 0,
  status TEXT DEFAULT 'Pending', -- 'Pending' | 'Due Soon' | 'Overdue' | 'Paid'
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INVENTORY TABLE (Hardware Components & Stock Alerts)
CREATE TABLE IF NOT EXISTS public.inventory (
  sku TEXT PRIMARY KEY, -- e.g. 'SKU-9901'
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  current_stock INT NOT NULL DEFAULT 0,
  min_threshold INT NOT NULL DEFAULT 10,
  supplier TEXT NOT NULL,
  unit_cost TEXT NOT NULL,
  unit_cost_num NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Adequate', -- 'Adequate' | 'Low Stock' | 'Critical'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PURCHASE ORDERS TABLE (Procurement Orders)
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id TEXT PRIMARY KEY, -- e.g. 'PO-9901'
  sku TEXT REFERENCES public.inventory(sku) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  supplier TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_cost TEXT NOT NULL,
  status TEXT DEFAULT 'Created', -- 'Created' | 'Approved & Sent' | 'Fulfilled'
  authorized_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SHIPMENTS TABLE (Supply Chain Logistics)
CREATE TABLE IF NOT EXISTS public.shipments (
  id TEXT PRIMARY KEY, -- e.g. 'SHP-8801'
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  carrier TEXT NOT NULL,
  status TEXT DEFAULT 'In Transit', -- 'In Transit' | 'Customs Clearance' | 'Dispatched' | 'Delivered'
  date TEXT NOT NULL,
  progress INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR HIGH PERFORMANCE QUERYING
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_manager_id ON public.users(manager_id);
CREATE INDEX IF NOT EXISTS idx_users_tier ON public.users(tier);
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users(department);
CREATE INDEX IF NOT EXISTS idx_departments_code ON public.departments(code);
CREATE INDEX IF NOT EXISTS idx_departments_head_id ON public.departments(head_id);
CREATE INDEX IF NOT EXISTS idx_assets_assigned_to ON public.assets(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_assets_department ON public.assets(department);
CREATE INDEX IF NOT EXISTS idx_sprints_department ON public.sprints(department);
CREATE INDEX IF NOT EXISTS idx_sprints_lead_id ON public.sprints(lead_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_leaves_user_id ON public.leaves(user_id);
CREATE INDEX IF NOT EXISTS idx_leaves_manager_id ON public.leaves(manager_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON public.leaves(status);
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON public.claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_manager_id ON public.claims(manager_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON public.claims(status);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);

-- =========================================================================
-- ENABLE REALTIME PUBLICATION ON ALL 9 TABLES
-- =========================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.departments;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.assets;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sprints;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leaves;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.claims;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.purchase_orders;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shipments;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- =========================================================================
-- SEED DATA: 10 ENTERPRISE USERS ACROSS TIERS 1 TO 5
-- =========================================================================
INSERT INTO public.users (
  id, email, password, name, title, department, role, tier,
  manager_id, manager_name, phone, location, bank_name, account_number,
  tax_id, pension_pin, salary, monthly_base_pay, score, status,
  annual_leave_balance, sick_leave_balance, casual_leave_balance, avatar_initials
) VALUES
  -- TIER 5: EXECUTIVE C-SUITE (CEO)
  ('USR-001', 'ceo@company.com', 'password123', 'Dr. Alexander Vance', 'Chief Executive Officer & Co-Founder', 'Executive', 'executive', 5, NULL, 'Board of Directors', '+234 801 000 1111', 'Lagos Headquarters', 'First Bank of Nigeria', '1010101010', 'TIN-00100101', 'PEN-00100101', '$18,500/mo', 18500.00, '5.0 / 5.0', 'Active', 30, 15, 7, 'AV'),
  -- TIER 4: HEADS OF DEPARTMENT (DIRECTORS / VPS)
  ('USR-002', 'vpeng@company.com', 'password123', 'Tunde Bakare', 'VP of Technology & Engineering', 'Engineering', 'director', 4, 'USR-001', 'Dr. Alexander Vance (CEO)', '+234 802 222 3344', 'Port Harcourt Office', 'First Bank of Nigeria', '2020202020', 'TIN-00200202', 'PEN-00200202', '$9,800/mo', 9800.00, '4.9 / 5.0', 'Active', 24, 12, 5, 'TB'),
  ('USR-003', 'admin@company.com', 'password123', 'Victoria Sterling', 'VP of People Operations & Culture', 'Human Resources', 'admin', 4, 'USR-001', 'Dr. Alexander Vance (CEO)', '+234 802 111 2233', 'Lagos Headquarters', 'First Bank of Nigeria', '3030303030', 'TIN-00300303', 'PEN-00300303', '$8,500/mo', 8500.00, '4.9 / 5.0', 'Active', 25, 12, 5, 'VS'),
  ('USR-004', 'finance@company.com', 'password123', 'Marcus Brody', 'Head of Finance & Corporate Operations', 'Finance & Operations', 'finance', 4, 'USR-001', 'Dr. Alexander Vance (CEO)', '+234 803 555 6677', 'Lagos Headquarters', 'First Bank of Nigeria', '4040404040', 'TIN-00400404', 'PEN-00400404', '$8,200/mo', 8200.00, '4.8 / 5.0', 'Active', 22, 10, 5, 'MB'),
  -- TIER 3: LINE MANAGERS & TEAM LEADS
  ('USR-005', 'sarah.chen@company.com', 'password123', 'Sarah Chen', 'Frontend & Mobile Engineering Lead', 'Engineering', 'manager', 3, 'USR-002', 'Tunde Bakare (VP Eng)', '+234 803 444 5566', 'Port Harcourt Office', 'Zenith Bank', '5050505050', 'TIN-00500505', 'PEN-00500505', '$6,200/mo', 6200.00, '4.8 / 5.0', 'Active', 18, 10, 5, 'SC'),
  ('USR-006', 'devops.lead@company.com', 'password123', 'David Okonjo', 'DevOps & Cloud Infrastructure Lead', 'Engineering', 'manager', 3, 'USR-002', 'Tunde Bakare (VP Eng)', '+234 818 222 3344', 'Remote / Port Harcourt', 'Zenith Bank', '6060606060', 'TIN-00600606', 'PEN-00600606', '$5,800/mo', 5800.00, '4.7 / 5.0', 'Active', 16, 9, 4, 'DO'),
  ('USR-007', 'talent.lead@company.com', 'password123', 'Alex Rivera', 'Talent Acquisition & HR Lead', 'Human Resources', 'manager', 3, 'USR-003', 'Victoria Sterling (VP HR)', '+234 805 777 8899', 'Lagos Headquarters', 'Guaranty Trust Bank', '7070707070', 'TIN-00700707', 'PEN-00700707', '$4,600/mo', 4600.00, '4.6 / 5.0', 'Active', 17, 8, 4, 'AR'),
  -- TIER 1 & 2: STAFF, SENIOR ASSOCIATES & DEVELOPER INTERNS
  ('USR-008', 'employee@company.com', 'password123', 'Udeh Kosisochukwu Emmanuel', 'Software Developer Intern', 'Engineering', 'employee', 1, 'USR-005', 'Sarah Chen (Frontend Lead)', '+234 812 345 6789', 'Port Harcourt Office', 'First Bank of Nigeria', '3049283482', 'TIN-98234711', 'PEN-100293847', '$3,500/mo', 3500.00, '4.5 / 5.0', 'Active', 14, 8, 4, 'UK'),
  ('USR-009', 'chidi.ui@company.com', 'password123', 'Chidi Nnamdi', 'Product Designer & UI Engineer', 'Product & Design', 'senior_contributor', 2, 'USR-005', 'Sarah Chen (Tech Lead)', '+234 809 111 4455', 'Port Harcourt Office', 'Zenith Bank', '1029384756', 'TIN-77192834', 'PEN-883719201', '$4,200/mo', 4200.00, '4.6 / 5.0', 'Active', 16, 9, 5, 'CN'),
  ('USR-010', 'fatima.ops@company.com', 'password123', 'Fatima Aliyu', 'Financial Analyst & Compliance Associate', 'Finance & Operations', 'senior_contributor', 2, 'USR-004', 'Marcus Brody (Head of Finance)', '+234 807 333 9988', 'Lagos Headquarters', 'Guaranty Trust Bank', '0293847561', 'TIN-55910283', 'PEN-662910384', '$4,000/mo', 4000.00, '4.4 / 5.0', 'Active', 15, 8, 3, 'FA')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  department = EXCLUDED.department,
  role = EXCLUDED.role,
  tier = EXCLUDED.tier,
  manager_id = EXCLUDED.manager_id,
  manager_name = EXCLUDED.manager_name,
  salary = EXCLUDED.salary,
  monthly_base_pay = EXCLUDED.monthly_base_pay,
  annual_leave_balance = EXCLUDED.annual_leave_balance,
  sick_leave_balance = EXCLUDED.sick_leave_balance,
  casual_leave_balance = EXCLUDED.casual_leave_balance;

-- =========================================================================
-- SEED DATA: DEPARTMENTS
-- =========================================================================
INSERT INTO public.departments (id, name, code, head_id, head_name, head_title, headcount, monthly_budget, budget_utilization, primary_location, lead_objective)
VALUES
  ('DEP-ENG', 'Engineering & Technology', 'ENG', 'USR-002', 'Tunde Bakare', 'VP of Engineering', 4, '$42,000', '76%', 'Port Harcourt & Remote', 'Scale monolithic infrastructure and release v3.0 mobile portals.'),
  ('DEP-HR', 'Human Resources & Talent', 'HR', 'USR-003', 'Victoria Sterling', 'VP of People Operations', 2, '$18,500', '64%', 'Lagos Headquarters', 'Expand medical HMO network and complete Q3 leadership assessments.'),
  ('DEP-FIN', 'Finance & Corporate Operations', 'FIN', 'USR-004', 'Marcus Brody', 'Head of Finance', 2, '$24,000', '82%', 'Lagos Headquarters', 'Automate statutory PAYE/Pension remittances and expense audits.'),
  ('DEP-PRD', 'Product & Design', 'PRD', 'USR-005', 'Sarah Chen', 'Product Engineering Lead', 2, '$16,000', '58%', 'Port Harcourt Office', 'Deliver Nordic Minimalist component library and mobile design system.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  head_id = EXCLUDED.head_id,
  head_name = EXCLUDED.head_name,
  headcount = EXCLUDED.headcount,
  monthly_budget = EXCLUDED.monthly_budget,
  budget_utilization = EXCLUDED.budget_utilization;

-- =========================================================================
-- SEED DATA: IT ASSETS
-- =========================================================================
INSERT INTO public.assets (id, name, category, serial, assigned_to_id, assigned_to_name, department, deployed_date, condition, status, value)
VALUES
  ('AST-101', 'MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)', 'Workstation', 'MBP-2026-99238', 'USR-008', 'Udeh Kosisochukwu Emmanuel', 'Engineering', '2026-08-01', 'Excellent', 'Deployed', '$3,499.00'),
  ('AST-102', 'Dell UltraSharp 32" 4K USB-C Hub Monitor', 'Display & Peripheral', 'DEL-2026-88237', 'USR-005', 'Sarah Chen', 'Engineering', '2025-06-10', 'Excellent', 'Deployed', '$899.00'),
  ('AST-103', 'Lenovo ThinkPad X1 Carbon Gen 11 (32GB RAM)', 'Workstation', 'TP-2025-77192', 'USR-007', 'Alex Rivera', 'Human Resources', '2025-08-05', 'Good', 'Deployed', '$2,100.00'),
  ('AST-104', 'YubiKey 5C NFC Enterprise 2FA Security Key', 'Security Token', 'YK-2025-66291', 'USR-006', 'David Okonjo', 'Engineering', '2025-07-20', 'New', 'Deployed', '$75.00'),
  ('AST-105', 'Apple MacBook Air 15" M3 (16GB RAM)', 'Workstation', 'MBA-2026-10293', 'USR-010', 'Fatima Aliyu', 'Finance & Operations', '2026-03-05', 'Excellent', 'Deployed', '$1,499.00')
ON CONFLICT (id) DO UPDATE SET
  assigned_to_id = EXCLUDED.assigned_to_id,
  assigned_to_name = EXCLUDED.assigned_to_name,
  status = EXCLUDED.status;

-- =========================================================================
-- SEED DATA: SPRINTS
-- =========================================================================
INSERT INTO public.sprints (id, title, department, lead_id, lead_name, status, progress, velocity, start_date, end_date, goals)
VALUES
  ('SPR-42', 'Sprint 42 • Mobile Ergonomics & Cloud Sync', 'Engineering', 'USR-005', 'Sarah Chen', 'Active', '84%', '48 Story Points', 'Aug 15, 2026', 'Aug 29, 2026', '["Implement 5-tier RBAC", "Realtime Supabase syncing", "Touch-friendly bottom sheets"]'::jsonb),
  ('SPR-43', 'Sprint 43 • Micro-Services & Automated Payroll', 'Engineering', 'USR-002', 'Tunde Bakare', 'Upcoming', '0%', '52 Story Points', 'Sept 01, 2026', 'Sept 15, 2026', '["Direct deposit bank integrations", "Multi-tenant workspace isolation"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  progress = EXCLUDED.progress;

-- =========================================================================
-- SEED DATA: ATTENDANCE
-- =========================================================================
INSERT INTO public.attendance (id, user_id, name, department, date, in_time, out_time, hours, location, status)
VALUES
  ('ATT-101', 'USR-008', 'Udeh Kosisochukwu Emmanuel', 'Engineering', '2026-08-31', '08:45 AM', '05:00 PM', '8h 15m', 'Port Harcourt Office', 'On Time'),
  ('ATT-102', 'USR-005', 'Sarah Chen', 'Engineering', '2026-08-31', '08:30 AM', '05:30 PM', '9h 00m', 'Port Harcourt Office', 'On Time'),
  ('ATT-103', 'USR-009', 'Chidi Nnamdi', 'Product & Design', '2026-08-31', '09:05 AM', '05:00 PM', '7h 55m', 'Port Harcourt Office', 'Present')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SEED DATA: LEAVES
-- =========================================================================
INSERT INTO public.leaves (id, user_id, name, department, manager_id, type, dates, days, reason, status, applied_on)
VALUES
  ('LV-201', 'USR-008', 'Udeh Kosisochukwu Emmanuel', 'Engineering', 'USR-005', 'Annual Leave', '2026-09-08 - 2026-09-12', 5, 'Family vacation and restorative time-off', 'Pending Manager', '2026-08-30'),
  ('LV-202', 'USR-009', 'Chidi Nnamdi', 'Product & Design', 'USR-005', 'Sick Leave', '2026-08-20 - 2026-08-21', 2, 'Medical consultation & fever recovery', 'Approved', '2026-08-19')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SEED DATA: EXPENSE CLAIMS
-- =========================================================================
INSERT INTO public.claims (id, user_id, name, department, manager_id, category, amount, date, description, receipt, status)
VALUES
  ('CLM-301', 'USR-008', 'Udeh Kosisochukwu Emmanuel', 'Engineering', 'USR-005', 'Internet & Remote Work Allowance', '$150.00', '2026-08-28', 'Monthly fiber internet subscription for home dev station', 'fiber_bill_august.pdf', 'Pending Lead'),
  ('CLM-302', 'USR-009', 'Chidi Nnamdi', 'Product & Design', 'USR-005', 'Design Software Asset', '$85.00', '2026-08-25', 'Font licensing bundle for product icon redesign', 'font_license_receipt.pdf', 'Approved')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SEED DATA: SUPPORT TICKETS
-- =========================================================================
INSERT INTO public.tickets (id, user_id, name, department, subject, category, priority, details, assigned_to, status, date)
VALUES
  ('TCK-401', 'USR-008', 'Udeh Kosisochukwu Emmanuel', 'Engineering', 'Request for Secondary 4K Monitor Adapter', 'IT Hardware', 'Medium', 'Need Thunderbolt to DisplayPort converter for workstation setup.', 'Dennis V. (IT Support)', 'In Progress', '2026-08-30')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SEED DATA: ANNOUNCEMENTS
-- =========================================================================
INSERT INTO public.announcements (id, title, content, type, author, date)
VALUES
  ('ANN-501', 'Q3 Strategic Townhall & Multi-Tiered Organization Expansion', 'All hands mandatory virtual townhall to review H1 milestones, new department leadership tiers, and international health coverage expansion.', 'Important', 'Dr. Alexander Vance (CEO)', 'Aug 31, 2026'),
  ('ANN-502', 'Expanded HMO Hospital Network Coverage in Port Harcourt & Lagos', 'Axa Mansard has certified new tier-1 specialist clinics and trauma facilities across Port Harcourt and Lagos.', 'General', 'Victoria Sterling (VP HR)', 'Aug 20, 2026')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SEED DATA: INVOICES
-- =========================================================================
INSERT INTO public.invoices (id, customer, email, issue_date, due_date, amount, amount_num, days_overdue, status)
VALUES
  ('INV-2026-089', 'Apex Technologies Inc.', 'ap@apextech.io', '2026-08-01', '2026-08-15', '$345,000.00', 345000, 17, 'Overdue'),
  ('INV-2026-092', 'Horizon Global Logistics Ltd', 'billing@horizonlog.com', '2026-08-05', '2026-08-20', '$180,000.00', 180000, 12, 'Overdue'),
  ('INV-2026-095', 'Vertex Nordic Semiconductor', 'finance@vertexnordic.se', '2026-08-10', '2026-08-25', '$95,000.00', 95000, 7, 'Overdue'),
  ('INV-2026-098', 'Sterling Energy Corp', 'accounts@sterlingcorp.com', '2026-08-20', '2026-09-05', '$420,000.00', 420000, 0, 'Due Soon'),
  ('INV-2026-101', 'Solaria Power Systems', 'payables@solaria.eu', '2026-08-25', '2026-09-10', '$200,000.00', 200000, 0, 'Pending')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SEED DATA: INVENTORY
-- =========================================================================
INSERT INTO public.inventory (sku, name, category, current_stock, min_threshold, supplier, unit_cost, unit_cost_num, status)
VALUES
  ('SKU-9901', 'Apex Sensor Modules', 'Hardware Components', 14, 50, 'Apex Silicon Dist.', '$45.00', 45, 'Critical'),
  ('SKU-9904', 'High-Density Optical Transceivers', 'Network Equipment', 8, 30, 'Global Logistics', '$120.00', 120, 'Critical'),
  ('SKU-9908', 'Monolith Micro-Controllers v2', 'Microchips', 22, 60, 'Monolith Raw Mat.', '$18.50', 18.5, 'Low Stock'),
  ('SKU-9912', 'Enterprise NVMe SSD 2TB', 'Storage Hardware', 19, 40, 'Supplier ABC', '$85.00', 85, 'Low Stock')
ON CONFLICT (sku) DO NOTHING;

-- =========================================================================
-- SEED DATA: SHIPMENTS
-- =========================================================================
INSERT INTO public.shipments (id, origin, destination, carrier, status, date, progress)
VALUES
  ('SHP-8801', 'Shenzhen Port (SZX)', 'Lagos Hub (LOS)', 'Maersk Global Line', 'In Transit', 'Aug 29, 2026', 68),
  ('SHP-8804', 'Rotterdam Europort (RTM)', 'Port Harcourt Terminal', 'Hapag-Lloyd Ocean', 'Customs Clearance', 'Sept 02, 2026', 85),
  ('SHP-8809', 'Singapore Changi (SIN)', 'Lagos Air Cargo', 'DHL Global Forwarding', 'Dispatched', 'Sept 04, 2026', 35)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Users
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated read users' AND tablename = 'users') THEN
    CREATE POLICY "Allow authenticated read users" ON public.users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert users' AND tablename = 'users') THEN
    CREATE POLICY "Allow insert users" ON public.users FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update users' AND tablename = 'users') THEN
    CREATE POLICY "Allow update users" ON public.users FOR UPDATE USING (true);
  END IF;

  -- Departments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated read departments' AND tablename = 'departments') THEN
    CREATE POLICY "Allow authenticated read departments" ON public.departments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert departments' AND tablename = 'departments') THEN
    CREATE POLICY "Allow insert departments" ON public.departments FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update departments' AND tablename = 'departments') THEN
    CREATE POLICY "Allow update departments" ON public.departments FOR UPDATE USING (true);
  END IF;

  -- Leaves
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated read leaves' AND tablename = 'leaves') THEN
    CREATE POLICY "Allow authenticated read leaves" ON public.leaves FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated insert leaves' AND tablename = 'leaves') THEN
    CREATE POLICY "Allow authenticated insert leaves" ON public.leaves FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated update leaves' AND tablename = 'leaves') THEN
    CREATE POLICY "Allow authenticated update leaves" ON public.leaves FOR UPDATE USING (true);
  END IF;

  -- Invoices
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read invoices' AND tablename = 'invoices') THEN
    CREATE POLICY "Allow public read invoices" ON public.invoices FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update invoices' AND tablename = 'invoices') THEN
    CREATE POLICY "Allow public update invoices" ON public.invoices FOR UPDATE USING (true);
  END IF;

  -- Inventory
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read inventory' AND tablename = 'inventory') THEN
    CREATE POLICY "Allow public read inventory" ON public.inventory FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update inventory' AND tablename = 'inventory') THEN
    CREATE POLICY "Allow update inventory" ON public.inventory FOR UPDATE USING (true);
  END IF;

  -- Purchase Orders
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read purchase_orders' AND tablename = 'purchase_orders') THEN
    CREATE POLICY "Allow public read purchase_orders" ON public.purchase_orders FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert purchase_orders' AND tablename = 'purchase_orders') THEN
    CREATE POLICY "Allow insert purchase_orders" ON public.purchase_orders FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update purchase_orders' AND tablename = 'purchase_orders') THEN
    CREATE POLICY "Allow update purchase_orders" ON public.purchase_orders FOR UPDATE USING (true);
  END IF;

  -- Shipments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read shipments' AND tablename = 'shipments') THEN
    CREATE POLICY "Allow public read shipments" ON public.shipments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert shipments' AND tablename = 'shipments') THEN
    CREATE POLICY "Allow insert shipments" ON public.shipments FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update shipments' AND tablename = 'shipments') THEN
    CREATE POLICY "Allow update shipments" ON public.shipments FOR UPDATE TO public USING (true);
  END IF;

  -- Announcements
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on announcements' AND tablename = 'announcements') THEN
    CREATE POLICY "Allow all on announcements" ON public.announcements FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  -- Assets
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on assets' AND tablename = 'assets') THEN
    CREATE POLICY "Allow all on assets" ON public.assets FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  -- Attendance
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on attendance' AND tablename = 'attendance') THEN
    CREATE POLICY "Allow all on attendance" ON public.attendance FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  -- Claims
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on claims' AND tablename = 'claims') THEN
    CREATE POLICY "Allow all on claims" ON public.claims FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  -- Sprints
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on sprints' AND tablename = 'sprints') THEN
    CREATE POLICY "Allow all on sprints" ON public.sprints FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  -- Tickets
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on tickets' AND tablename = 'tickets') THEN
    CREATE POLICY "Allow all on tickets" ON public.tickets FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;
END $$;

