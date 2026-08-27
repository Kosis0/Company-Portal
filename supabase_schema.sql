-- =========================================================================
-- MONOLITH ENTERPRISE ERP • SUPABASE DATABASE INITIALIZATION SCHEMA
-- Run this in your Supabase SQL Editor to create all tables and seed accounts
-- =========================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT DEFAULT 'Staff Member',
  department TEXT DEFAULT 'Engineering',
  role TEXT DEFAULT 'employee', -- 'employee' | 'admin'
  phone TEXT DEFAULT '+234 800 000 0000',
  location TEXT DEFAULT 'Port Harcourt, Nigeria',
  manager TEXT DEFAULT 'Sarah Chen (Tech Lead)',
  bank_name TEXT DEFAULT 'First Bank of Nigeria',
  account_number TEXT DEFAULT '3049283482',
  tax_id TEXT DEFAULT 'TIN-98234711',
  pension_pin TEXT DEFAULT 'PEN-100293847',
  salary TEXT DEFAULT '$3,500/mo',
  score TEXT DEFAULT '4.5 / 5.0',
  status TEXT DEFAULT 'Active',
  annual_leave_balance INT DEFAULT 20,
  sick_leave_balance INT DEFAULT 10,
  casual_leave_balance INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ATTENDANCE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  in_time TEXT NOT NULL,
  out_time TEXT DEFAULT '—',
  hours TEXT DEFAULT 'In Progress',
  location TEXT DEFAULT 'Port Harcourt Office',
  status TEXT DEFAULT 'On Time',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LEAVE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.leaves (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  dates TEXT NOT NULL,
  days INT DEFAULT 1,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'Pending', -- 'Pending' | 'Approved' | 'Rejected'
  applied_on TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXPENSE CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.claims (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  receipt TEXT DEFAULT 'receipt_invoice.pdf',
  status TEXT DEFAULT 'Pending', -- 'Pending' | 'Approved' | 'Rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium', -- 'Low' | 'Medium' | 'High'
  details TEXT,
  assigned_to TEXT DEFAULT 'Dennis V. (IT Support)',
  status TEXT DEFAULT 'Open', -- 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'Important', -- 'Important' | 'General' | 'Policy'
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE REALTIME ON ALL TABLES
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaves;
ALTER PUBLICATION supabase_realtime ADD TABLE public.claims;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- SEED DEFAULT ACCOUNTS & DATA
INSERT INTO public.users (id, email, password, name, title, department, role, location, salary, annual_leave_balance, sick_leave_balance, casual_leave_balance)
VALUES 
  ('USR-001', 'admin@company.com', 'password123', 'Victoria Sterling', 'VP of People Operations', 'Human Resources', 'admin', 'Lagos, Nigeria', '$8,500/mo', 25, 12, 5),
  ('USR-002', 'employee@company.com', 'password123', 'Udeh Kosisochukwu Emmanuel', 'Software Developer Intern', 'Engineering', 'employee', 'Port Harcourt, Nigeria', '$3,500/mo', 14, 8, 4),
  ('USR-003', 'sarah.chen@company.com', 'password123', 'Sarah Chen', 'Tech Lead & Principal Architect', 'Engineering', 'employee', 'Port Harcourt, Nigeria', '$6,200/mo', 18, 10, 5)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.announcements (id, title, content, type, author, date)
VALUES
  ('ANN-501', 'Company Q3 Strategic Townhall & Compensation Updates', 'Mandatory virtual townhall to review H1 revenue milestones, Q3 goals, and benefits expansions across all locations.', 'Important', 'Victoria Sterling (People Ops)', 'Aug 15, 2026'),
  ('ANN-502', 'Expanded HMO Hospital Network Coverage in Port Harcourt & Lagos', 'Axa Mansard has expanded primary healthcare centers and specialist clinics across Lagos Island and Port Harcourt.', 'General', 'HR Benefits Admin', 'Aug 08, 2026')
ON CONFLICT (id) DO NOTHING;
