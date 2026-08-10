import React, { useState } from "react";
import ESSDashboard from "./components/ESSDashboard";
import HRDashboard from "./components/HRDashboard";
import Login from "./components/Login";

export default function App() {
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);

  // Shared state across both dashboards
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employee: "Udeh Kosisochukwu",
      name: "Udeh Kosisochukwu",
      type: "Annual Leave",
      dates: "2026-08-10 - 2026-08-15",
      days: 5,
      reason: "Personal Vacation",
      status: "Pending",
    },
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Company Townhall Meeting",
      date: "Aug 10, 2026",
      type: "Important",
      content: "Mandatory virtual meeting for all staff.",
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
      net: "$2,950.00",
      amount: "$2,950.00",
      status: "Paid",
    },
  ]);

  const [claims, setClaims] = useState([
    {
      id: 1,
      employee: "Udeh Kosisochukwu",
      name: "Udeh Kosisochukwu",
      category: "Travel Expense",
      amount: "$150",
      date: "2026-08-01",
      description: "Client visit mileage and transport",
      status: "Pending",
    },
  ]);

  const [tickets, setTickets] = useState([
    {
      id: "TCK-401",
      name: "Udeh Kosisochukwu Emmanuel",
      subject: "Request for New Laptop Battery",
      category: "IT Hardware",
      date: "2026-06-15",
      priority: "High",
      status: "In Progress",
      details: "HP EliteBook battery replacement requested due to physical swelling.",
    },
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      empId: "EMP-2026-042",
      name: "Udeh Kosisochukwu",
      date: "2026-08-05",
      in: "08:45 AM",
      out: "05:30 PM",
      total: "8h 45m",
      overtime: "45m",
      status: "On Time",
    },
    {
      id: 2,
      empId: "EMP-2026-018",
      name: "Sarah Chen",
      date: "2026-08-05",
      in: "08:30 AM",
      out: "—",
      total: "4h 15m (In Progress)",
      overtime: "0m",
      status: "On Time",
    },
    {
      id: 3,
      empId: "EMP-2026-009",
      name: "Alex Rivera",
      date: "2026-08-05",
      in: "09:20 AM",
      out: "—",
      total: "3h 25m (In Progress)",
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

  const timeToMinutes = (value) => {
    if (!value || value === "—") return null;
    const [timePart, meridiem] = value.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);
    let total = hours * 60 + minutes;

    if (meridiem?.toUpperCase() === "PM" && hours !== 12) total += 12 * 60;
    if (meridiem?.toUpperCase() === "AM" && hours === 12) total -= 12 * 60;

    return total;
  };

  const formatDuration = (minutes) => {
    const safeMinutes = Math.max(0, Math.round(minutes));
    const hours = Math.floor(safeMinutes / 60);
    const mins = safeMinutes % 60;
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  };

  const formatOvertime = (minutes) => {
    const overtime = Math.max(0, minutes - 8 * 60);
    return overtime > 0 ? formatDuration(overtime) : "0m";
  };

  // Handlers for adding/updating data
  const handleAddLeave = (req) => {
    const [startDate, endDate] = String(req.dates || "").split("-").map((part) => part.trim());
    const parsedStart = startDate ? new Date(startDate) : null;
    const parsedEnd = endDate ? new Date(endDate) : null;
    const days = parsedStart && parsedEnd
      ? Math.max(1, Math.ceil((parsedEnd - parsedStart) / (1000 * 60 * 60 * 24)) + 1)
      : 1;

    setLeaveRequests((prev) => [
      {
        id: Date.now(),
        employee: "Udeh Kosisochukwu",
        name: "Udeh Kosisochukwu",
        status: "Pending",
        days,
        ...req,
      },
      ...prev,
    ]);
  };

  const handleUpdateLeave = (id, status) =>
    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const handleAddAnnouncement = (ann) =>
    setAnnouncements((prev) => [{ id: Date.now(), ...ann }, ...prev]);

  const handleAddClaim = (claim) =>
    setClaims((prev) => [
      {
        id: Date.now(),
        employee: "Udeh Kosisochukwu",
        name: "Udeh Kosisochukwu",
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
        ...claim,
      },
      ...prev,
    ]);

  const handleUpdateClaim = (id, status) =>
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  const handleAddTicket = (ticket) => {
    setTickets((prev) => [
      {
        id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
        name: "Udeh Kosisochukwu Emmanuel",
        priority: "Medium",
        date: new Date().toISOString().split("T")[0],
        status: "Open",
        ...ticket,
      },
      ...prev,
    ]);
  };

  const handleUpdateTicketStatus = (id, status) =>
    setTickets((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)));

  const handleClockToggle = () => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!attendanceStatus.isClockedIn) {
      setAttendanceStatus({
        isClockedIn: true,
        clockInTime: now,
        clockOutTime: null,
        date: today,
      });

      setAttendanceRecords((prev) => {
        const existingToday = prev.find(
          (record) => record.empId === "EMP-2026-042" && record.date === today
        );

        if (existingToday) {
          return prev.map((record) =>
            record.id === existingToday.id
              ? {
                  ...record,
                  in: now,
                  out: "—",
                  total: "0h 00m (In Progress)",
                  overtime: "0m",
                  status: "On Time",
                }
              : record
          );
        }

        return [
          {
            id: Date.now(),
            empId: "EMP-2026-042",
            name: "Udeh Kosisochukwu",
            date: today,
            in: now,
            out: "—",
            total: "0h 00m (In Progress)",
            overtime: "0m",
            status: "On Time",
          },
          ...prev,
        ];
      });

      return;
    }

    const clockInTime = attendanceStatus.clockInTime || "08:45 AM";
    const clockInMinutes = timeToMinutes(clockInTime);
    const clockOutMinutes = timeToMinutes(now);
    const workedMinutes =
      clockInMinutes !== null && clockOutMinutes !== null
        ? Math.max(0, clockOutMinutes - clockInMinutes)
        : 0;

    setAttendanceStatus({
      isClockedIn: false,
      clockInTime: null,
      clockOutTime: now,
      date: today,
    });

    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.empId === "EMP-2026-042" && record.date === today
          ? {
              ...record,
              out: now,
              total: formatDuration(workedMinutes),
              overtime: formatOvertime(workedMinutes),
              status: "On Time",
            }
          : record
      )
    );
  };

  const handleLogin = ({ email, password, selectedRole }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const authenticatedRole =
      normalizedEmail === "hr@company.com"
        ? "admin"
        : normalizedEmail === "employee@company.com"
        ? "employee"
        : selectedRole;

    const profile = {
      name: authenticatedRole === "admin" ? "HR Administrator" : "Udeh Kosisochukwu",
      email: normalizedEmail,
      role: authenticatedRole,
      team: authenticatedRole === "admin" ? "People Operations" : "Software Engineering",
    };

    setRole(authenticatedRole);
    setProfile(profile);
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* Floating View Switcher */}
      <div style={switcherStyle}>
        <span>Signed in as: <strong>{profile?.name || "User"}</strong></span>
        <span>Role: <strong>{role.toUpperCase()}</strong></span>
        <button
          onClick={() => {
            setRole(null);
            setProfile(null);
          }}
        >
          Sign Out
        </button>
      </div>

      {role === "employee" ? (
        <ESSDashboard
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
    </div>
  );
}

const switcherStyle = {
  position: "fixed",
  bottom: "16px",
  right: "16px",
  backgroundColor: "rgba(15, 23, 42, 0.96)",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "16px",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  zIndex: 9999,
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.2)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  fontSize: "13px",
};