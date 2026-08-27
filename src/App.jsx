import { useState, useEffect, useCallback } from "react";
import ESSDashboard from "./components/ESSDashboard";
import HRDashboard from "./components/HRDashboard";
import Login from "./components/Login";
import { auth } from "./services/auth";
import { db } from "./services/db";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import "./App.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const session = auth.getCurrentSession();
    return session ? session.user : null;
  });

  const [theme, setTheme] = useState(() => localStorage.getItem("monolith_theme") || "light");
  const [toasts, setToasts] = useState([]);

  // Live Database States initialized from persistent storage
  const [leaveRequests, setLeaveRequests] = useState(() => db.getLeaves());
  const [announcements, setAnnouncements] = useState(() => db.getAnnouncements());
  const [claims, setClaims] = useState(() => db.getClaims());
  const [tickets, setTickets] = useState(() => db.getTickets());
  const [attendanceRecords, setAttendanceRecords] = useState(() => db.getAttendance());
  const [allEmployees, setAllEmployees] = useState(() => db.getUsers());

  // Attendance live clock state
  const [attendanceStatus, setAttendanceStatus] = useState({
    isClockedIn: false,
    clockInTime: null,
    currentRecordId: null,
  });

  const addToast = useCallback((title, message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const refreshDatabase = useCallback(() => {
    setLeaveRequests(db.getLeaves());
    setAnnouncements(db.getAnnouncements());
    setClaims(db.getClaims());
    setTickets(db.getTickets());
    setAttendanceRecords(db.getAttendance());
    setAllEmployees(db.getUsers());

    if (currentUser?.id) {
      const updated = db.getUserById(currentUser.id);
      if (updated) setCurrentUser(updated);
    }
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("monolith_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogin = async ({ email, password }) => {
    const session = await auth.login(email, password);
    setCurrentUser(session.user);
    refreshDatabase();
    addToast("Signed In", `Welcome back, ${session.user.name}`, "success");
  };

  const handleRegister = async (signupData) => {
    const session = await auth.register(signupData);
    setCurrentUser(session.user);
    refreshDatabase();
    addToast("Account Created", `Welcome to Monolith, ${session.user.name}`, "success");
  };

  const handleLogout = () => {
    auth.logout();
    setCurrentUser(null);
    setAttendanceStatus({ isClockedIn: false, clockInTime: null, currentRecordId: null });
    addToast("Signed Out", "You have been securely logged out.", "info");
  };

  // Clock in / out operations
  const handleClockToggle = () => {
    if (!currentUser) return;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (!attendanceStatus.isClockedIn) {
      const newRec = db.addAttendance({
        userId: currentUser.id,
        name: currentUser.name,
        date: today,
        in: now,
        out: "—",
        hours: "In Progress",
        location: currentUser.location || "Office",
        status: "On Time",
      });

      setAttendanceStatus({
        isClockedIn: true,
        clockInTime: now,
        currentRecordId: newRec.id,
      });

      refreshDatabase();
      addToast("Shift Started", `Clocked IN at ${now}`, "success");
    } else {
      if (attendanceStatus.currentRecordId) {
        db.updateAttendance(attendanceStatus.currentRecordId, {
          out: now,
          hours: "8h 15m",
          status: "Present",
        });
      }

      setAttendanceStatus({
        isClockedIn: false,
        clockInTime: null,
        currentRecordId: null,
      });

      refreshDatabase();
      addToast("Shift Ended", `Clocked OUT at ${now}`, "info");
    }
  };

  // Leave operations
  const handleAddLeave = (req) => {
    if (!currentUser) return;
    db.createLeave({
      userId: currentUser.id,
      name: currentUser.name,
      ...req,
    });
    refreshDatabase();
    addToast("Leave Applied", "Leave request submitted for administrative review.", "success");
  };

  const handleUpdateLeaveStatus = (id, status) => {
    db.updateLeaveStatus(id, status);
    refreshDatabase();
    addToast("Leave Request Updated", `Request marked as ${status}.`, "info");
  };

  // Claims operations
  const handleAddClaim = (claim) => {
    if (!currentUser) return;
    db.createClaim({
      userId: currentUser.id,
      name: currentUser.name,
      ...claim,
    });
    refreshDatabase();
    addToast("Claim Submitted", "Expense claim sent to HR Finance for verification.", "success");
  };

  const handleUpdateClaimStatus = (id, status) => {
    db.updateClaimStatus(id, status);
    refreshDatabase();
    addToast("Claim Updated", `Claim marked as ${status}.`, "info");
  };

  // Tickets operations
  const handleAddTicket = (ticket) => {
    if (!currentUser) return;
    db.createTicket({
      userId: currentUser.id,
      name: currentUser.name,
      ...ticket,
    });
    refreshDatabase();
    addToast("Support Ticket Created", "Logged into the IT/HR support queue.", "success");
  };

  const handleUpdateTicketStatus = (id, status) => {
    db.updateTicketStatus(id, status);
    refreshDatabase();
    addToast("Ticket Updated", `Ticket status changed to ${status}.`, "info");
  };

  // Announcements
  const handleAddAnnouncement = (ann) => {
    if (!currentUser) return;
    db.createAnnouncement({
      author: currentUser.name,
      ...ann,
    });
    refreshDatabase();
    addToast("Announcement Published", "New notice broadcasted to workspace.", "success");
  };

  // Profile update
  const handleUpdateProfile = (updates) => {
    if (!currentUser) return;
    const updated = db.updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
      refreshDatabase();
      addToast("Profile Updated", "Personnel record saved successfully.", "success");
    }
  };

  // Add Employee (Admin only)
  const handleAddEmployee = (empData) => {
    db.createUser(empData);
    refreshDatabase();
    addToast("Employee Onboarded", "New staff account created in company directory.", "success");
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // Payments / Payslips data
  const defaultPayments = [
    {
      id: 1,
      month: "July 2026",
      payDate: "2026-07-28",
      gross: currentUser.salary || "$3,500.00",
      tax: "$400.00",
      pension: "$150.00",
      medical: "$50.00",
      net: "$2,900.00",
      status: "Paid",
    },
    {
      id: 2,
      month: "June 2026",
      payDate: "2026-06-27",
      gross: currentUser.salary || "$3,500.00",
      tax: "$400.00",
      pension: "$150.00",
      medical: "$50.00",
      net: "$2,900.00",
      status: "Paid",
    },
  ];

  return (
    <div>
      {/* Toast Notification Popups */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" && <CheckCircle2 className="toast-icon" />}
            {t.type === "error" && <AlertCircle className="toast-icon" />}
            {t.type === "info" && <Info className="toast-icon" />}
            <div className="toast-content">
              <h4>{t.title}</h4>
              <p>{t.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Role Routed Active Workspace */}
      {currentUser.role === "admin" ? (
        <HRDashboard
          profile={currentUser}
          employees={allEmployees}
          onAddEmployee={handleAddEmployee}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
          leaveRequests={leaveRequests}
          onUpdateStatus={handleUpdateLeaveStatus}
          announcements={announcements}
          onAddAnnouncement={handleAddAnnouncement}
          claims={claims}
          onUpdateClaimStatus={handleUpdateClaimStatus}
          attendanceRecords={attendanceRecords}
          tickets={tickets}
          onUpdateTicketStatus={handleUpdateTicketStatus}
        />
      ) : (
        <ESSDashboard
          profile={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          leaveRequests={leaveRequests.filter((l) => l.userId === currentUser.id || !l.userId)}
          onSubmitLeave={handleAddLeave}
          announcements={announcements}
          payments={defaultPayments}
          claims={claims.filter((c) => c.userId === currentUser.id || !c.userId)}
          onSubmitClaim={handleAddClaim}
          attendanceRecords={attendanceRecords.filter((a) => a.userId === currentUser.id || !a.userId)}
          attendanceStatus={attendanceStatus}
          onClockToggle={handleClockToggle}
          tickets={tickets.filter((t) => t.userId === currentUser.id || !t.userId)}
          onAddTicket={handleAddTicket}
        />
      )}
    </div>
  );
}