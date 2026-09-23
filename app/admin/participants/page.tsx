"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile } from "@/services/master-store";

export default function ParticipantsPage() {
  const [search, setSearch] = useState("");
  const [list, setList] = useState<Profile[]>([]);

  useEffect(() => {
    setList(masterStore.getProfiles());
  }, []);

  const filtered = list.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.fullName.toLowerCase().includes(q) ||
      p.illeniumId.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.collegeName.toLowerCase().includes(q)
    );
  });

  function statusClass(s: string) {
    if (s === "verified") return "status-success";
    if (s === "rejected") return "status-danger";
    return "status-warning";
  }

  return (
    <RoleShell role="admin">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">People</div>
          <h1>Participant directory</h1>
          <p className="workspace-subtitle">
            A live view of registration, identity review, and issued access credentials.
          </p>
        </div>
      </div>

      <div className="workspace-panel" style={{ padding: "16px 20px", marginBottom: "12px" }}>
        <input
          className="workspace-input"
          placeholder="Search by name, ILLENIUM ID, email or college…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="workspace-panel" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>ILLENIUM ID</th>
                <th>College</th>
                <th>Role</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <b>{row.fullName}</b>
                    <i>{row.email}</i>
                  </td>
                  <td>
                    <b>{row.illeniumId}</b>
                  </td>
                  <td>{row.collegeName}</td>
                  <td style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.08em", color: "var(--dim)" }}>
                    {row.role}
                  </td>
                  <td>
                    <span className={`status-pill ${statusClass(row.verificationStatus)}`}>
                      {row.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="workspace-subtitle" style={{ padding: "20px 24px" }}>
              {search ? `No results for "${search}".` : "No participant records yet."}
            </p>
          )}
        </div>
      </div>
    </RoleShell>
  );
}
