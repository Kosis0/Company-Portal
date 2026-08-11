import React, { useState, useEffect } from "react";
import ESSDashboard from "./components/ESSDashboard";
import HRDashboard from "./components/HRDashboard";
import Login from "./components/Login";
import "./App.css";

export default function App() {
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("nexus_theme") || "light");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nexus_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addToast = (title, message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Shared state across both dashboards
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 101,
      employee: "Udeh Kosisochukwu",
      name: "Udeh Kosisochukwu",
      type: "Annual Leave",
      dates: "2026-08-18 - 2026-08-25",
      days: 6,
      reason: "Summer vacation and family rest",
      status: "Pending",
      appliedOn: "2026-08-10",
    },
    {
      id: 102,
      employee: "Sarah Chen",
      name: "Sarah Chen",
      type: "Sick Leave",
      dates: "2026-08-01 - 2026-08-02",
      days: 2,
      reason: "Flu recovery",
      status: "Approved",
      appliedOn: "2026-07-31",
    },
    {
      id: 103,
      employee: "Alex Rivera",
      name: "Alex Rivera",
      type: "Casual Leave",
      dates: "2026-07-15 - 2026-07-16",
      days: 1,
      reason: "Personal appointment",
      status: "Approved",
      appliedOn: "2026-07-12",
    },
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Company Q3 Townhall Meeting",
      date: "Aug 15, 2026",
      type: "Important",
      author: "People Operations",
      content: "Mandatory virtual townhall to outline Q3 goals, team achievements, and benefits upgrades.",
    },
    {
      id: 2,
      title: "Updated HMO Clinic Network Coverage",
      date: "Aug 08, 2026",
      type: "General",
      author: "HR Benefits Admin",
      content: "Axa Mansard has expanded primary healthcare centers across Lagos and Port Harcourt.",
    },
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      employee: "Udeh Kosisochukwu",
      month: "July 2026",
      payDate: "2026-07-28",
      gross: "$3,500.00",
      tax: "$400.00",
      pension: "$150.00",
      medical: "$50.00",
      net: "$2,900.00",
      amount: "$2,900.00",
      status: "Paid",
    },
    {
      id: 2,
      employee: "Udeh Kosisochukwu",
      month: "June 2026",
      payDate: "2026-06-27",
      gross: "$3,500.00",
      tax: "$400.00",
      pension: "$150.00",
      medical: "$50.00",
      net: "$2,900.00",
      amount: "$2,900.00",
      status: "Paid",
    },
  ]);

  const [claims, setClaims] = useState([
    {
      id: 1,
      employee: "Udeh Kosisochukwu",
      name: "Udeh Kosisochukwu",
      category: "Internet & Data Allowance",
      amount: "$150",
      date: "2026-08-01",
      description: "Monthly fiber internet subscription for remote setup",
      status: "Pending",
      receipt: "internet_receipt_aug.pdf",
    },
    {
      id: 2,
      employee: "Sarah Chen",
      name: "Sarah Chen",
      category: "Client Transport",
      amount: "$85",
      date: "2026-08-04",
      description: "Taxi mileage for partner sync meeting",
      status: "Approved",
      receipt: "taxi_voucher.pdf",
    },
  ]);

  const [tickets, setTickets] = useState([
    {
      id: "TCK-401",
      name: "Udeh Kosisochukwu Emmanuel",
      subject: "Request for Replacement Workstation Battery",
      category: "IT Hardware",
      date: "2026-08-05",
      priority: "High",
      status: "In Progress",
      assignedTo: "Dennis V. (IT Support)",
      details: "Laptop battery degradation causing rapid shutdown without charger plugged in.",
    },
    {
      id: "TCK-388",
      name: "Sarah Chen",
      subject: "VPN Access Grant for New Staging Server",
      category: "Network & Security",
      date: "2026-08-02",
      priority: "Medium",
      status: "Resolved",
      assignedTo: "Infra Security Team",
      details: "Requesting developer IP whitelist for staging environment deployment.",
    },
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      empId: "EMP-2026-042",
      name: "Udeh Kosisochukwu",
      date: "2026-08-11",
      in: "08:45 AM",
      out: "—",
      total: "3h 30m (In Progress)",
      overtime: "0m",
      status: "On Time",
    },
    {
      id: 2,
      empId: "EMP-2026-018",
      name: "Sarah Chen",
      date: "2026-08-11",
      in: "08:30 AM",
      out: "—",
      total: "3h 45m (In Progress)",
      overtime: "0m",
      status: "On Time",
    },
    {
      id: 3,
      empId: "EMP-2026-009",
      name: "Alex Rivera",
      date: "2026-08-11",
      in: "09:20 AM",
      out: "—",
      total: "2h 55m (In Progress)",
      overtime: "0m",
      status: "Late",
    },
  ]);

  const [attendanceStatus, setAttendanceStatus] = useState({
    isClockedIn: false,
    clockInTime: null,
    clockOutTime: null,
    date: new Date().toISOString().split("T")[0],
  });

  const handleAddLeave = (req) => {
    setLeaveRequests((prev) => [
      {
        id: Date.now(),
        employee: profile?.name || "Udeh Kosisochukwu",
        name: profile?.name || "Udeh Kosisochukwu",
        status: "Pending",
        appliedOn: new Date().toISOString().split("T")[0],
        ...req,
      },
      ...prev,
    ]);
    addToast("Leave Applied", "Your leave request has been submitted for HR approval.", "success");
  };

  const handleUpdateLeave = (id, status) => {
    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    addToast("Leave Request Updated", `Request marked as ${status}.`, "info");
  };

  const handleAddAnnouncement = (ann) => {
    setAnnouncements((prev) => [
      { id: Date.now(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), ...ann },
      ...prev,
    ]);
    addToast("Announcement Published", "New notice added for all employees.", "success");
  };

  const handleAddClaim = (claim) => {
    setClaims((prev) => [
      {
        id: Date.now(),
        employee: profile?.name || "Udeh Kosisochukwu",
        name: profile?.name || "Udeh Kosisochukwu",
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
        receipt: claim.receiptName || "receipt_attachment.pdf",
        ...claim,
      },
      ...prev,
    ]);
    addToast("Reimbursement Submitted", "Claim sent to HR Finance for audit.", "success");
  };

  const handleUpdateClaim = (id, status) => {
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    addToast("Claim Updated", `Expense claim status changed to ${status}.`, "info");
  };

  const handleAddTicket = (ticket) => {
    setTickets((prev) => [
      {
        id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
        name: profile?.name || "Udeh Kosisochukwu Emmanuel",
        date: new Date().toISOString().split("T")[0],
        status: "Open",
        assignedTo: "Unassigned Queue",
        ...ticket,
      },
      ...prev,
    ]);
    addToast("Support Ticket Created", "Ticket logged into the IT/HR queue.", "success");
  };

  const handleUpdateTicketStatus = (id, status) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)));
    addToast("Ticket Status Updated", `Ticket ${id} marked as ${status}.`, "info");
  };

  const handleClockToggle = () => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (!attendanceStatus.isClockedIn) {
      setAttendanceStatus({
        isClockedIn: true,
        clockInTime: now,
        clockOutTime: null,
        date: today,
      });

      setAttendanceRecords((prev) => [
        {
          id: Date.now(),
          empId: "EMP-2026-042",
          name: profile?.name || "Udeh Kosisochukwu",
          date: today,
          in: now,
          out: "—",
          total: "0h 00m (In Progress)",
          overtime: "0m",
          status: "On Time",
        },
        ...prev.filter((r) => !(r.empId === "EMP-2026-042" && r.date === today)),
      ]);

      addToast("Shift Started", `Clocked IN at ${now}`, "success");
    } else {
      setAttendanceStatus({
        isClockedIn: false,
        clockInTime: null,
        clockOutTime: now,
        date: today,
      });

      setAttendanceRecords((prev) =>
        prev.map((record) =>
          record.empId === "EMP-2026-042" && record.date === today
            ? { ...record, out: now, total: "8h 15m", overtime: "15m" }
            : record
        )
      );

      addToast("Shift Ended", `Clocked OUT at ${now}`, "info");
    }
  };

  const handleLogin = ({ email, selectedRole }) => {
    const authenticatedRole = selectedRole;
    const userProfile = {
      name: authenticatedRole === "admin" ? "HR Administrator" : "Udeh Kosisochukwu",
      email,
      role: authenticatedRole,
      department: authenticatedRole === "admin" ? "People Operations" : "Software Engineering",
    };

    setRole(authenticatedRole);
    setProfile(userProfile);
    addToast("Signed In", `Welcome back, ${userProfile.name}`, "success");
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* Toast Notification Popups */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div className="toast-content">
              <h4>{t.title}</h4>
              <p>{t.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Active Dashboard */}
      {role === "employee" ? (
        <ESSDashboard
          profile={profile}
          theme={theme}
          onToggleTheme={toggleTheme}
          leaveRequests={leaveRequests}
          onSubmitLeave={handleAddLeave}
          announcements={announcements}
          payments={payments}
          claims={claims}
          onSubmitClaim={handleAddClaim}
          attendanceRecords={attendanceRecords}
          attendanceStatus={attendanceStatus}
          onClockToggle={handleClockToggle}
          tickets={tickets}
          onAddTicket={handleAddTicket}
        />
      ) : (
        <HRDashboard
          profile={profile}
          theme={theme}
          onToggleTheme={toggleTheme}
          leaveRequests={leaveRequests}
          onUpdateStatus={handleUpdateLeave}
          announcements={announcements}
          onAddAnnouncement={handleAddAnnouncement}
          payments={payments}
          claims={claims}
          onUpdateClaimStatus={handleUpdateClaim}
          attendanceRecords={attendanceRecords}
          tickets={tickets}
          onUpdateTicketStatus={handleUpdateTicketStatus}
        />
      )}

      {/* Floating View & Persona Switcher */}
      <div className="floating-role-switcher">
        <span>Persona: <strong>{profile?.name} ({role.toUpperCase()})</strong></span>
        
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            const nextRole = role === "employee" ? "admin" : "employee";
            setRole(nextRole);
            setProfile({
              name: nextRole === "admin" ? "HR Administrator" : "Udeh Kosisochukwu",
              email: nextRole === "admin" ? "hr@company.com" : "employee@company.com",
              role: nextRole,
              department: nextRole === "admin" ? "People Operations" : "Software Engineering",
            });
            addToast("Role Switched", `Switched view to ${nextRole.toUpperCase()}`, "info");
          }}
        >
          Switch View to {role === "employee" ? "HR Admin" : "Employee"}
        </button>

        <button
          className="floating-signout-btn"
          onClick={() => {
            setRole(null);
            setProfile(null);
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}