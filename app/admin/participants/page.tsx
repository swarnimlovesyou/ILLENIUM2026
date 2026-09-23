"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile } from "@/services/master-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-card";
import { TabBar } from "@/components/dashboard/tab-bar";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Users,
  CheckCircle2,
  Clock,
  Shield,
  Building,
  UserCheck,
  Eye,
  X,
  CreditCard
} from "lucide-react";

export default function ParticipantsPage() {
  const [list, setList] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [inspectProfile, setInspectProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setList([...masterStore.getProfiles()]);
  }, []);

  const verified = list.filter((p) => p.verificationStatus === "verified");
  const pending = list.filter((p) => p.verificationStatus === "pending");
  const leaders = list.filter((p) =>
    ["cl", "acl", "cp", "vcp", "oc", "judge", "scoring_admin"].includes(p.role)
  );

  const collegesCount = new Set(list.map((p) => p.collegeName)).size;

  const filtered = list
    .filter((p) => {
      if (activeTab === "verified") return p.verificationStatus === "verified";
      if (activeTab === "pending") return p.verificationStatus === "pending";
      if (activeTab === "leaders") {
        return ["cl", "acl", "cp", "vcp", "oc", "judge", "scoring_admin"].includes(p.role);
      }
      if (activeTab === "general") {
        return !["cl", "acl", "cp", "vcp", "oc", "judge", "scoring_admin"].includes(p.role);
      }
      return true;
    })
    .filter((p) => {
      if (roleFilter !== "all" && p.role !== roleFilter) return false;
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
    { id: "all", label: "All Participants", count: list.length },
    { id: "verified", label: "Verified", count: verified.length },
    { id: "pending", label: "Pending", count: pending.length },
    { id: "leaders", label: "Leadership & Staff", count: leaders.length },
    { id: "general", label: "General Attendees", count: list.length - leaders.length }
  ];

  return (
    <RoleShell role="admin">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <DashboardHeader
          kicker="Festival Roster & Identities"
          icon={Users}
          title="Participants Master Directory"
          subtitle="Real-time registry of attendee identities, contingent leader assignments, digital pass verification, and access roles."
        />

        {/* Operational Metrics Cards */}
        <MetricGrid>
          <MetricCard
            label="Total Participants"
            value={list.length}
            subtext="Registered fest attendees"
            icon={Users}
            color="var(--acid)"
          />
          <MetricCard
            label="Verified Profiles"
            value={verified.length}
            subtext="Pass credentials issued"
            icon={CheckCircle2}
            color="var(--success)"
          />
          <MetricCard
            label="Pending Review"
            value={pending.length}
            subtext="Awaiting desk verification"
            icon={Clock}
            color="var(--warning)"
          />
          <MetricCard
            label="Leadership Roster"
            value={leaders.length}
            subtext="CL, ACL, OC, and judges"
            icon={Shield}
            color="var(--cyan)"
          />
          <MetricCard
            label="Institutions"
            value={collegesCount}
            subtext="Colleges represented"
            icon={Building}
            color="var(--gold)"
          />
        </MetricGrid>

        {/* Tabs & Filter Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by name, ILLENIUM ID, email, or college..."
            filters={[
              {
                id: "role",
                label: "Role",
                value: roleFilter,
                options: [
                  { label: "All Roles", value: "all" },
                  { label: "CL (Contingent Leader)", value: "cl" },
                  { label: "ACL (Assistant CL)", value: "acl" },
                  { label: "OC (Organizing Comm)", value: "oc" },
                  { label: "Judge", value: "judge" },
                  { label: "Participant", value: "participant" },
                  { label: "Executive (CP)", value: "cp" }
                ],
                onChange: setRoleFilter
              }
            ]}
            resultsCount={filtered.length}
            totalCount={list.length}
            onClear={() => {
              setSearchQuery("");
              setRoleFilter("all");
            }}
          />
        </div>

        {/* Main Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>ILLENIUM UID</th>
                <th>College / Department</th>
                <th>Role</th>
                <th>Category</th>
                <th>Verification</th>
                <th style={{ textAlign: "right" }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((row) => (
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
                          color: "var(--acid)",
                          fontWeight: 600,
                          border: "1px solid var(--line)"
                        }}
                      >
                        {row.illeniumId}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: "0.85rem", color: "var(--bone)" }}>{row.collegeName}</div>
                      {row.department && (
                        <div style={{ fontSize: "0.75rem", color: "var(--bone-dim)" }}>
                          Dept: {row.department}
                        </div>
                      )}
                    </td>

                    <td>
                      <span
                        className="badge badge-neutral mono"
                        style={{
                          fontSize: "0.65rem",
                          color:
                            row.role === "cl" || row.role === "acl"
                              ? "var(--gold)"
                              : row.role === "oc"
                              ? "var(--acid)"
                              : row.role === "judge"
                              ? "var(--cyan)"
                              : "var(--bone-dim)"
                        }}
                      >
                        {row.role.toUpperCase()}
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

                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => setInspectProfile(row)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.35rem 0.65rem" }}
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: 0 }}>
                    <EmptyState
                      icon={Users}
                      title="No participants found"
                      description={
                        searchQuery
                          ? `No records match search term "${searchQuery}".`
                          : "No participants registered in this category."
                      }
                      action={
                        searchQuery || roleFilter !== "all" ? (
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setRoleFilter("all");
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

        {/* Profile Detail Drawer Modal */}
        {inspectProfile && (
          <div
            className="scrim active"
            onClick={() => setInspectProfile(null)}
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
                maxWidth: "520px",
                width: "100%",
                background: "var(--bg-surface-elevated)",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              <div className="card-header">
                <h3 className="card-title">
                  <CreditCard size={16} style={{ color: "var(--acid)" }} />
                  Participant Identity Dossier
                </h3>
                <button
                  type="button"
                  onClick={() => setInspectProfile(null)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--bone)" }}>
                    {inspectProfile.fullName}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--bone-dim)" }}>
                    {inspectProfile.email}
                  </div>
                </div>

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
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Permanent UID</div>
                    <div className="mono" style={{ fontSize: "0.9rem", color: "var(--acid)", fontWeight: 700 }}>
                      {inspectProfile.illeniumId}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Assigned Role</div>
                    <div className="mono" style={{ fontSize: "0.9rem", color: "var(--bone)" }}>
                      {inspectProfile.role.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>College / Institution</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--bone)" }}>
                      {inspectProfile.collegeName}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Accreditation Category</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--bone)", textTransform: "uppercase" }}>
                      {inspectProfile.category}
                    </div>
                  </div>

                  {inspectProfile.collegeRollNumber && (
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>College Roll No</div>
                      <div className="mono" style={{ fontSize: "0.85rem", color: "var(--bone)" }}>
                        {inspectProfile.collegeRollNumber}
                      </div>
                    </div>
                  )}

                  {inspectProfile.department && (
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Department</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--bone)" }}>
                        {inspectProfile.department}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--dim)" }}>Verification Status:</span>
                  <StatusBadge
                    label={inspectProfile.verificationStatus}
                    variant={inspectProfile.verificationStatus === "verified" ? "success" : "warning"}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <button
                    onClick={() => setInspectProfile(null)}
                    className="btn btn-secondary btn-sm"
                  >
                    Close Dossier
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
