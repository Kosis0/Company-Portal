import { useState, useEffect, useCallback } from "react";
import EnterpriseShell from "./components/EnterpriseShell";
import Login from "./components/Login";
import ErrorBoundary from "./components/ErrorBoundary";
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
  const [departments, setDepartments] = useState(() => db.getDepartments());
  const [assets, setAssets] = useState(() => db.getAssets());
  const [sprints, setSprints] = useState(() => db.getSprints());
  const [orgTree, setOrgTree] = useState(() => db.getOrgTree());

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
    setDepartments(db.getDepartments());
    setAssets(db.getAssets());
    setSprints(db.getSprints());
    setOrgTree(db.getOrgTree());

    if (currentUser?.id) {
      const updated = db.getUserById(currentUser.id);
      if (updated) setCurrentUser(updated);
    }
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("monolith_theme", theme);
  }, [theme]);

  useEffect(() => {
    // Asynchronously pull remote records into local cache and refresh UI
    db.hydrateFromSupabase().then(() => {
      refreshDatabase();
    }).catch((err) => {
      console.warn("Supabase hydration skipped:", err?.message || err);
    });

    const unsubscribe = db.subscribeToChanges(() => {
      refreshDatabase();
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [refreshDatabase]);

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
  const handleClockToggle = async () => {
    if (!currentUser) return;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (!attendanceStatus.isClockedIn) {
      const newRec = await db.addAttendance({
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
        await db.updateAttendance(attendanceStatus.currentRecordId, {
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
  const handleAddLeave = async (req) => {
    if (!currentUser) return;
    await db.createLeave({
      userId: currentUser.id,
      name: currentUser.name,
      ...req,
    });
    refreshDatabase();
    addToast("Leave Applied", "Leave request submitted to direct manager for review.", "success");
  };

  const handleUpdateLeaveStatus = async (id, status, approverName = null) => {
    await db.updateLeaveStatus(id, status, approverName || currentUser?.name);
    refreshDatabase();
    addToast("Leave Status Updated", `Request marked as ${status}.`, "info");
  };

  // Claims operations
  const handleAddClaim = async (claim) => {
    if (!currentUser) return;
    await db.createClaim({
      userId: currentUser.id,
      name: currentUser.name,
      ...claim,
    });
    refreshDatabase();
    addToast("Claim Submitted", "Expense claim routed to manager & finance queue.", "success");
  };

  const handleUpdateClaimStatus = async (id, status) => {
    await db.updateClaimStatus(id, status);
    refreshDatabase();
    addToast("Claim Updated", `Claim marked as ${status}.`, "info");
  };

  // Tickets operations
  const handleAddTicket = async (ticket) => {
    if (!currentUser) return;
    await db.createTicket({
      userId: currentUser.id,
      name: currentUser.name,
      ...ticket,
    });
    refreshDatabase();
    addToast("Support Ticket Created", "Logged into the IT/HR support queue.", "success");
  };

  const handleUpdateTicketStatus = async (id, status) => {
    await db.updateTicketStatus(id, status);
    refreshDatabase();
    addToast("Ticket Updated", `Ticket status changed to ${status}.`, "info");
  };

  // Announcements
  const handleAddAnnouncement = async (ann) => {
    if (!currentUser) return;
    await db.createAnnouncement({
      author: `${currentUser.name} (${currentUser.title})`,
      ...ann,
    });
    refreshDatabase();
    addToast("Announcement Published", "New strategic notice broadcasted.", "success");
  };

  // Profile update
  const handleUpdateProfile = async (updates) => {
    if (!currentUser) return;
    const updated = await db.updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
      refreshDatabase();
      addToast("Profile Updated", "Personnel record saved successfully.", "success");
    }
  };

  // Add Asset
  const handleAddAsset = async (assetData) => {
    await db.addAsset(assetData);
    refreshDatabase();
    addToast("Asset Deployed", "Hardware device registered in company inventory.", "success");
  };

  if (!currentUser) {
    return (
      <ErrorBoundary>
        <Login onLogin={handleLogin} onRegister={handleRegister} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
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

        {/* Unified Adaptive Enterprise Shell */}
        <EnterpriseShell
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          leaveRequests={leaveRequests}
          onSubmitLeave={handleAddLeave}
          onUpdateLeaveStatus={handleUpdateLeaveStatus}
          claims={claims}
          onSubmitClaim={handleAddClaim}
          onUpdateClaimStatus={handleUpdateClaimStatus}
          attendanceRecords={attendanceRecords}
          attendanceStatus={attendanceStatus}
          onClockToggle={handleClockToggle}
          tickets={tickets}
          onAddTicket={handleAddTicket}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          announcements={announcements}
          onAddAnnouncement={handleAddAnnouncement}
          departments={departments}
          assets={assets}
          sprints={sprints}
          allUsers={allEmployees}
          onAddAsset={handleAddAsset}
          orgTree={orgTree}
        />
      </div>
    </ErrorBoundary>
  );
}