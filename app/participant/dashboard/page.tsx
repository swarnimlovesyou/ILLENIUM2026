"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile, EventRecord } from "@/services/master-store";

export default function ParticipantDashboard() {
  // Demo: show seeded CL profile as "current user"
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [checkIns, setCheckIns] = useState(0);

  useEffect(() => {
    // In demo mode, surface the first non-staff participant profile
    const p = masterStore.getProfileById("p-cl-parth");
    setProfile(p || null);
    setEvents(masterStore.getEvents().slice(0, 3));
    setCheckIns(masterStore.getCheckIns().length);
  }, []);

  return (
    <RoleShell role="participant">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Participant passport</div>
          <h1>Your festival, organised.</h1>
          <p className="workspace-subtitle">
            {profile
              ? `Welcome back, ${profile.fullName.split(" ")[0]}. Everything you need for ILLENIUM lives here.`
              : "Complete your registration to unlock your pass."}
          </p>
        </div>
        <Link href="/participant/id" className="button button-primary">
          Open digital ID ↗
        </Link>
      </div>

      <section className="workspace-hero-card">
        <div className="workspace-kicker">ILLENIUM™ / 26</div>
        <h2>{profile?.collegeName ?? "Participant profile"}</h2>
        <p className="workspace-subtitle">
          {profile
            ? "Your college, events and access status are connected to one festival identity."
            : "Your profile will appear here after you sign in and submit registration."}
        </p>
        <div style={{ display: "flex", gap: "8px", marginTop: "1rem", flexWrap: "wrap" }}>
          <Link href="/participant/id" className="button button-primary">View my pass</Link>
          <Link href="/events" className="button button-outline">Browse programme</Link>
        </div>
      </section>

      <div className="data-grid">
        <div className="data-card">
          <div className="data-card-label">ILLENIUM ID</div>
          <div className="data-card-value" style={{ fontSize: "1.1rem", letterSpacing: "0.04em" }}>
            {profile?.illeniumId ?? "Pending"}
          </div>
          <div className="data-card-note">Issued after approval</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Role</div>
          <div className="data-card-value" style={{ fontSize: "1.1rem", textTransform: "uppercase" }}>
            {profile?.role ?? "—"}
          </div>
          <div className="data-card-note">Your access level</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Verification</div>
          <div className={`data-card-value ${profile?.verificationStatus === "verified" ? "status-good" : "status-warn"}`} style={{ fontSize: "1.1rem", textTransform: "capitalize" }}>
            {profile?.verificationStatus ?? "Pending"}
          </div>
          <div className="data-card-note">Identity review</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Check-ins</div>
          <div className="data-card-value">{checkIns}</div>
          <div className="data-card-note">Campus + event scans</div>
        </div>
      </div>

      <section className="workspace-panel">
        <div className="workspace-page-head" style={{ marginBottom: ".5rem" }}>
          <div>
            <h2>Programme</h2>
            <p className="workspace-subtitle">Events open for participation.</p>
          </div>
          <Link href="/events" className="button button-outline">View all ↗</Link>
        </div>
        {events.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Venue</th>
                  <th>Reporting time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td><b>{ev.name}</b></td>
                    <td>{ev.category}</td>
                    <td>{ev.venue}</td>
                    <td>
                      {new Date(ev.reportingTime).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>
                      <span className="status-pill status-success">{ev.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "1.4rem 0" }}>
            <p className="workspace-subtitle">No events yet. Explore the programme and register.</p>
            <Link href="/events" className="button button-primary" style={{ marginTop: "10px" }}>
              Explore events ↗
            </Link>
          </div>
        )}
      </section>

      <section className="workspace-panel">
        <h2>Festival notes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div>
            <strong style={{ color: "var(--bone)" }}>At the gate</strong>
            <p className="workspace-subtitle">Open your Digital ID. Brightness up, QR visible, no screenshots needed.</p>
          </div>
          <div>
            <strong style={{ color: "var(--bone)" }}>Before your event</strong>
            <p className="workspace-subtitle">Check reporting time and venue. Late arrivals are recorded from original scan time.</p>
          </div>
          <div>
            <strong style={{ color: "var(--bone)" }}>Need help?</strong>
            <p className="workspace-subtitle">Find the festival operations desk at the main entrance.</p>
          </div>
        </div>
      </section>
    </RoleShell>
  );
}
