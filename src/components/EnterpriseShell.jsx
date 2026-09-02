import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { db } from "../services/db";

// Shell Navigation Components
import Sidebar from "./shell/Sidebar";
import TopNavbar from "./shell/TopNavbar";
import MobileBottomBar from "./shell/MobileBottomBar";

// Dashboards
import OverviewDashboard from "./dashboards/OverviewDashboard";
import FinancialDashboard from "./dashboards/FinancialDashboard";
import InventoryDashboard from "./dashboards/InventoryDashboard";

// Modular Views
import ProfileModule from "./modules/ProfileModule";
import AttendanceModule from "./modules/AttendanceModule";
import LeavesModule from "./modules/LeavesModule";
import PayrollModule from "./modules/PayrollModule";
import ClaimsModule from "./modules/ClaimsModule";
import HMOModule from "./modules/HMOModule";
import OKRsModule from "./modules/OKRsModule";

// Enterprise Hubs
import TeamLeadHub from "./TeamLeadHub";
import DepartmentHubs from "./DepartmentHubs";
import OrgChart from "./OrgChart";
import ExecutiveCockpit from "./ExecutiveCockpit";

// Modals
import LeaveModal from "./modals/LeaveModal";
import ClaimModal from "./modals/ClaimModal";
import PayslipModal from "./modals/PayslipModal";
import UserDossierModal from "./modals/UserDossierModal";
import EditProfileModal from "./modals/EditProfileModal";

const VALID_TABS = [
  "overview",
  "financials",
  "inventory",
  "profile",
  "attendance",
  "leaves",
  "payroll",
  "claims",
  "hmo",
  "okrs",
  "team_hub",
  "departments",
  "org_chart",
  "executive",
];

function getInitialNav() {
  if (typeof window === "undefined") return "overview";
  const rawHash = window.location.hash.replace(/^#\/?/, "");
  if (rawHash === "dashboard") return "overview";
  return VALID_TABS.includes(rawHash) ? rawHash : "overview";
}

export default function EnterpriseShell({
  currentUser,
  theme,
  onToggleTheme,
  onLogout,
  onUpdateProfile,
  // Database States
  leaveRequests = [],
  onSubmitLeave,
  onUpdateLeaveStatus,
  claims = [],
  onSubmitClaim,
  onUpdateClaimStatus,
  attendanceRecords = [],
  attendanceStatus,
  onClockToggle,
  announcements = [],
  onAddAnnouncement,
  departments = [],
  assets = [],
  sprints = [],
  allUsers = [],
  onAddAsset,
  orgTree,
}) {
  const [activeNav, setActiveNav] = useState(getInitialNav);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [globalSearch, setGlobalSearch] = useState("");

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [selectedUserDossier, setSelectedUserDossier] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Operational State persisted through db service with fallbacks
  const [invoices, setInvoices] = useState(() => db.getInvoices());
  const [stockAlerts, setStockAlerts] = useState(() => db.getStockAlerts());

  const [notificationToast, setNotificationToast] = useState(null);

  // Synchronize hash with activeNav for bookmarking & browser back/forward
  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentHash = window.location.hash.replace(/^#\/?/, "");
    if (currentHash !== activeNav) {
      window.location.hash = `#/${activeNav}`;
    }
  }, [activeNav]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, "");
      const target = rawHash === "dashboard" ? "overview" : rawHash;
      if (VALID_TABS.includes(target)) {
        setActiveNav(target);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Listen to remote changes via db subscriber
  useEffect(() => {
    const unsubscribe = db.subscribeToChanges((event) => {
      if (event.table === "invoices") {
        setInvoices(db.getInvoices());
      } else if (event.table === "inventory" || event.table === "purchase_orders") {
        setStockAlerts(db.getStockAlerts());
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleSendReminder = (invId, customer) => {
    showToast(`Payment reminder dispatched to ${customer} for invoice ${invId}`);
  };

  const handleMarkInvoicePaid = (invId) => {
    db.markInvoicePaid(invId);
    setInvoices(db.getInvoices());
    showToast(`Invoice ${invId} marked as settled.`);
  };

  const handleCreatePO = (item) => {
    const po = db.createPurchaseOrder(item, currentUser.name);
    setStockAlerts(db.getStockAlerts());
    showToast(
      `Purchase Order ${po.id} created for ${item.name} (${po.quantity} units) from ${item.supplier}`
    );
  };

  // Direct reports & permissions checks
  const isManager = Boolean(currentUser.tier >= 3 || allUsers.some((u) => u.managerId === currentUser.id));
  const isExecutive = Boolean(currentUser.tier === 5 || currentUser.role === "admin");

  const directReports = allUsers.filter((u) => u.managerId === currentUser.id);
  const directReportIds = new Set(directReports.map((d) => d.id));

  const teamLeaves = leaveRequests.filter((l) => directReportIds.has(l.userId) || l.managerId === currentUser.id);
  const teamClaims = claims.filter((c) => directReportIds.has(c.userId) || c.managerId === currentUser.id);
  const teamAttendance = attendanceRecords.filter((a) => directReportIds.has(a.userId));

  // Forms State
  const [leaveForm, setLeaveForm] = useState({
    type: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [claimForm, setClaimForm] = useState({
    category: "Internet & Remote Work Allowance",
    amount: "",
    description: "",
    receiptName: "",
  });

  const [editProfileForm, setEditProfileForm] = useState(currentUser);

  useEffect(() => {
    if (!attendanceStatus?.isClockedIn) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      setElapsedSeconds(0);
    };
  }, [attendanceStatus?.isClockedIn]);

  const formatTimer = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate) return;
    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    onSubmitLeave({
      type: leaveForm.type,
      dates: `${leaveForm.startDate} - ${leaveForm.endDate}`,
      days,
      reason: leaveForm.reason,
      managerId: currentUser.managerId,
    });
    setLeaveForm({ type: "Annual Leave", startDate: "", endDate: "", reason: "" });
    setShowLeaveModal(false);
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimForm.amount) return;
    onSubmitClaim({
      ...claimForm,
      managerId: currentUser.managerId,
    });
    setClaimForm({
      category: "Internet & Remote Work Allowance",
      amount: "",
      description: "",
      receiptName: "",
    });
    setShowClaimModal(false);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (onUpdateProfile) onUpdateProfile(editProfileForm);
    setIsEditingProfile(false);
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case 5:
        return "Tier 5 • Executive (C-Suite)";
      case 4:
        return "Tier 4 • Head of Department";
      case 3:
        return "Tier 3 • Team Lead / Manager";
      case 2:
        return "Tier 2 • Senior Staff";
      default:
        return "Tier 1 • Staff Associate";
    }
  };

  const myLeaves = leaveRequests.filter((l) => l.userId === currentUser.id);
  const myClaims = claims.filter((c) => c.userId === currentUser.id);
  const myAttendance = attendanceRecords.filter((a) => a.userId === currentUser.id);

  const defaultPayments = [
    {
      id: 1,
      month: "August 2026",
      payDate: "2026-08-31",
      gross: currentUser.salary || "$3,500.00",
      tax: "$450.00",
      pension: "$180.00",
      medical: "$60.00",
      net: "$2,810.00",
      status: "Paid",
    },
    {
      id: 2,
      month: "July 2026",
      payDate: "2026-07-28",
      gross: currentUser.salary || "$3,500.00",
      tax: "$450.00",
      pension: "$180.00",
      medical: "$60.00",
      net: "$2,810.00",
      status: "Paid",
    },
  ];

  const recentActivities = [
    { id: "ACT-01", actor: "Dr. Alexander Vance", role: "CEO", department: "Executive", action: "Published strategic Q3 enterprise bulletin", timestamp: "12m ago", status: "Active" },
    { id: "ACT-02", actor: "Marcus Brody", role: "Head of Finance", department: "Finance", action: "Executed August Company Batch Payroll ($68,500)", timestamp: "45m ago", status: "Executed" },
    { id: "ACT-03", actor: "Victoria Sterling", role: "VP HR", department: "HR", action: "Approved Level-1 Leave Request LV-201 (5 days)", timestamp: "1h ago", status: "Approved" },
    { id: "ACT-04", actor: "Sarah Chen", role: "Frontend Lead", department: "Engineering", action: "Verified Out-of-Pocket Expense Claim CLM-301", timestamp: "2h ago", status: "Verified" },
    { id: "ACT-05", actor: "Tunde Bakare", role: "VP Engineering", department: "Engineering", action: "Requisitioned Cloud Sandbox AWS-PROD-EAST", timestamp: "3h ago", status: "Active" },
    { id: "ACT-06", actor: "David Okonjo", role: "DevOps Lead", department: "Engineering", action: "Allocated MacBook Pro M3 (AST-105) to Design", timestamp: "4h ago", status: "Completed" },
    { id: "ACT-07", actor: "Global Logistics", role: "Carrier", department: "Supply Chain", action: "Inbound Shipment SHP-001 arriving tomorrow", timestamp: "5h ago", status: "In Transit" },
  ];

  const topProducts = [
    { sku: "SKU-1001", name: "Apex Industrial Edge Controller", category: "Industrial IoT", unitsSold: "1,240", revenue: "$496,000", margin: "42.5%", status: "In Stock" },
    { sku: "SKU-1002", name: "Monolith Core Processor v4", category: "Semiconductors", unitsSold: "980", revenue: "$784,000", margin: "51.2%", status: "In Stock" },
    { sku: "SKU-1003", name: "Enterprise Mesh Gateway Pro", category: "Networking", unitsSold: "750", revenue: "$225,000", margin: "38.0%", status: "Low Stock" },
    { sku: "SKU-1004", name: "Secure Enclave HSM Module", category: "Security Hardware", unitsSold: "620", revenue: "$310,000", margin: "64.0%", status: "In Stock" },
  ];

  return (
    <div className="app-container">
      {/* Dynamic Action Toast */}
      {notificationToast && (
        <div className="toast-container">
          <div className="toast toast-info">
            <CheckCircle2 className="toast-icon" color="var(--brand-sage)" />
            <div className="toast-content">
              <h4>System Notification</h4>
              <p>{notificationToast}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentUser={currentUser}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={onLogout}
        myLeaves={myLeaves}
        myClaims={myClaims}
        teamLeaves={teamLeaves}
        theme={theme}
        onToggleTheme={onToggleTheme}
        showToast={showToast}
      />

      {/* Main Workspace Area */}
      <main className="main-wrapper">
        <TopNavbar
          currentUser={currentUser}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          theme={theme}
          onToggleTheme={onToggleTheme}
          attendanceStatus={attendanceStatus}
          elapsedSeconds={elapsedSeconds}
          onClockToggle={onClockToggle}
          onLogout={onLogout}
          showToast={showToast}
          formatTimer={formatTimer}
          getTierLabel={getTierLabel}
        />

        {/* Dynamic Nav View Injection */}
        <div className="content-area">
          {(activeNav === "overview" || activeNav === "dashboard") && (
            <OverviewDashboard
              allUsers={allUsers}
              attendanceStatus={attendanceStatus}
              elapsedSeconds={elapsedSeconds}
              formatTimer={formatTimer}
              onClockToggle={onClockToggle}
              setActiveNav={setActiveNav}
              recentActivities={recentActivities}
              myLeaves={myLeaves}
              announcements={announcements}
            />
          )}

          {activeNav === "financials" && (
            <FinancialDashboard
              invoices={invoices}
              onSendReminder={handleSendReminder}
              onMarkInvoicePaid={handleMarkInvoicePaid}
              showToast={showToast}
            />
          )}

          {activeNav === "inventory" && (
            <InventoryDashboard
              stockAlerts={stockAlerts}
              onCreatePO={handleCreatePO}
              topProducts={topProducts}
              showToast={showToast}
            />
          )}

          {activeNav === "profile" && (
            <ProfileModule
              currentUser={currentUser}
              getTierLabel={getTierLabel}
              onOpenEditProfile={() => {
                setEditProfileForm(currentUser);
                setIsEditingProfile(true);
              }}
            />
          )}

          {activeNav === "attendance" && (
            <AttendanceModule
              attendanceStatus={attendanceStatus}
              onClockToggle={onClockToggle}
              myAttendance={myAttendance}
            />
          )}

          {activeNav === "leaves" && (
            <LeavesModule
              myLeaves={myLeaves}
              onOpenApplyLeave={() => setShowLeaveModal(true)}
            />
          )}

          {activeNav === "payroll" && (
            <PayrollModule
              payments={defaultPayments}
              onViewPayslip={setSelectedPayslip}
            />
          )}

          {activeNav === "claims" && (
            <ClaimsModule
              myClaims={myClaims}
              onOpenSubmitClaim={() => setShowClaimModal(true)}
            />
          )}

          {activeNav === "hmo" && (
            <HMOModule currentUser={currentUser} />
          )}

          {activeNav === "okrs" && (
            <OKRsModule />
          )}

          {/* TEAM LEAD HUB (IF TIER 3+) */}
          {activeNav === "team_hub" && isManager && (
            <TeamLeadHub
              currentUser={currentUser}
              directReports={directReports}
              teamAttendance={teamAttendance}
              teamLeaves={teamLeaves}
              teamClaims={teamClaims}
              onUpdateLeaveStatus={onUpdateLeaveStatus}
              onUpdateClaimStatus={onUpdateClaimStatus}
              onSelectUserDossier={setSelectedUserDossier}
            />
          )}

          {/* DEPARTMENT WORKSPACES */}
          {activeNav === "departments" && (
            <DepartmentHubs
              activeDeptKey={
                currentUser.department === "Finance & Operations"
                  ? "finance"
                  : currentUser.department === "Human Resources"
                  ? "hr"
                  : "engineering"
              }
              departments={departments}
              assets={assets}
              sprints={sprints}
              claims={claims}
              allUsers={allUsers}
              onUpdateClaimStatus={onUpdateClaimStatus}
              onAddAsset={onAddAsset}
            />
          )}

          {/* INTERACTIVE ORG CHART */}
          {activeNav === "org_chart" && (
            <OrgChart
              orgTree={orgTree}
              allUsers={allUsers}
              onSelectUser={setSelectedUserDossier}
            />
          )}

          {/* EXECUTIVE COCKPIT (TIER 5 / C-SUITE) */}
          {activeNav === "executive" && isExecutive && (
            <ExecutiveCockpit
              currentUser={currentUser}
              departments={departments}
              allUsers={allUsers}
              announcements={announcements}
              onAddAnnouncement={onAddAnnouncement}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        setMobileMenuOpen={setMobileMenuOpen}
        attendanceStatus={attendanceStatus}
        isManager={isManager}
        teamLeaves={teamLeaves}
      />

      {/* Modals */}
      <LeaveModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        currentUser={currentUser}
        leaveForm={leaveForm}
        setLeaveForm={setLeaveForm}
        onSubmit={handleLeaveSubmit}
      />

      <ClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        claimForm={claimForm}
        setClaimForm={setClaimForm}
        onSubmit={handleClaimSubmit}
      />

      <PayslipModal
        selectedPayslip={selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        currentUser={currentUser}
        showToast={showToast}
      />

      <UserDossierModal
        selectedUserDossier={selectedUserDossier}
        onClose={() => setSelectedUserDossier(null)}
        getTierLabel={getTierLabel}
      />

      <EditProfileModal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        editProfileForm={editProfileForm}
        setEditProfileForm={setEditProfileForm}
        onSubmit={handleProfileSave}
      />
    </div>
  );
}
