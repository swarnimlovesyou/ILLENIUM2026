"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile, AuditLogRecord } from "@/services/master-store";
import {
  Users,
  Shield,
  Trophy,
  Gavel,
  CheckCircle2,
  Search,
  Sparkles,
  ClipboardList,
  QrCode,
  ArrowUpRight,
  Ticket,
  Flame,
  Activity,
  UserCheck
} from "lucide-react";

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
  const contingents = masterStore.getContingents().length;

  return (
    <RoleShell role="admin">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "rgba(216, 255, 46, 0.1)",
                border: "1px solid rgba(216, 255, 46, 0.3)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--acid)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "0.5rem"
              }}
            >
              <Activity size={13} />
              Command Overview
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Festival Control Room</h1>
            <p style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
              Unified identity verification, wristband accreditation, and scoring operations overview.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/admin/verification" className="btn btn-primary" style={{ gap: "0.4rem" }}>
              <UserCheck size={15} />
              <span>Review Queue ({pending})</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">
              <Users size={14} style={{ color: "var(--acid)" }} />
              Total Profiles
            </div>
            <div className="kpi-value">{profiles.length}</div>
            <div className="kpi-subtext">Registered identities</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
              Verified & Wristbanded
            </div>
            <div className="kpi-value" style={{ color: "var(--success)" }}>
              {verified}
            </div>
            <div className="kpi-subtext">Approved passes</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <Ticket size={14} style={{ color: "var(--warning)" }} />
              Pending Queue
            </div>
            <div className="kpi-value" style={{ color: "var(--warning)" }}>
              {pending}
            </div>
            <div className="kpi-subtext">Awaiting desk review</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <QrCode size={14} style={{ color: "var(--cyan)" }} />
              Total Check-ins
            </div>
            <div className="kpi-value">{checkIns.length}</div>
            <div className="kpi-subtext">Gate & event scans</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <Sparkles size={14} style={{ color: "var(--mag)" }} />
              Programme Events
            </div>
            <div className="kpi-value">{events}</div>
            <div className="kpi-subtext">Active verticals</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <Shield size={14} style={{ color: "var(--gold)" }} />
              Contingents
            </div>
            <div className="kpi-value">{contingents}</div>
            <div className="kpi-subtext">Participating colleges</div>
          </div>
        </div>

        {/* Two-Column Activity & Quick Action Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.25rem"
          }}
        >
          {/* Recent Activity Table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--line)",
                background: "var(--bg-surface)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Activity size={16} style={{ color: "var(--acid)" }} />
              <h3 style={{ fontSize: "1.05rem" }}>Live Security & System Logs</h3>
            </div>

            <div className="data-table-container" style={{ border: "none", borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length ? (
                    auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span style={{ fontWeight: 600 }}>{log.actorName}</span>
                        </td>
                        <td>
                          <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>
                            {log.action}
                          </span>
                        </td>
                        <td>
                          <span className="mono" style={{ fontSize: "0.75rem", color: "var(--bone-dim)" }}>
                            {log.entityType}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--dim)" }}>
                        No activity recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Operational Quick Launcher */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Sparkles size={16} style={{ color: "var(--gold)" }} />
                Operational Desks
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              <Link
                href="/admin/contingents"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "flex-start", gap: "0.5rem" }}
              >
                <Users size={14} style={{ color: "var(--acid)" }} />
                <span>CL/ACL Meet</span>
              </Link>
              <Link
                href="/admin/scoring"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "flex-start", gap: "0.5rem" }}
              >
                <Shield size={14} style={{ color: "var(--mag)" }} />
                <span>Scoring & Bids</span>
              </Link>
              <Link
                href="/leaderboard"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "flex-start", gap: "0.5rem" }}
              >
                <Trophy size={14} style={{ color: "var(--gold)" }} />
                <span>Leaderboard</span>
              </Link>
              <Link
                href="/judge"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "flex-start", gap: "0.5rem" }}
              >
                <Gavel size={14} style={{ color: "var(--cyan)" }} />
                <span>Judge Portal</span>
              </Link>
              <Link
                href="/admin/verification"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "flex-start", gap: "0.5rem" }}
              >
                <Ticket size={14} style={{ color: "var(--acid)" }} />
                <span>Accreditation</span>
              </Link>
              <Link
                href="/admin/events"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "flex-start", gap: "0.5rem" }}
              >
                <Sparkles size={14} style={{ color: "var(--bone-dim)" }} />
                <span>Events Master</span>
              </Link>
              <Link
                href="/admin/audit"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "flex-start", gap: "0.5rem" }}
              >
                <ClipboardList size={14} style={{ color: "var(--cyan)" }} />
                <span>Audit Trail</span>
              </Link>
              <Link
                href="/oc/scanner"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "flex-start", gap: "0.5rem" }}
              >
                <QrCode size={14} style={{ color: "var(--acid)" }} />
                <span>Gate Scanner</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
