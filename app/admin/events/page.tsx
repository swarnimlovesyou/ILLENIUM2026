"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, EventRecord } from "@/services/master-store";

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    setEvents(masterStore.getEvents());
  }, []);

  function statusClass(s: string) {
    if (s === "open" || s === "in_progress") return "status-success";
    if (s === "completed" || s === "locked") return "status-neutral";
    return "status-warning";
  }

  function changeStatus(id: string, status: EventRecord["status"]) {
    const ev = masterStore.getEventById(id);
    if (ev) {
      ev.status = status;
      masterStore.logAudit("p-cp", "event.status_changed", "event", id, `Status set to ${status}`);
      setEvents([...masterStore.getEvents()]);
    }
  }

  return (
    <RoleShell role="admin">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Programme control</div>
          <h1>Event management</h1>
          <p className="workspace-subtitle">
            Keep the public programme, capacity, and check-in scope aligned.
          </p>
        </div>
        <span className="live-pill">
          <i /> {events.length} events
        </span>
      </div>

      <div className="workspace-panel" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Category</th>
                <th>Venue</th>
                <th>Type</th>
                <th>Bidding</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((row) => (
                <tr key={row.id}>
                  <td>
                    <b>{row.name}</b>
                    <i>{row.code}</i>
                  </td>
                  <td>{row.category}</td>
                  <td>{row.venue}</td>
                  <td style={{ textTransform: "capitalize" }}>{row.eventType}</td>
                  <td>
                    <span className={`status-pill ${row.biddingEnabled ? "status-success" : "status-neutral"}`}>
                      {row.biddingEnabled ? "On" : "Off"}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {row.status === "open" ? (
                      <button
                        className="button button-secondary"
                        style={{ minHeight: "30px", padding: "0 12px", fontSize: "11px" }}
                        onClick={() => changeStatus(row.id, "in_progress")}
                      >
                        Start
                      </button>
                    ) : row.status === "in_progress" ? (
                      <button
                        className="button button-primary"
                        style={{ minHeight: "30px", padding: "0 12px", fontSize: "11px" }}
                        onClick={() => changeStatus(row.id, "completed")}
                      >
                        Complete
                      </button>
                    ) : row.status === "completed" ? (
                      <button
                        className="button button-outline"
                        style={{ minHeight: "30px", padding: "0 12px", fontSize: "11px", color: "var(--mag)", borderColor: "var(--mag)" }}
                        onClick={() => changeStatus(row.id, "locked")}
                      >
                        Lock scores
                      </button>
                    ) : (
                      <span style={{ fontSize: "11px", color: "var(--dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!events.length && (
            <p className="workspace-subtitle" style={{ padding: "20px 24px" }}>
              No events configured yet.
            </p>
          )}
        </div>
      </div>
    </RoleShell>
  );
}
