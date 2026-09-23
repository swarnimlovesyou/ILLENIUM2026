"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, EventRecord, ScoringCriterion } from "@/services/master-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-card";
import { TabBar } from "@/components/dashboard/tab-bar";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Sparkles,
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  Lock,
  Flame,
  Shield,
  MapPin,
  Eye,
  X,
  FileCheck2
} from "lucide-react";

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventRecord | null>(null);
  const [eventCriteria, setEventCriteria] = useState<ScoringCriterion[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  function loadEvents() {
    setEvents([...masterStore.getEvents()]);
  }

  function changeStatus(id: string, status: EventRecord["status"]) {
    const ev = masterStore.getEventById(id);
    if (ev) {
      ev.status = status;
      masterStore.logAudit(
        "p-cp",
        "event.status_changed",
        "event",
        id,
        `Status set to ${status.toUpperCase()} for event ${ev.name} (${ev.code})`
      );
      loadEvents();
    }
  }

  function handleOpenDetails(ev: EventRecord) {
    setSelectedEventForDetail(ev);
    setEventCriteria(masterStore.getCriteriaByEvent(ev.id));
  }

  const openEvents = events.filter((e) => e.status === "open");
  const inProgressEvents = events.filter((e) => e.status === "in_progress");
  const completedEvents = events.filter((e) => e.status === "completed" || e.status === "locked");
  const biddingEnabledEvents = events.filter((e) => e.biddingEnabled);

  const filtered = events
    .filter((e) => {
      if (activeTab === "open") return e.status === "open";
      if (activeTab === "in_progress") return e.status === "in_progress";
      if (activeTab === "completed") return e.status === "completed" || e.status === "locked";
      return true;
    })
    .filter((e) => {
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    });

  const categories = Array.from(new Set(events.map((e) => e.category)));

  const tabs = [
    { id: "all", label: "All Programme Events", count: events.length },
    { id: "open", label: "Open & Scheduled", count: openEvents.length },
    { id: "in_progress", label: "Live Ongoing", count: inProgressEvents.length },
    { id: "completed", label: "Completed / Sealed", count: completedEvents.length }
  ];

  return (
    <RoleShell role="admin">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <DashboardHeader
          kicker="Programme & Operations Control"
          icon={Sparkles}
          title="Events Master Operations"
          subtitle="Real-time programme lifecycle control, schedule tracking, stage venue allocations, scoring criteria, and bidding stakes."
        />

        {/* Operational Metrics Cards */}
        <MetricGrid>
          <MetricCard
            label="Total Verticals"
            value={events.length}
            subtext="Official festival events"
            icon={Sparkles}
            color="var(--acid)"
          />
          <MetricCard
            label="Open / Scheduled"
            value={openEvents.length}
            subtext="Ready for staging"
            icon={Calendar}
            color="var(--cyan)"
          />
          <MetricCard
            label="Live Ongoing"
            value={inProgressEvents.length}
            subtext="On-stage in progress"
            icon={Play}
            color="var(--mag)"
          />
          <MetricCard
            label="Sealed & Locked"
            value={completedEvents.length}
            subtext="Results tabulated"
            icon={CheckCircle2}
            color="var(--success)"
          />
          <MetricCard
            label="Bidding Verticals"
            value={biddingEnabledEvents.length}
            subtext="High-stakes prediction"
            icon={Flame}
            color="var(--gold)"
          />
        </MetricGrid>

        {/* Tabs & Filter Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search event name, code, venue, or category..."
            filters={[
              {
                id: "category",
                label: "Category",
                value: categoryFilter,
                options: [
                  { label: "All Categories", value: "all" },
                  ...categories.map((c) => ({ label: c, value: c }))
                ],
                onChange: setCategoryFilter
              }
            ]}
            resultsCount={filtered.length}
            totalCount={events.length}
            onClear={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}
          />
        </div>

        {/* Main Operational Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Code</th>
                <th>Event / Vertical</th>
                <th>Category</th>
                <th>Venue &amp; Schedule</th>
                <th>Format</th>
                <th>Bidding Stakes</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Lifecycle Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span
                        className="mono"
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(216, 255, 46, 0.1)",
                          fontSize: "0.75rem",
                          color: "var(--acid)",
                          fontWeight: 700,
                          border: "1px solid rgba(216, 255, 46, 0.3)"
                        }}
                      >
                        {row.code}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{ fontWeight: 600, color: "var(--bone)", cursor: "pointer" }}
                        onClick={() => handleOpenDetails(row)}
                      >
                        {row.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                        Team Size: {row.minTeamSize}–{row.maxTeamSize} members
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>
                        {row.category}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: "0.85rem", color: "var(--bone)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <MapPin size={12} style={{ color: "var(--acid)" }} />
                        {row.venue}
                      </div>
                      <div className="mono" style={{ fontSize: "0.7rem", color: "var(--dim)", marginTop: "0.15rem" }}>
                        Report: {new Date(row.reportingTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    <td>
                      <span
                        className="badge badge-neutral"
                        style={{
                          fontSize: "0.65rem",
                          textTransform: "uppercase",
                          color: row.eventType === "contingent" ? "var(--gold)" : "var(--bone-dim)"
                        }}
                      >
                        {row.eventType}
                      </span>
                    </td>

                    <td>
                      {row.biddingEnabled ? (
                        <div className="mono" style={{ fontSize: "0.75rem", color: "var(--gold)" }}>
                          +{row.bidPositivePts} / {row.bidNegativePts} pts
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Disabled</span>
                      )}
                    </td>

                    <td>
                      <StatusBadge
                        label={row.status.replace("_", " ").toUpperCase()}
                        variant={
                          row.status === "in_progress"
                            ? "crimson"
                            : row.status === "open"
                            ? "acid"
                            : row.status === "completed"
                            ? "success"
                            : "neutral"
                        }
                      />
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center" }}>
                        {row.status === "open" ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ gap: "0.3rem" }}
                            onClick={() => changeStatus(row.id, "in_progress")}
                          >
                            <Play size={12} style={{ color: "var(--acid)" }} />
                            <span>Start</span>
                          </button>
                        ) : row.status === "in_progress" ? (
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ gap: "0.3rem" }}
                            onClick={() => changeStatus(row.id, "completed")}
                          >
                            <CheckCircle2 size={12} />
                            <span>Complete</span>
                          </button>
                        ) : row.status === "completed" ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ gap: "0.3rem", color: "var(--mag)", borderColor: "rgba(255, 45, 111, 0.4)" }}
                            onClick={() => changeStatus(row.id, "locked")}
                          >
                            <Lock size={12} />
                            <span>Lock Scores</span>
                          </button>
                        ) : (
                          <span className="mono" style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                            Sealed
                          </span>
                        )}

                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "0.3rem" }}
                          onClick={() => handleOpenDetails(row)}
                          title="View event parameters & rubric"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <EmptyState
                      icon={Sparkles}
                      title="No events found"
                      description={
                        searchQuery
                          ? `No event matching "${searchQuery}".`
                          : "No events exist in this tab category."
                      }
                      action={
                        searchQuery || categoryFilter !== "all" ? (
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setCategoryFilter("all");
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

        {/* Event Detail & Criteria Dossier Modal */}
        {selectedEventForDetail && (
          <div
            className="scrim active"
            onClick={() => setSelectedEventForDetail(null)}
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
                maxWidth: "600px",
                width: "100%",
                background: "var(--bg-surface-elevated)",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              <div className="card-header">
                <div>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--acid)" }}>
                    {selectedEventForDetail.code} · Operational Dossier
                  </span>
                  <h3 className="card-title" style={{ marginTop: "0.2rem" }}>
                    {selectedEventForDetail.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEventForDetail(null)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Category</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--bone)" }}>{selectedEventForDetail.category}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Venue Arena</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--bone)" }}>{selectedEventForDetail.venue}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Event Format</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--bone)", textTransform: "capitalize" }}>
                      {selectedEventForDetail.eventType} ({selectedEventForDetail.minTeamSize}–{selectedEventForDetail.maxTeamSize} team)
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Lifecycle Status</div>
                    <div style={{ marginTop: "0.2rem" }}>
                      <StatusBadge label={selectedEventForDetail.status.toUpperCase()} variant="acid" />
                    </div>
                  </div>
                </div>

                {/* Scoring Criteria Rubric */}
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.6rem" }}>
                    Official Scoring Rubric &amp; Weights
                  </h4>
                  {eventCriteria.length ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {eventCriteria.map((crit, idx) => (
                        <div
                          key={crit.id}
                          style={{
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-surface)",
                            border: "1px solid var(--line)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--bone)" }}>
                              {idx + 1}. {crit.name}
                            </div>
                            {crit.description && (
                              <div style={{ fontSize: "0.75rem", color: "var(--bone-dim)", marginTop: "0.15rem" }}>
                                {crit.description}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="mono" style={{ fontSize: "0.85rem", color: "var(--acid)", fontWeight: 700 }}>
                              / {crit.maxScore} pts
                            </div>
                            <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>
                              {crit.weight}x Weight
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.85rem", color: "var(--dim)", margin: 0 }}>
                      Standard 3-tier judging rubric applies for this vertical (Technique, Creativity, Stage Impact).
                    </p>
                  )}
                </div>

                {/* Bidding Settings */}
                {selectedEventForDetail.biddingEnabled && (
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(255, 200, 55, 0.08)",
                      border: "1px solid rgba(255, 200, 55, 0.25)",
                      fontSize: "0.8rem",
                      color: "var(--bone)"
                    }}
                  >
                    <b style={{ color: "var(--gold)" }}>Contingent Bidding Stakes:</b> Correct rank prediction awards{" "}
                    <b>+{selectedEventForDetail.bidPositivePts} points</b>. Incorrect prediction incurs a{" "}
                    <b>{selectedEventForDetail.bidNegativePts} points</b> deduction.
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setSelectedEventForDetail(null)}
                    className="btn btn-secondary btn-sm"
                  >
                    Close Operations Dossier
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
