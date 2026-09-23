"use client";

import { useEffect, useState, useTransition } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile } from "@/services/master-store";

export default function VerificationPage() {
  const [pending, setPending] = useState<Profile[]>([]);
  const [, startTransition] = useTransition();

  function load() {
    setPending(masterStore.getProfiles().filter((p) => p.verificationStatus === "pending"));
  }

  useEffect(() => { load(); }, []);

  function approve(profileId: string) {
    const profiles = masterStore.getProfiles();
    const p = profiles.find((p) => p.id === profileId);
    if (p) {
      p.verificationStatus = "verified";
      masterStore.logAudit("p-cp", "profile.verified", "profile", p.id, `Approved identity for ${p.fullName}`);
    }
    startTransition(() => load());
  }

  function reject(profileId: string) {
    const profiles = masterStore.getProfiles();
    const p = profiles.find((p) => p.id === profileId);
    if (p) {
      p.verificationStatus = "rejected";
      masterStore.logAudit("p-cp", "profile.rejected", "profile", p.id, `Rejected identity for ${p.fullName}`);
    }
    startTransition(() => load());
  }

  return (
    <RoleShell role="admin">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Review queue</div>
          <h1>Identity verification</h1>
          <p className="workspace-subtitle">
            Review submitted documents before an ILLENIUM ID and secure QR are issued.
          </p>
        </div>
        <span className="status-pill status-warning">{pending.length} awaiting review</span>
      </div>

      <div className="workspace-panel" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>College</th>
                <th>Roll number</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((row) => (
                <tr key={row.id}>
                  <td>
                    <b>{row.fullName}</b>
                    <i>{row.email}</i>
                  </td>
                  <td>{row.collegeName}</td>
                  <td>{row.collegeRollNumber ?? "—"}</td>
                  <td>{row.department ?? "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button className="button button-primary" style={{ minHeight: "32px", padding: "0 14px", fontSize: "12px" }} onClick={() => approve(row.id)}>
                        Approve &amp; issue ID
                      </button>
                      <button className="button button-danger" style={{ minHeight: "32px", padding: "0 14px", fontSize: "12px" }} onClick={() => reject(row.id)}>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!pending.length && (
            <p className="workspace-subtitle" style={{ padding: "20px 24px" }}>
              The queue is clear. All submitted identities have been reviewed.
            </p>
          )}
        </div>
      </div>
    </RoleShell>
  );
}
