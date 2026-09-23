"use client";

import { useEffect, useState, useTransition } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile, WristbandRecord } from "@/services/master-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-card";
import { TabBar } from "@/components/dashboard/tab-bar";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Ticket,
  UserCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldAlert,
  Search,
  Plus,
  Sparkles,
  QrCode,
  Layers,
  X
} from "lucide-react";

export default function VerificationPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [wristbands, setWristbands] = useState<WristbandRecord[]>([]);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProfileForWristband, setSelectedProfileForWristband] = useState<Profile | null>(null);
  const [wristbandDay, setWristbandDay] = useState<1 | 2>(1);
  const [, startTransition] = useTransition();

  function load() {
    setProfiles([...masterStore.getProfiles()]);
    setWristbands([...masterStore.getWristbands()]);
  }

  useEffect(() => {
    load();
  }, []);

  function approve(profileId: string) {
    const list = masterStore.getProfiles();
    const p = list.find((p) => p.id === profileId);
    if (p) {
      p.verificationStatus = "verified";
      masterStore.logAudit(
        "p-cp",
        "profile.verified",
        "profile",
        p.id,
        `Approved identity and issued pass for ${p.fullName} (${p.illeniumId})`
      );
    }
    startTransition(() => load());
  }

  function reject(profileId: string) {
    const list = masterStore.getProfiles();
    const p = list.find((p) => p.id === profileId);
    if (p) {
      p.verificationStatus = "rejected";
      masterStore.logAudit(
        "p-cp",
        "profile.rejected",
        "profile",
        p.id,
        `Rejected identity submission for ${p.fullName} (${p.illeniumId})`
      );
    }
    startTransition(() => load());
  }

  function handleIssueWristband(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProfileForWristband) return;

    const token = `RFID-${selectedProfileForWristband.illeniumId}-D${wristbandDay}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    masterStore.issueWristband(
      selectedProfileForWristband.id,
      wristbandDay,
      token,
      "DESK-ADMIN-01"
    );

    setSelectedProfileForWristband(null);
    startTransition(() => load());
  }

  const verified = profiles.filter((p) => p.verificationStatus === "verified");
  const pending = profiles.filter((p) => p.verificationStatus === "pending");
  const activeWristbands = wristbands.filter((w) => w.status === "active");
  const replacedWristbands = wristbands.filter((w) => w.status === "replaced");

  // Filter profiles or wristbands depending on tab
  const filteredProfiles = profiles
    .filter((p) => {
      if (activeTab === "pending") return p.verificationStatus === "pending";
      if (activeTab === "verified") return p.verificationStatus === "verified";
      if (activeTab === "wristbands") {
        return wristbands.some((w) => w.profileId === p.id && w.status === "active");
      }
      if (activeTab === "replaced") {
        return wristbands.some((w) => w.profileId === p.id && w.status === "replaced");
      }
      return true;
    })
    .filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.illeniumId.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.collegeName.toLowerCase().includes(q)
      );
    });

  const tabs = [
    { id: "pending", label: "Pending Verification", count: pending.length },
    { id: "verified", label: "Verified Passes", count: verified.length },
    { id: "wristbands", label: "Active Wristbands", count: activeWristbands.length },
    { id: "replaced", label: "Replaced Wristbands", count: replacedWristbands.length },
    { id: "all", label: "All Attendees", count: profiles.length }
  ];

  return (
    <RoleShell role="admin">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <DashboardHeader
          kicker="Identity & Access Operations"
          icon={Ticket}
          title="Accreditation & Wristbands Desk"
          subtitle="Review attendee identity submissions, approve digital passes, bind physical Day 1/Day 2 RFID wristbands, and track tamper replacements."
        />

        {/* Operational Metrics Cards */}
        <MetricGrid>
          <MetricCard
            label="Total to Accredit"
            value={profiles.length}
            subtext="Registered attendee profiles"
            icon={Layers}
            color="var(--acid)"
          />
          <MetricCard
            label="Verified Passes"
            value={verified.length}
            subtext="Identity documents approved"
            icon={CheckCircle2}
            color="var(--success)"
          />
          <MetricCard
            label="Pending Queue"
            value={pending.length}
            subtext="Awaiting desk review"
            icon={Clock}
            color="var(--warning)"
          />
          <MetricCard
            label="Wristbands Bound"
            value={activeWristbands.length}
            subtext="Active RFID tokens in circulation"
            icon={QrCode}
            color="var(--cyan)"
          />
          <MetricCard
            label="Wristbands Replaced"
            value={replacedWristbands.length}
            subtext="Damaged or lost re-issuances"
            icon={RotateCcw}
            color="var(--mag)"
          />
        </MetricGrid>

        {/* Tabs & Filter Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search attendee name, ILLENIUM ID, email, or college..."
            filters={[
              {
                id: "category",
                label: "Category",
                value: categoryFilter,
                options: [
                  { label: "All Categories", value: "all" },
                  { label: "Contingent (CC)", value: "cc" },
                  { label: "PR & Media (PRNC)", value: "prnc" },
                  { label: "Security & OC (OTSE)", value: "otse" },
                  { label: "General Audience", value: "audience" }
                ],
                onChange: setCategoryFilter
              }
            ]}
            resultsCount={filteredProfiles.length}
            totalCount={profiles.length}
            onClear={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}
          />
        </div>

        {/* Operational Records Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Attendee</th>
                <th>ILLENIUM UID</th>
                <th>Category</th>
                <th>College / Affiliation</th>
                <th>Verification</th>
                <th>Wristband Binding</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.length ? (
                filteredProfiles.map((row) => {
                  const userWristbands = wristbands.filter((w) => w.profileId === row.id);
                  const activeWb = userWristbands.find((w) => w.status === "active");
                  const hasReplaced = userWristbands.some((w) => w.status === "replaced");

                  return (
                    <tr key={row.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--bone)" }}>{row.fullName}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--dim)" }}>{row.email}</div>
                      </td>

                      <td>
                        <span
                          className="mono"
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "var(--radius-sm)",
                            background: "rgba(255, 255, 255, 0.05)",
                            fontSize: "0.75rem",
                            color: "var(--bone)",
                            border: "1px solid var(--line)"
                          }}
                        >
                          {row.illeniumId}
                        </span>
                      </td>

                      <td>
                        <span
                          className="badge badge-neutral"
                          style={{ fontSize: "0.65rem", textTransform: "uppercase" }}
                        >
                          {row.category}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: "0.85rem", color: "var(--bone)" }}>{row.collegeName}</div>
                        {row.collegeRollNumber && (
                          <div className="mono" style={{ fontSize: "0.7rem", color: "var(--dim)" }}>
                            Roll: {row.collegeRollNumber}
                          </div>
                        )}
                      </td>

                      <td>
                        <StatusBadge
                          label={
                            row.verificationStatus === "verified"
                              ? "Verified"
                              : row.verificationStatus === "rejected"
                              ? "Rejected"
                              : "Pending"
                          }
                          variant={
                            row.verificationStatus === "verified"
                              ? "success"
                              : row.verificationStatus === "rejected"
                              ? "crimson"
                              : "warning"
                          }
                        />
                      </td>

                      <td>
                        {activeWb ? (
                          <div>
                            <span
                              className="mono"
                              style={{
                                fontSize: "0.7rem",
                                padding: "0.2rem 0.45rem",
                                borderRadius: "4px",
                                background: "rgba(0, 229, 255, 0.1)",
                                color: "var(--cyan)",
                                border: "1px solid rgba(0, 229, 255, 0.3)"
                              }}
                            >
                              Day {activeWb.day} Active
                            </span>
                            {hasReplaced && (
                              <div style={{ fontSize: "0.65rem", color: "var(--mag)", marginTop: "0.2rem" }}>
                                History: Replaced
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Not Assigned</span>
                        )}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
                          {row.verificationStatus === "pending" ? (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => approve(row.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ color: "var(--mag)" }}
                                onClick={() => reject(row.id)}
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ gap: "0.35rem" }}
                              onClick={() => setSelectedProfileForWristband(row)}
                            >
                              <Ticket size={13} style={{ color: "var(--acid)" }} />
                              <span>{activeWb ? "Replace Wristband" : "Issue Wristband"}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: 0 }}>
                    <EmptyState
                      icon={Ticket}
                      title="No attendees found"
                      description={
                        searchQuery
                          ? `No records match query "${searchQuery}".`
                          : "No records found in this queue."
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

        {/* Wristband Issuance / Replacement Modal */}
        {selectedProfileForWristband && (
          <div
            className="scrim active"
            onClick={() => setSelectedProfileForWristband(null)}
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
                maxWidth: "480px",
                width: "100%",
                background: "var(--bg-surface-elevated)",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              <div className="card-header">
                <h3 className="card-title">
                  <Ticket size={16} style={{ color: "var(--acid)" }} />
                  Accredit RFID Wristband
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedProfileForWristband(null)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--dim)" }}>Assigning Wristband to:</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--bone)", marginTop: "0.2rem" }}>
                  {selectedProfileForWristband.fullName}
                </div>
                <div className="mono" style={{ fontSize: "0.8rem", color: "var(--acid)" }}>
                  Permanent UID: {selectedProfileForWristband.illeniumId}
                </div>
              </div>

              <form onSubmit={handleIssueWristband} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Wristband Access Day</label>
                  <select
                    className="form-control"
                    value={wristbandDay}
                    onChange={(e) => setWristbandDay(Number(e.target.value) as 1 | 2)}
                  >
                    <option value={1}>Day 1 (Saturday 28 Nov)</option>
                    <option value={2}>Day 2 (Sunday 29 Nov)</option>
                  </select>
                </div>

                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(216, 255, 46, 0.08)",
                    border: "1px solid rgba(216, 255, 46, 0.2)",
                    fontSize: "0.75rem",
                    color: "var(--bone-dim)",
                    lineHeight: 1.5
                  }}
                >
                  <b style={{ color: "var(--acid)" }}>Security Policy:</b> Binding a new wristband token for this day will
                  automatically mark any existing wristband as <i>Replaced</i> in the compliance audit log.
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedProfileForWristband(null)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Confirm &amp; Bind Wristband
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
