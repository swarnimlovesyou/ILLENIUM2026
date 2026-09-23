"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Contingent, Profile } from "@/services/master-store";

export default function ContingentsPage() {
  const [contingents, setContingents] = useState<Contingent[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [newCollege, setNewCollege] = useState("");
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [selectedCl, setSelectedCl] = useState("");
  const [selectedAcl, setSelectedAcl] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");

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
      setMessage("Please fill all contingent code, team name, and college fields.");
      return;
    }

    const existing = contingents.find(c => c.code.toLowerCase() === newCode.toLowerCase());
    if (existing) {
      setMessage(`Contingent code ${newCode} is already assigned to ${existing.name}.`);
      return;
    }

    const newCont: Contingent = {
      id: `c-${Date.now()}`,
      code: newCode.toUpperCase(),
      name: newName,
      collegeName: newCollege,
      clProfileId: selectedCl || undefined,
      aclProfileId: selectedAcl || undefined
    };

    contingents.push(newCont);
    masterStore.logAudit("ADMIN", "contingent.allocated", "contingent", newCont.id, `Allocated code ${newCont.code} to ${newCont.name} (${newCont.collegeName})`);
    setNewCollege("");
    setNewName("");
    setNewCode("");
    setSelectedCl("");
    setSelectedAcl("");
    setMessage(`Successfully allocated ${newCont.code} to ${newCont.name}!`);
    loadData();
  }

  const cls = profiles.filter(p => p.role === "cl");
  const acls = profiles.filter(p => p.role === "acl");

  const filtered = contingents.filter(c => 
    c.code.toLowerCase().includes(filter.toLowerCase()) ||
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.collegeName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <RoleShell role="admin">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Section 4 · CL/ACL Meet</div>
          <h1>Contingent Code Allocation</h1>
          <p className="workspace-subtitle">
            Manage official contingent codes (CC), verify CL/ACL orientation attendance, and lock college allocations.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span className="live-pill"><i /> {contingents.length} Contingents Active</span>
        </div>
      </div>

      <div className="data-grid">
        <div className="data-card">
          <div className="data-card-label">Total Contingents</div>
          <div className="data-card-value">{contingents.length}</div>
          <div className="data-card-note">Verified colleges in roster</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">CLs Accredited</div>
          <div className="data-card-value status-good">{cls.length}</div>
          <div className="data-card-note">Contingent Leaders mapped</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">ACLs Verified</div>
          <div className="data-card-value">{acls.length}</div>
          <div className="data-card-note">Assistant Leaders present</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Code Status</div>
          <div className="data-card-value status-good">LOCKED</div>
          <div className="data-card-note">Immutable fest UID token</div>
        </div>
      </div>

      {/* Code Allocation Form */}
      <div className="workspace-panel">
        <h2>Allocate Contingent Code (CL Meet)</h2>
        <p style={{ marginBottom: "16px" }}>
          Assign the official 2-letter/number contingent code won during the CL/ACL Meet live bidding session.
        </p>

        {message && (
          <div style={{ padding: "10px 14px", marginBottom: "16px", borderRadius: "2px", background: "rgba(216,255,46,.1)", border: "1px solid var(--acid)", color: "var(--acid)", fontSize: "13px" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", alignItems: "end" }}>
          <div>
            <label className="workspace-label">Contingent Code (e.g. CC-05)</label>
            <input 
              className="workspace-input" 
              placeholder="CC-05" 
              value={newCode} 
              onChange={e => setNewCode(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="workspace-label">Team / Contingent Name</label>
            <input 
              className="workspace-input" 
              placeholder="Mithibai Mavericks" 
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="workspace-label">College / Institution</label>
            <input 
              className="workspace-input" 
              placeholder="Mithibai College, Vile Parle" 
              value={newCollege} 
              onChange={e => setNewCollege(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="workspace-label">Assign CL (Leader)</label>
            <select className="workspace-select" value={selectedCl} onChange={e => setSelectedCl(e.target.value)}>
              <option value="">-- Select Verified CL --</option>
              {cls.map(p => (
                <option key={p.id} value={p.id}>{p.fullName} ({p.illeniumId})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="workspace-label">Assign ACL (Assistant)</label>
            <select className="workspace-select" value={selectedAcl} onChange={e => setSelectedAcl(e.target.value)}>
              <option value="">-- Select Verified ACL --</option>
              {acls.map(p => (
                <option key={p.id} value={p.id}>{p.fullName} ({p.illeniumId})</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" className="button button-primary" style={{ width: "100%" }}>
              + Confirm &amp; Lock Code
            </button>
          </div>
        </form>
      </div>

      {/* Contingent Directory */}
      <div className="workspace-panel" style={{ padding: 0 }}>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(244,241,233,.1)", flexWrap: "wrap", gap: "10px" }}>
          <h2>Confirmed Contingents</h2>
          <input 
            className="workspace-input" 
            placeholder="Search code, college or team..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            style={{ maxWidth: 300 }} 
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Contingent</th>
                <th>College</th>
                <th>Contingent Leader</th>
                <th>ACL</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const cl = profiles.find(p => p.id === c.clProfileId);
                const acl = profiles.find(p => p.id === c.aclProfileId);
                return (
                  <tr key={c.id}>
                    <td>
                      <span className="tag" style={{ background: "rgba(216,255,46,.1)", borderColor: "var(--acid)", color: "var(--acid)", fontWeight: "bold" }}>
                        {c.code}
                      </span>
                    </td>
                    <td>
                      <b>{c.name}</b>
                      <i>UID: {c.id}</i>
                    </td>
                    <td>{c.collegeName}</td>
                    <td>
                      {cl ? (
                        <>
                          <b>{cl.fullName}</b>
                          <i>{cl.illeniumId}</i>
                        </>
                      ) : (
                        <span style={{ color: "var(--dim)" }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      {acl ? (
                        <>
                          <b>{acl.fullName}</b>
                          <i>{acl.illeniumId}</i>
                        </>
                      ) : (
                        <span style={{ color: "var(--dim)" }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className="status-pill status-success">Allotted &amp; Locked</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </RoleShell>
  );
}
