"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Contingent, Profile } from "@/services/master-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-card";
import { TabBar } from "@/components/dashboard/tab-bar";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Users,
  Shield,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UserCheck,
  Building,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function ContingentsPage() {
  const [contingents, setContingents] = useState<Contingent[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form State
  const [newCollege, setNewCollege] = useState("");
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [selectedCl, setSelectedCl] = useState("");
  const [selectedAcl, setSelectedAcl] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setContingents([...masterStore.getContingents()]);
    setProfiles([...masterStore.getProfiles()]);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newCollege || !newName || !newCode) {
      setMessage({ text: "Please fill all required fields: code, contingent name, and college.", type: "error" });
      return;
    }

    const existing = contingents.find((c) => c.code.toLowerCase() === newCode.trim().toLowerCase());
    if (existing) {
      setMessage({
        text: `Contingent code "${newCode.toUpperCase()}" is already assigned to ${existing.name}.`,
        type: "error"
      });
      return;
    }

    const newCont: Contingent = {
      id: `c-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      collegeName: newCollege.trim(),
      clProfileId: selectedCl || undefined,
      aclProfileId: selectedAcl || undefined
    };

    contingents.push(newCont);
    masterStore.logAudit(
      "ADMIN",
      "contingent.allocated",
      "contingent",
      newCont.id,
      `Allocated code ${newCont.code} to ${newCont.name} (${newCont.collegeName})`
    );

    setNewCollege("");
    setNewName("");
    setNewCode("");
    setSelectedCl("");
    setSelectedAcl("");
    setMessage({
      text: `Successfully allocated and locked ${newCont.code} for ${newCont.name}!`,
      type: "success"
    });
    loadData();
  }

  const cls = profiles.filter((p) => p.role === "cl");
  const acls = profiles.filter((p) => p.role === "acl");

  const fullyAssigned = contingents.filter((c) => c.clProfileId && c.aclProfileId);
  const incomplete = contingents.filter((c) => !c.clProfileId || !c.aclProfileId);

  // Filter based on active tab & search query
  const filtered = contingents
    .filter((c) => {
      if (activeTab === "complete") return c.clProfileId && c.aclProfileId;
      if (activeTab === "incomplete") return !c.clProfileId || !c.aclProfileId;
      return true;
    })
    .filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.collegeName.toLowerCase().includes(q)
      );
    });

  const tabs = [
    { id: "all", label: "All Contingents", count: contingents.length },
    { id: "complete", label: "Fully Assigned", count: fullyAssigned.length },
    { id: "incomplete", label: "Pending Leaders", count: incomplete.length }
  ];

  return (
    <RoleShell role="admin">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <DashboardHeader
          kicker="Section 4 · CL/ACL Meet"
          icon={Users}
          title="Contingents Operations"
          subtitle="Manage official contingent codes (CC), verify CL/ACL orientation status, and lock intercollegiate allocations."
          actions={
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-primary"
              style={{ gap: "0.4rem" }}
            >
              {showCreateForm ? <ChevronUp size={15} /> : <Plus size={15} />}
              <span>{showCreateForm ? "Close Allocation Form" : "Allocate Contingent Code"}</span>
            </button>
          }
        />

        {/* Operational Metrics Cards */}
        <MetricGrid>
          <MetricCard
            label="Total Contingents"
            value={contingents.length}
            subtext="Colleges on active roster"
            icon={Building}
            color="#ff238f"
          />
          <MetricCard
            label="CLs Accredited"
            value={cls.length}
            subtext="Contingent leaders mapped"
            icon={UserCheck}
            color="var(--success)"
          />
          <MetricCard
            label="ACLs Verified"
            value={acls.length}
            subtext="Assistant leaders present"
            icon={Shield}
            color="#ff238f"
          />
          <MetricCard
            label="Code Allocation"
            value="LOCKED"
            subtext="Cryptographic UID tokens"
            icon={Lock}
            color="var(--gold)"
          />
        </MetricGrid>

        {/* Collapsible Allocation Form */}
        {showCreateForm && (
          <div className="card" style={{ animation: "fadeIn 0.2s ease" }}>
            <div className="card-header">
              <h3 className="card-title">
                <Sparkles size={16} style={{ color: "#ff238f" }} />
                Allocate Contingent Code (CL Meet)
              </h3>
              <span className="mono" style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                Orientation Bidding Resolution
              </span>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginBottom: "1.25rem" }}>
              Assign the official contingent code won during the CL/ACL Meet live bidding session.
              Once confirmed, this code binds all participant registrations from that institution.
            </p>

            {message && (
              <div
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  background: message.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                  border: `1px solid ${message.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  color: message.type === "success" ? "var(--success)" : "var(--danger)",
                  fontSize: "0.85rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", alignItems: "end" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Contingent Code</label>
                <input
                  className="form-control mono"
                  placeholder="CC-05"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Team / Contingent Name</label>
                <input
                  className="form-control"
                  placeholder="Mithibai Mavericks"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">College / Institution</label>
                <input
                  className="form-control"
                  placeholder="Mithibai College, Vile Parle"
                  value={newCollege}
                  onChange={(e) => setNewCollege(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Assign CL (Leader)</label>
                <select className="form-control" value={selectedCl} onChange={(e) => setSelectedCl(e.target.value)}>
                  <option value="">-- Select Verified CL --</option>
                  {cls.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.illeniumId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Assign ACL (Assistant)</label>
                <select className="form-control" value={selectedAcl} onChange={(e) => setSelectedAcl(e.target.value)}>
                  <option value="">-- Select Verified ACL --</option>
                  {acls.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.illeniumId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Confirm &amp; Lock Code
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs & Filter Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search contingent code, team name, or college..."
            resultsCount={filtered.length}
            totalCount={contingents.length}
            onClear={() => setSearchQuery("")}
          />
        </div>

        {/* Main Contingents Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "110px" }}>Code</th>
                <th>Team / Contingent</th>
                <th>College / Institution</th>
                <th>Contingent Leader (CL)</th>
                <th>Assistant CL (ACL)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((c) => {
                  const cl = profiles.find((p) => p.id === c.clProfileId);
                  const acl = profiles.find((p) => p.id === c.aclProfileId);
                  const isReady = cl && acl;

                  return (
                    <tr key={c.id}>
                      <td>
                        <span
                          className="mono"
                          style={{
                            padding: "0.25rem 0.55rem",
                            borderRadius: "var(--radius-sm)",
                            background: "rgba(255, 35, 143, 0.15)",
                            color: "#ff238f",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            border: "1px solid rgba(255, 35, 143, 0.15)"
                          }}
                        >
                          {c.code}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: "var(--bone)" }}>{c.name}</div>
                        <div className="mono" style={{ fontSize: "0.7rem", color: "var(--dim)" }}>
                          UID: {c.id}
                        </div>
                      </td>

                      <td>
                        <div style={{ color: "var(--bone)", fontSize: "0.85rem" }}>{c.collegeName}</div>
                      </td>

                      <td>
                        {cl ? (
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{cl.fullName}</div>
                            <div className="mono" style={{ fontSize: "0.7rem", color: "var(--bone-dim)" }}>
                              {cl.illeniumId}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Unassigned</span>
                        )}
                      </td>

                      <td>
                        {acl ? (
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{acl.fullName}</div>
                            <div className="mono" style={{ fontSize: "0.7rem", color: "var(--bone-dim)" }}>
                              {acl.illeniumId}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Unassigned</span>
                        )}
                      </td>

                      <td>
                        <StatusBadge
                          label={isReady ? "Allotted & Locked" : "Pending Leaders"}
                          variant={isReady ? "acid" : "warning"}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: 0 }}>
                    <EmptyState
                      icon={Building}
                      title="No contingents found"
                      description={
                        searchQuery
                          ? `No contingent matches "${searchQuery}".`
                          : "No contingents exist in this category yet."
                      }
                      action={
                        searchQuery ? (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="btn btn-secondary btn-sm"
                          >
                            Clear Search
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
