import { Square, Play } from "lucide-react";

export default function AttendanceModule({
  attendanceStatus,
  onClockToggle,
  myAttendance = [],
}) {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Shift Attendance & Time Log</h1>
          <p>Real-time clock tracking, monthly work hours, and daily compliance records.</p>
        </div>
        <button
          type="button"
          className={`btn ${attendanceStatus?.isClockedIn ? "btn-danger" : "btn-primary"}`}
          onClick={onClockToggle}
        >
          {attendanceStatus?.isClockedIn ? <Square size={14} /> : <Play size={14} />}
          <span>{attendanceStatus?.isClockedIn ? "Clock Out of Shift" : "Clock In to Shift"}</span>
        </button>
      </div>

      <div className="card">
        {myAttendance.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13px" }}>
            No shift attendance records found for this period. Clock in above to start your shift.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-responsive has-mobile-cards">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Duration</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myAttendance.map((rec, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{rec.date}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{rec.in}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{rec.out}</td>
                      <td>{rec.hours}</td>
                      <td>{rec.location}</td>
                      <td>
                        <span className="badge badge-approved">{rec.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="mobile-card-list">
              {myAttendance.map((rec, i) => (
                <div key={i} className="mobile-data-card">
                  <div className="mobile-data-card-header">
                    <div>
                      <div className="mobile-data-card-title">{rec.date}</div>
                      <div className="mobile-data-card-sub">{rec.location}</div>
                    </div>
                    <span className="badge badge-approved">{rec.status}</span>
                  </div>

                  <div className="mobile-data-card-body">
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Clock In / Out</span>
                      <span className="mobile-data-card-val" style={{ fontFamily: "var(--font-mono)" }}>
                        {rec.in} — {rec.out}
                      </span>
                    </div>
                    <div className="mobile-data-card-row">
                      <span className="mobile-data-card-label">Logged Duration</span>
                      <span className="mobile-data-card-val" style={{ fontWeight: 700 }}>
                        {rec.hours}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
