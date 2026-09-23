"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, CheckInRecord } from "@/services/master-store";

export default function CheckInsPage() {
  const [logs, setLogs] = useState<CheckInRecord[]>([]);

  useEffect(() => {
    // Load and deduplicate by participant+type+event (no repetition)
    const all = masterStore.getCheckIns();
    const seen = new Set<string>();
    const deduped: CheckInRecord[] = [];
    for (const c of all) {
      const key = `${c.illeniumId}-${c.checkInType}-${c.eventId ?? "campus"}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(c);
      }
    }
    // Sort newest first
    deduped.sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
    setLogs(deduped);
  }, []);

  function checkpointLabel(type: CheckInRecord["checkInType"]) {
    const map: Record<string, string> = {
      campus_entry: "Campus entry",
      event_entry: "Event entry",
      goodie_distribution: "Goodie bag",
      prize_distribution: "Prize collection",
    };
    return map[type] ?? type;
  }

  function statusClass(status: string) {
    if (status === "accepted") return "status-success";
    if (status === "rejected") return "status-danger";
    return "status-neutral";
  }

  return (
    <RoleShell role="oc">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Recent activity</div>
          <h1>Check-in log</h1>
          <p className="workspace-subtitle">
            The latest accepted scans visible to your operations role.
          </p>
        </div>
        <span className="live-pill">
          <i /> Live · {logs.length} entries
        </span>
      </div>

      <div className="workspace-panel table-wrap" style={{ padding: "0" }}>
        <table>
          <thead>
            <tr>
              <th>Participant</th>
              <th>Checkpoint</th>
              <th>Event / venue</th>
              <th>Time</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((row) => (
              <tr key={row.id}>
                <td>
                  <b>{row.fullName}</b>
                  <i>{row.illeniumId}</i>
                </td>
                <td>{checkpointLabel(row.checkInType)}</td>
                <td>
                  <b>{row.eventName ?? "Main gate"}</b>
                  <i>{row.venueName ?? "Main entrance"}</i>
                </td>
                <td>
                  {new Date(row.scannedAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  <span className={`status-pill ${statusClass(row.attendanceStatus)}`}>
                    {row.attendanceStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!logs.length && (
          <p className="workspace-subtitle" style={{ padding: "20px 24px" }}>
            No check-ins have been recorded yet.
          </p>
        )}
      </div>
    </RoleShell>
  );
}
