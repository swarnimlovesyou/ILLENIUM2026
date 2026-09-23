"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, CheckInRecord } from "@/services/master-store";

export default function OcDashboard() {
  const [events, setEvents] = useState(masterStore.getEvents().slice(0, 1));
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);

  useEffect(() => {
    setEvents(masterStore.getEvents().slice(0, 1));
    setCheckIns(masterStore.getCheckIns());
  }, []);

  const active = events[0];
  const campusEntries = checkIns.filter((c) => c.checkInType === "campus_entry").length;
  const eventEntries = checkIns.filter((c) => c.checkInType === "event_entry").length;

  return (
    <RoleShell role="oc">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Live operations</div>
          <h1>Your shift, clearly.</h1>
          <p className="workspace-subtitle">
            Only the events assigned to you are shown here. Scan, verify, check&nbsp;in, repeat.
          </p>
        </div>
        <span className="live-pill">
          <i /> Console ready
        </span>
      </div>

      {active ? (
        <section className="workspace-hero-card">
          <div className="workspace-kicker">Assigned event · {active.venue}</div>
          <h2>{active.name}</h2>
          <p className="workspace-subtitle">
            Reporting time:{" "}
            {new Date(active.reportingTime).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}.{" "}
            Status: <strong style={{ color: "var(--acid)" }}>{active.status.toUpperCase()}</strong>
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "1rem", flexWrap: "wrap" }}>
            <Link href={`/oc/scanner?event=${active.id}`} className="button button-primary">
              Scan a participant ↗
            </Link>
            <Link href="/oc/check-ins" className="button button-outline">
              View check-ins
            </Link>
          </div>
        </section>
      ) : (
        <section className="workspace-hero-card">
          <div className="workspace-kicker">No assignment yet</div>
          <h2>Waiting for your event brief.</h2>
          <p className="workspace-subtitle">
            An admin needs to assign you to an event before event check-in is enabled.
            Campus entry can still be operated from the scanner when permitted.
          </p>
          <Link href="/oc/scanner?mode=campus_entry" className="button button-primary" style={{ marginTop: "1rem" }}>
            Open campus scanner ↗
          </Link>
        </section>
      )}

      <div className="data-grid">
        <div className="data-card">
          <div className="data-card-label">Campus entries</div>
          <div className="data-card-value">{campusEntries}</div>
          <div className="data-card-note">Main gate check-ins</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Event entries</div>
          <div className="data-card-value">{eventEntries}</div>
          <div className="data-card-note">Event venue check-ins</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Total scans</div>
          <div className="data-card-value">{checkIns.length}</div>
          <div className="data-card-note">All checkpoint logs</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Connection</div>
          <div className="data-card-value" style={{ fontSize: "1.1rem", color: "var(--acid)" }}>Online</div>
          <div className="data-card-note">Master store active</div>
        </div>
      </div>

      <section className="workspace-panel">
        <h2>How a scan works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          <div>
            <strong style={{ color: "var(--bone)" }}>01 · Scan</strong>
            <p className="workspace-subtitle">Use the rear camera or enter an ILLENIUM ID manually.</p>
          </div>
          <div>
            <strong style={{ color: "var(--bone)" }}>02 · Verify</strong>
            <p className="workspace-subtitle">The server checks the token, participant status and event registration.</p>
          </div>
          <div>
            <strong style={{ color: "var(--bone)" }}>03 · Check in</strong>
            <p className="workspace-subtitle">One tap records a timestamped, duplicate-safe entry.</p>
          </div>
        </div>
      </section>
    </RoleShell>
  );
}
