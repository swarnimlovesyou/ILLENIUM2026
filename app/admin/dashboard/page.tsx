"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile, AuditLogRecord } from "@/services/master-store";

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  useEffect(() => {
    setProfiles(masterStore.getProfiles());
    setAuditLogs(masterStore.getAuditLogs().slice(0, 8));
  }, []);

  const checkIns = masterStore.getCheckIns();
  const verified = profiles.filter((p) => p.verificationStatus === "verified").length;
  const pending = profiles.filter((p) => p.verificationStatus === "pending").length;
  const events = masterStore.getEvents().length;

  return (
    <RoleShell role="admin">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Festival control room</div>
          <h1>The system at a glance.</h1>
          <p className="workspace-subtitle">
            Identity, verification and access operations for ILLENIUM 2026.
          </p>
        </div>
        <Link href="/admin/verification" className="button button-primary">
          Review queue ({pending}) ↗
        </Link>
      </div>

      <div className="data-grid">
        <div className="data-card">
          <div className="data-card-label">Profiles</div>
          <div className="data-card-value">{profiles.length}</div>
          <div className="data-card-note">Total identities</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Verified</div>
          <div className={`data-card-value${verified > 0 ? " status-good" : ""}`}>{verified}</div>
          <div className="data-card-note">Approved identities</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Needs review</div>
          <div className={`data-card-value${pending > 0 ? " status-warn" : ""}`}>{pending}</div>
          <div className="data-card-note">Awaiting decision</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Check-ins</div>
          <div className="data-card-value">{checkIns.length}</div>
          <div className="data-card-note">Campus + event entries</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Events</div>
          <div className="data-card-value">{events}</div>
          <div className="data-card-note">In the programme</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Contingents</div>
          <div className="data-card-value">{masterStore.getContingents().length}</div>
          <div className="data-card-note">Registered colleges</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(240px, .7fr)", gap: "14px" }}>
        <section className="workspace-panel" style={{ marginBottom: 0 }}>
          <h2>Recent activity</h2>
          {auditLogs.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <b>{log.actorName}</b>
                      </td>
                      <td>{log.action}</td>
                      <td>
                        <i>{log.entityType}</i>
                      </td>
                      <td>
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="workspace-subtitle">
              No activity yet. Once registrations and check-ins begin, the audit trail will appear here.
            </p>
          )}
        </section>

        <section className="workspace-panel" style={{ marginBottom: 0 }}>
          <h2>Quick actions</h2>
          <div style={{ display: "grid", gap: ".55rem" }}>
            <Link href="/admin/contingents" className="button button-primary">
              🏛 Contingents (CL Meet) ↗
            </Link>
            <Link href="/admin/scoring" className="button button-primary">
              ★ Master Scoring &amp; Bids ↗
            </Link>
            <Link href="/leaderboard" className="button button-outline">
              🏆 Official Leaderboard ↗
            </Link>
            <Link href="/judge" className="button button-outline">
              ⚖️ Judge Portal ↗
            </Link>
            <Link href="/admin/verification" className="button button-outline">
              ✓ Open verification queue ↗
            </Link>
            <Link href="/admin/participants" className="button button-outline">
              ◎ Search participants ↗
            </Link>
            <Link href="/admin/events" className="button button-outline">
              ✦ Manage events ↗
            </Link>
            <Link href="/admin/audit" className="button button-outline">
              📋 Audit Trail ↗
            </Link>
            <Link href="/oc/scanner" className="button button-secondary">
              ⌁ Open QR scanner ↗
            </Link>
          </div>
        </section>
      </div>

      <section className="workspace-panel">
        <h2>Operational readiness</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: ".8rem" }}>
          <div>
            <span className="workspace-status status-good">Master store active</span>
            <p className="workspace-subtitle">In-memory store with full domain model ready.</p>
          </div>
          <div>
            <span className="workspace-status status-good">QR verification server-side</span>
            <p className="workspace-subtitle">Opaque tokens only; no PII in QR codes.</p>
          </div>
          <div>
            <span className="workspace-status status-good">Offline / demo mode enabled</span>
            <p className="workspace-subtitle">Seeded data available when DB is offline.</p>
          </div>
          <div>
            <span className="workspace-status status-good">Audit log active</span>
            <p className="workspace-subtitle">All material actions are tracked automatically.</p>
          </div>
        </div>
      </section>
    </RoleShell>
  );
}
