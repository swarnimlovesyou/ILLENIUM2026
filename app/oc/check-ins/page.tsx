"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, CheckInRecord } from "@/services/master-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-card";
import { TabBar } from "@/components/dashboard/tab-bar";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  CheckCircle2,
  QrCode,
  Shield,
  Layers,
  MapPin,
  Clock,
  UserCheck,
  Search,
  Gift
} from "lucide-react";

export default function CheckInsPage() {
  const [logs, setLogs] = useState<CheckInRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkpointFilter, setCheckpointFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

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
      campus_entry: "Campus Gate",
      event_entry: "Stage / Venue",
      goodie_distribution: "Goodie Bag",
      prize_distribution: "Prize Desk"
    };
    return map[type] ?? type;
  }

  const campusEntries = logs.filter((c) => c.checkInType === "campus_entry");
  const venueEntries = logs.filter((c) => c.checkInType === "event_entry");
  const specialEntries = logs.filter(
    (c) => c.checkInType === "goodie_distribution" || c.checkInType === "prize_distribution"
  );

  const filtered = logs
    .filter((c) => {
      if (activeTab === "campus") return c.checkInType === "campus_entry";
      if (activeTab === "venue") return c.checkInType === "event_entry";
      if (activeTab === "special") {
        return c.checkInType === "goodie_distribution" || c.checkInType === "prize_distribution";
      }
      return true;
    })
    .filter((c) => {
      if (checkpointFilter !== "all" && c.checkInType !== checkpointFilter) return false;
      if (statusFilter !== "all" && c.attendanceStatus !== statusFilter) return false;

      const q = searchQuery.toLowerCase();
      return (
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.illeniumId.toLowerCase().includes(q) ||
        (c.eventName && c.eventName.toLowerCase().includes(q)) ||
        (c.venueName && c.venueName.toLowerCase().includes(q)) ||
        (c.scannedBy && c.scannedBy.toLowerCase().includes(q))
      );
    });

  const tabs = [
    { id: "all", label: "All Telemetry", count: logs.length },
    { id: "campus", label: "Campus Perimeter", count: campusEntries.length },
    { id: "venue", label: "Stage Venues", count: venueEntries.length },
    { id: "special", label: "Desk & Goodies", count: specialEntries.length }
  ];

  return (
    <RoleShell role="oc">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <DashboardHeader
          kicker="Gate & Access Telemetry"
          icon={CheckCircle2}
          title="Live Check-in Logs"
          subtitle="Timestamped, duplicate-safe audit logs of all RFID wristband and QR pass scans across campus access points and stage perimeters."
        />

        {/* Operational Metrics Cards */}
        <MetricGrid>
          <MetricCard
            label="Total Check-ins"
            value={logs.length}
            subtext="Validated attendance scans"
            icon={QrCode}
            color="#ff238f"
          />
          <MetricCard
            label="Main Campus Gate"
            value={campusEntries.length}
            subtext="Perimeter entries accepted"
            icon={CheckCircle2}
            color="var(--success)"
          />
          <MetricCard
            label="Stage & Venues"
            value={venueEntries.length}
            subtext="Auditorium & Quad entries"
            icon={MapPin}
            color="#ff238f"
          />
          <MetricCard
            label="Special Desks"
            value={specialEntries.length}
            subtext="Kits & prize verification"
            icon={Gift}
            color="var(--gold)"
          />
        </MetricGrid>

        {/* Tabs & Filter Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search attendee name, ILLENIUM ID, event, or venue..."
            filters={[
              {
                id: "checkpoint",
                label: "Checkpoint",
                value: checkpointFilter,
                options: [
                  { label: "All Checkpoints", value: "all" },
                  { label: "Campus Entry", value: "campus_entry" },
                  { label: "Stage / Event Entry", value: "event_entry" },
                  { label: "Goodie Bag", value: "goodie_distribution" },
                  { label: "Prize Desk", value: "prize_distribution" }
                ],
                onChange: setCheckpointFilter
              },
              {
                id: "status",
                label: "Attendance",
                value: statusFilter,
                options: [
                  { label: "All Statuses", value: "all" },
                  { label: "Accepted", value: "accepted" },
                  { label: "Rejected / Duplicate", value: "rejected" }
                ],
                onChange: setStatusFilter
              }
            ]}
            resultsCount={filtered.length}
            totalCount={logs.length}
            onClear={() => {
              setSearchQuery("");
              setCheckpointFilter("all");
              setStatusFilter("all");
            }}
          />
        </div>

        {/* Main Check-ins Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "160px" }}>Scan Timestamp</th>
                <th>Participant</th>
                <th>ILLENIUM UID</th>
                <th>Checkpoint</th>
                <th>Venue / Location</th>
                <th>Operator</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="mono" style={{ fontSize: "0.8rem", color: "var(--bone)", fontWeight: 600 }}>
                        {new Date(row.scannedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                      <div className="mono" style={{ fontSize: "0.7rem", color: "var(--dim)" }}>
                        {new Date(row.scannedAt).toLocaleDateString([], { day: "2-digit", month: "short" })}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "var(--bone)" }}>{row.fullName}</div>
                    </td>

                    <td>
                      <span
                        className="mono"
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(255, 255, 255, 0.05)",
                          fontSize: "0.75rem",
                          color: "#ff238f",
                          fontWeight: 600,
                          border: "1px solid var(--line)"
                        }}
                      >
                        {row.illeniumId}
                      </span>
                    </td>

                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>
                        {checkpointLabel(row.checkInType)}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: "0.85rem", color: "var(--bone)" }}>
                        {row.eventName || row.venueName || "Main Campus Gate"}
                      </div>
                    </td>

                    <td>
                      <span className="mono" style={{ fontSize: "0.75rem", color: "var(--bone-dim)" }}>
                        {row.scannedBy || "OC Gate Team"}
                      </span>
                    </td>

                    <td>
                      <StatusBadge
                        label={row.attendanceStatus || "Accepted"}
                        variant={row.attendanceStatus === "rejected" ? "crimson" : "success"}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: 0 }}>
                    <EmptyState
                      icon={QrCode}
                      title="No check-ins recorded"
                      description={
                        searchQuery
                          ? `No scan records match "${searchQuery}".`
                          : "No check-ins in this checkpoint category yet."
                      }
                      action={
                        searchQuery || checkpointFilter !== "all" || statusFilter !== "all" ? (
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setCheckpointFilter("all");
                              setStatusFilter("all");
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
      </div>
    </RoleShell>
  );
}
