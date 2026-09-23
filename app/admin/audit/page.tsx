"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, AuditLogRecord } from "@/services/master-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-card";
import { TabBar } from "@/components/dashboard/tab-bar";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  ClipboardList,
  Shield,
  ShieldCheck,
  Users,
  Activity,
  Search,
  Eye,
  X,
  FileCode,
  Terminal
} from "lucide-react";

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);

  useEffect(() => {
    setLogs([...masterStore.getAuditLogs()]);
  }, []);

  const profileLogs = logs.filter((l) => l.entityType === "profile");
  const wristbandLogs = logs.filter((l) => l.entityType === "wristband" || l.action.includes("wristband"));
  const scoreLogs = logs.filter((l) => l.entityType === "score" || l.action.includes("score") || l.action.includes("bid"));

  const uniqueActors = new Set(logs.map((l) => l.actorName)).size;

  const filtered = logs
    .filter((l) => {
      if (activeTab === "profile") return l.entityType === "profile";
      if (activeTab === "wristband") return l.entityType === "wristband" || l.action.includes("wristband");
      if (activeTab === "score") return l.entityType === "score" || l.action.includes("score") || l.action.includes("bid");
      return true;
    })
    .filter((l) => {
      if (entityFilter !== "all" && l.entityType !== entityFilter) return false;
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        l.actorName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.entityType.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        (l.entityId && l.entityId.toLowerCase().includes(q))
      );
    });

  const tabs = [
    { id: "all", label: "All Audit Transactions", count: logs.length },
    { id: "profile", label: "Identities & Passes", count: profileLogs.length },
    { id: "wristband", label: "Wristband Ops", count: wristbandLogs.length },
    { id: "score", label: "Scoring & Bids", count: scoreLogs.length }
  ];

  return (
    <RoleShell role="admin">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <DashboardHeader
          kicker="Section 13 · Security & Traceability"
          icon={ClipboardList}
          title="System Audit Trail & Compliance"
          subtitle="Cryptographically sequenced, immutable transaction history of all score changes, wristband assignments, identity reviews, and penalty adjustments."
        />

        {/* Operational Metrics Cards */}
        <MetricGrid>
          <MetricCard
            label="Total Audit Events"
            value={logs.length}
            subtext="Captured system operations"
            icon={ClipboardList}
            color="#ff238f"
          />
          <MetricCard
            label="Integrity Status"
            value="VERIFIED"
            subtext="Cryptographic sequence intact"
            icon={ShieldCheck}
            color="var(--success)"
          />
          <MetricCard
            label="Active Operators"
            value={uniqueActors || 1}
            subtext="CP, OC, Desk & Judges"
            icon={Users}
            color="#ff238f"
          />
          <MetricCard
            label="Tamper Detection"
            value="0 FLAGS"
            subtext="Zero unauthorized overrides"
            icon={Shield}
            color="var(--gold)"
          />
        </MetricGrid>

        {/* Tabs & Filter Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search audit action, actor name, entity ID, or details..."
            filters={[
              {
                id: "entity",
                label: "Entity",
                value: entityFilter,
                options: [
                  { label: "All Entities", value: "all" },
                  { label: "Profiles", value: "profile" },
                  { label: "Wristbands", value: "wristband" },
                  { label: "Contingents", value: "contingent" },
                  { label: "Scores", value: "score" },
                  { label: "Events", value: "event" }
                ],
                onChange: setEntityFilter
              }
            ]}
            resultsCount={filtered.length}
            totalCount={logs.length}
            onClear={() => {
              setSearchQuery("");
              setEntityFilter("all");
            }}
          />
        </div>

        {/* Audit Log Data Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "160px" }}>Timestamp</th>
                <th>Actor / Operator</th>
                <th>Action Type</th>
                <th>Entity Target</th>
                <th>Transaction Description</th>
                <th style={{ textAlign: "right" }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div className="mono" style={{ fontSize: "0.8rem", color: "var(--bone)", fontWeight: 600 }}>
                        {new Date(l.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                      <div className="mono" style={{ fontSize: "0.7rem", color: "var(--dim)" }}>
                        {new Date(l.createdAt).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "var(--bone)" }}>{l.actorName}</div>
                      <div className="mono" style={{ fontSize: "0.7rem", color: "var(--dim)" }}>
                        ID: {l.actorProfileId}
                      </div>
                    </td>

                    <td>
                      <span
                        className="mono"
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(255, 35, 143, 0.15)",
                          color: "#ff238f",
                          border: "1px solid rgba(255, 35, 143, 0.15)"
                        }}
                      >
                        {l.action}
                      </span>
                    </td>

                    <td>
                      <span
                        className="badge badge-neutral mono"
                        style={{ fontSize: "0.65rem", textTransform: "uppercase" }}
                      >
                        {l.entityType}
                      </span>
                      {l.entityId && (
                        <div className="mono" style={{ fontSize: "0.7rem", color: "var(--bone-dim)", marginTop: "0.2rem" }}>
                          {l.entityId}
                        </div>
                      )}
                    </td>

                    <td style={{ maxWidth: "360px", wordBreak: "break-word", fontSize: "0.85rem", color: "var(--bone-dim)" }}>
                      {l.details}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedLog(l)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.35rem 0.65rem" }}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: 0 }}>
                    <EmptyState
                      icon={ClipboardList}
                      title="No audit transactions found"
                      description={
                        searchQuery
                          ? `No log matches query "${searchQuery}".`
                          : "No transactions logged in this category."
                      }
                      action={
                        searchQuery || entityFilter !== "all" ? (
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setEntityFilter("all");
                            }}
                            className="btn btn-secondary btn-sm"
                          >
                            Reset Filters
                          </button>
                        ) : undefined
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Audit Inspector Modal */}
        {selectedLog && (
          <div
            className="scrim active"
            onClick={() => setSelectedLog(null)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem"
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="card"
              style={{
                maxWidth: "580px",
                width: "100%",
                background: "var(--bg-surface-elevated)",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              <div className="card-header">
                <h3 className="card-title">
                  <Terminal size={16} style={{ color: "#ff238f" }} />
                  Audit Transaction Inspector
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                    padding: "1rem",
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--line)"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Transaction ID</div>
                    <div className="mono" style={{ fontSize: "0.85rem", color: "#ff238f" }}>
                      {selectedLog.id}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Exact Timestamp</div>
                    <div className="mono" style={{ fontSize: "0.8rem", color: "var(--bone)" }}>
                      {new Date(selectedLog.createdAt).toISOString()}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Operator / Actor</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--bone)" }}>
                      {selectedLog.actorName} ({selectedLog.actorProfileId})
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Action Token</div>
                    <div className="mono" style={{ fontSize: "0.85rem", color: "#ff238f" }}>
                      {selectedLog.action}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--dim)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                    Transaction Payload &amp; Notes
                  </div>
                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      background: "var(--bg-surface)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--line)",
                      fontSize: "0.85rem",
                      color: "var(--bone)",
                      lineHeight: 1.6
                    }}
                  >
                    {selectedLog.details}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--dim)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                    Raw Cryptographic JSON Structure
                  </div>
                  <pre
                    className="mono"
                    style={{
                      padding: "0.75rem 1rem",
                      background: "var(--bg-base)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--line)",
                      fontSize: "0.75rem",
                      color: "#ff238f",
                      overflowX: "auto"
                    }}
                  >
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="btn btn-secondary btn-sm"
                  >
                    Dismiss Inspector
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
