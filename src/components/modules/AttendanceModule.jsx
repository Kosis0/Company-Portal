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
        <div className="table-responsive">
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
      </div>
    </div>
  );
}
