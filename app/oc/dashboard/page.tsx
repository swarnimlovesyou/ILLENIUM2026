"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, CheckInRecord, EventRecord } from "@/services/master-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-card";
import { TabBar } from "@/components/dashboard/tab-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  QrCode,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  AlertCircle
} from "lucide-react";

export default function OcDashboard() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setEvents(masterStore.getEvents());
    setCheckIns(masterStore.getCheckIns());
  }, []);

  const active = events[0];
  const campusEntries = checkIns.filter((c) => c.checkInType === "campus_entry").length;
  const eventEntries = checkIns.filter((c) => c.checkInType === "event_entry").length;
  const recentScans = checkIns.slice(0, 6);

  const tabs = [
    { id: "overview", label: "Shift Overview" },
    { id: "protocol", label: "Operating Protocol" },
    { id: "diagnostics", label: "Scanner Telemetry" }
  ];

  return (
    <RoleShell role="oc">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <DashboardHeader
          kicker="Field Operations Console"
          icon={QrCode}
          title="Scanner Shift Summary"
          subtitle="Real-time gate scan throughput, assigned vertical briefing, and high-speed QR check-in telemetry."
          actions={
            <Link
              href="/oc/scanner"
              className="btn btn-primary"
              style={{ gap: "0.5rem" }}
            >
              <QrCode size={15} />
              <span>Launch Gate Scanner</span>
              <ArrowUpRight size={14} />
            </Link>
          }
        />

        {/* Operational Metrics Cards */}
        <MetricGrid>
          <MetricCard
            label="Total Scans"
            value={checkIns.length}
            subtext="All checkpoints captured"
            icon={QrCode}
            color="#ff238f"
          />
          <MetricCard
            label="Campus Gate Entries"
            value={campusEntries}
            subtext="Perimeter main gate scans"
            icon={CheckCircle2}
            color="var(--success)"
          />
          <MetricCard
            label="Event Stage Entries"
            value={eventEntries}
            subtext="Venue & vertical check-ins"
            icon={Layers}
            color="#ff238f"
          />
          <MetricCard
            label="Scanner Connection"
            value="ONLINE"
            subtext="Master store synced · 0 ms lag"
            icon={Activity}
            color="var(--gold)"
          />
        </MetricGrid>

        {/* Active Shift Assignment Card */}
        {active ? (
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, rgba(24, 22, 34, 0.95) 0%, rgba(18, 16, 25, 0.95) 100%)",
              border: "1px solid rgba(255, 35, 143, 0.15)",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <div className="card-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="badge badge-acid" style={{ fontSize: "0.7rem" }}>Active Event Assignment</span>
                <span className="mono" style={{ fontSize: "0.75rem", color: "var(--bone-dim)" }}>
                  {active.code}
                </span>
              </div>
              <StatusBadge label={active.status.toUpperCase()} variant="acid" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  {active.name}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap", fontSize: "0.85rem", color: "var(--bone-dim)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={14} style={{ color: "#ff238f" }} />
                    <span>Venue: <b style={{ color: "var(--bone)" }}>{active.venue}</b></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Clock size={14} style={{ color: "#ff238f" }} />
                    <span>
                      Reporting:{" "}
                      <b style={{ color: "var(--bone)" }}>
                        {new Date(active.reportingTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} IST
                      </b>
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link
                  href={`/oc/scanner?event=${active.id}`}
                  className="btn btn-primary"
                  style={{ gap: "0.4rem" }}
                >
                  <QrCode size={15} />
                  <span>Scan for this Event</span>
                </Link>
                <Link
                  href="/oc/check-ins"
                  className="btn btn-secondary"
                  style={{ gap: "0.4rem" }}
                >
                  <span>View Shift Check-ins</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>Campus Entry Mode</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginBottom: "1rem" }}>
              No individual stage vertical currently assigned to your operator account. Campus perimeter entry is active.
            </p>
            <Link href="/oc/scanner?mode=campus_entry" className="btn btn-primary">
              Open Main Gate Scanner
            </Link>
          </div>
        )}

        {/* Tab switcher */}
        <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--line)",
                background: "var(--bg-surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Activity size={16} style={{ color: "#ff238f" }} />
                <h3 style={{ fontSize: "1.05rem" }}>Live Gate &amp; Checkpoint Activity</h3>
              </div>
              <Link href="/oc/check-ins" className="btn btn-ghost btn-sm" style={{ gap: "0.3rem" }}>
                <span>See all check-in logs</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="data-table-container" style={{ border: "none", borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Checkpoint Type</th>
                    <th>Venue / Stage</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.length ? (
                    recentScans.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--bone)" }}>{c.fullName}</div>
                          <div className="mono" style={{ fontSize: "0.7rem", color: "var(--dim)" }}>
                            {c.illeniumId}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-neutral" style={{ fontSize: "0.65rem", textTransform: "capitalize" }}>
                            {c.checkInType.replace("_", " ")}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.85rem" }}>{c.venueName || "Main Gate"}</span>
                        </td>
                        <td>
                          <span className="mono" style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                            {new Date(c.scannedAt).toLocaleTimeString()}
                          </span>
                        </td>
                        <td>
                          <StatusBadge
                            label={c.attendanceStatus || "Accepted"}
                            variant={c.attendanceStatus === "rejected" ? "crimson" : "success"}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "2.5rem", color: "var(--dim)" }}>
                        No scans recorded in this shift yet. Launch scanner to record entries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "protocol" && (
          <div className="card">
            <h3 style={{ fontSize: "1.15rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck size={18} style={{ color: "#ff238f" }} />
              Scanner Operator Guidelines &amp; Protocol
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--line)"
                }}
              >
                <div className="mono" style={{ color: "#ff238f", fontWeight: 700, fontSize: "0.9rem" }}>
                  01 · Optical QR Scan
                </div>
                <h4 style={{ fontSize: "0.95rem", margin: "0.35rem 0" }}>Frame &amp; Capture</h4>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--bone-dim)", lineHeight: 1.6 }}>
                  Direct the rear camera to the attendee's digital pass or RFID wristband token. The QR contains an opaque,
                  tamper-proof cryptographic token URL with zero raw PII.
                </p>
              </div>

              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--line)"
                }}
              >
                <div className="mono" style={{ color: "#ff238f", fontWeight: 700, fontSize: "0.9rem" }}>
                  02 · Server Verification
                </div>
                <h4 style={{ fontSize: "0.95rem", margin: "0.35rem 0" }}>Status &amp; Event Scope</h4>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--bone-dim)", lineHeight: 1.6 }}>
                  The server validates attendee identity status, checks whether the pass is active for the current day,
                  and confirms event roster registration.
                </p>
              </div>

              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--line)"
                }}
              >
                <div className="mono" style={{ color: "#ff238f", fontWeight: 700, fontSize: "0.9rem" }}>
                  03 · Atomic Log
                </div>
                <h4 style={{ fontSize: "0.95rem", margin: "0.35rem 0" }}>Duplicate Prevention</h4>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--bone-dim)", lineHeight: 1.6 }}>
                  Check-ins execute via the atomic Postgres function with partial unique index protection, preventing
                  accidental or fraudulent duplicate scans.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "diagnostics" && (
          <div className="card">
            <h3 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>
              Scanner Device &amp; Master Store Status
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                padding: "1rem",
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--line)"
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Camera Subsystem</div>
                <div style={{ fontSize: "0.9rem", color: "var(--bone)", fontWeight: 600 }}>@zxing/browser v0.1.5 (Active)</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Cryptographic Token Verifier</div>
                <div style={{ fontSize: "0.9rem", color: "#ff238f", fontWeight: 600 }}>HMAC-SHA256 Ready</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Auditing Sink</div>
                <div style={{ fontSize: "0.9rem", color: "var(--bone)", fontWeight: 600 }}>Postgres masterStore.logAudit</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Current Shift Operator</div>
                <div style={{ fontSize: "0.9rem", color: "#ff238f", fontWeight: 600 }}>OC Desk Lead (Dev Patel)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
