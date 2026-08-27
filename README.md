# MONOLITH • Enterprise Human Capital & Operations Platform

> A production-grade, mobile-first Workforce Operating System built with React 19 and Vite. Designed with an enriched Nordic Minimalist design system, real persistent database architecture, secure session authentication, and instant cloud deployment.

---

## 🌟 Key Highlights

- **Mobile-First Ergonomics:** Thumb-friendly bottom navigation bar, hero shift clock widget, mobile stacked cards (no horizontal table scrolling on phones), and native bottom sheet modals.
- **Enriched Nordic Minimalist System:** High-contrast monochrome foundation, tactile micro-interactions (`transform: scale(0.97)`), micro-progress tracks, and soft tinted icon badges.
- **Real Account Authentication & Persistence:** Real corporate sign-in, staff registration, and session token management. No mock switchers.
- **Reactive Workflow Engine:** Leave approvals deduct dynamically from employee balances, expense claims update payout queues, and broadcasts distribute instantly.
- **Cloud Deployment Ready:** Pre-configured with `vercel.json` and `netlify.toml` for 1-click hosting.

---

## 📱 Modules & Features

### 1. Employee Self-Service (ESS) Portal
* **Daily Shift Attendance:** Live ticking timer with one-tap Clock In / Clock Out and geolocation logging.
* **Leave Management:** Annual, sick, and casual leave requests with live balance countdown tracks.
* **Itemized Payslips:** Monthly gross, tax (PAYE), pension (8%), and medical deductions with net take-home breakdown.
* **Expense Claims:** Out-of-pocket reimbursement submissions with category tagging and receipt attachments.
* **Helpdesk Support:** IT hardware and software access ticket logging with priority queuing.
* **Corporate HMO & Coverage:** Health insurance policy details, clinic directory, and 24/7 hotline.
* **OKRs & Performance:** Quarterly goals progress and manager rating assessments.

### 2. HR Executive Command Center
* **Executive KPI Metrics:** Active headcount, pending approval queues, reimbursement liabilities, and SLA metrics.
* **Staff Roster & Dossiers:** Searchable employee directory with department filtering and compensation dossiers.
* **Real-Time Attendance Monitoring:** Organization-wide punctuality tracking and remote check-in logs.
* **Leave Approvals Queue:** One-tap approval and rejection workflows that update database balances reactively.
* **Payroll & Claims Verification:** Financial audit queues for reimbursing employee claims and dispatching payroll.
* **Support Ticket Triage:** Categorized queue to assign, resolve, and close IT/HR tickets.
* **Broadcast Notices:** Urgent and general organizational bulletins broadcasted to all employees.

---

## 🚀 Live Cloud Deployment

This repository is optimized for zero-config deployment on **Vercel** or **Netlify**:

### Deploy to Vercel (Recommended):
1. Import this repository [`Kosis0/Company-Portal`](https://github.com/Kosis0/Company-Portal) on [Vercel](https://vercel.com/new).
2. Click **Deploy** (Vite framework preset is detected automatically).
3. Access your live application at `https://your-project.vercel.app` on any phone, tablet, or desktop.

---

## 🛠️ Local Development

### Prerequisites
- Node.js v18 or later
- npm v9 or later

```bash
# Clone repository
git clone https://github.com/Kosis0/Company-Portal.git
cd Company-Portal

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting check
npm run lint

# Production build
npm run build
```

---

## 🔑 Default Verified Accounts

| Role | Corporate Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **HR / Ops Admin** | `admin@company.com` | `password123` | Workforce KPIs, Staff Onboarding, Leave Approvals, Claims Verification, Broadcasts |
| **Engineering Staff** | `employee@company.com` | `password123` | Shift Clock, Leave Requests, Itemized Payslips, Expense Claims, Support Tickets |
| **Tech Lead** | `sarah.chen@company.com` | `password123` | Self-Service Portal & Team Activity |

*New staff accounts can also be created directly via the **Register New Account** tab.*

---

## 📄 License
Licensed under the [MIT License](LICENSE).
