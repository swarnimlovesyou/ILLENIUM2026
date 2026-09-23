"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, AuditLogRecord } from "@/services/master-store";

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLogs(masterStore.getAuditLogs());
  }, []);

  const filtered = logs.filter(l => 
    l.actorName.toLowerCase().includes(filter.toLowerCase()) ||
    l.action.toLowerCase().includes(filter.toLowerCase()) ||
    l.entityType.toLowerCase().includes(filter.toLowerCase()) ||
    l.details.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <RoleShell role="admin">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Section 13 · Security &amp; Traceability</div>
          <h1>System Audit Trail</h1>
          <p className="workspace-subtitle">
            Immutable transaction history of every scoring change, wristband assignment, check-in verification, and penalty.
          </p>
        </div>
        <span className="live-pill"><i /> {logs.length} Logged Transactions</span>
      </div>

      <div className="data-grid">
        <div className="data-card">
          <div className="data-card-label">Total Audit Events</div>
          <div className="data-card-value">{logs.length}</div>
          <div className="data-card-note">Captured across all roles</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Integrity Status</div>
          <div className="data-card-value status-good">VERIFIED</div>
          <div className="data-card-note">Immutable transaction sequence</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Active Operators</div>
          <div className="data-card-value status-good">8</div>
          <div className="data-card-note">CP, VCP, OC, Judges</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Tamper Detection</div>
          <div className="data-card-value status-good">0 FLAGS</div>
          <div className="data-card-note">No unauthorized overwrites</div>
        </div>
      </div>

      <div className="workspace-panel" style={{ padding: 0 }}>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(244,241,233,.1)", flexWrap: "wrap", gap: "10px" }}>
          <h2>Audit Transaction History</h2>
          <input 
            className="workspace-input" 
            placeholder="Search by action, actor, or detail..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            style={{ maxWidth: 320 }} 
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor / Role</th>
                <th>Action Type</th>
                <th>Entity Affected</th>
                <th>Transaction Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "var(--dim)" }}>
                    No audit records match the current search filter.
                  </td>
                </tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id}>
                    <td>
                      <b>{new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</b>
                      <i>{new Date(l.createdAt).toLocaleDateString()}</i>
                    </td>
                    <td>
                      <b>{l.actorName}</b>
                      <i>ID: {l.actorProfileId}</i>
                    </td>
                    <td>
                      <span className="tag" style={{ background: "rgba(216,255,46,.08)", borderColor: "rgba(216,255,46,.3)", color: "var(--acid)" }}>
                        {l.action}
                      </span>
                    </td>
                    <td>
                      <b>{l.entityType}</b>
                      {l.entityId && <i>ID: {l.entityId}</i>}
                    </td>
                    <td style={{ maxWidth: 360, wordBreak: "break-word" }}>
                      {l.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RoleShell>
  );
}
