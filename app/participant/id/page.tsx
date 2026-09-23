"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile } from "@/services/master-store";

export default function DigitalIdPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const p = masterStore.getProfileById("p-cl-parth");
    setProfile(p || null);

    if (p && p.verificationStatus === "verified") {
      QRCode.toDataURL(p.illeniumId, { width: 420, margin: 1 })
        .then(setQrData)
        .catch(() => setQrData(""));
    }
  }, []);

  const status =
    profile?.verificationStatus === "verified"
      ? "Verified"
      : profile?.verificationStatus === "rejected"
      ? "Needs attention"
      : "Pending review";

  return (
    <RoleShell role="participant">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Your access credential</div>
          <h1>Digital ID</h1>
          <p className="workspace-subtitle">
            Keep this pass ready at campus entry and every registered event.
          </p>
        </div>
        <span
          className={`status-pill ${profile?.verificationStatus === "verified" ? "status-success" : "status-warning"}`}
        >
          {status}
        </span>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "20px", alignItems: "start" }}>
        {/* ID Card */}
        <div className="id-card">
          <div className="id-card-top">
            <span>ILLENIUM™ / 26</span>
            <span style={{ color: profile?.verificationStatus === "verified" ? "var(--acid)" : "#ff9f1c" }}>
              {status}
            </span>
          </div>

          <div className="id-card-person">
            <div className="id-avatar">
              {profile?.fullName?.charAt(0) ?? "?"}
            </div>
            <div>
              <h2 style={{ fontFamily: '"Anton", sans-serif', textTransform: "uppercase", fontSize: "clamp(18px, 3vw, 26px)", lineHeight: 1, letterSpacing: "0.02em", color: "var(--bone)", margin: 0 }}>
                {profile?.fullName ?? "Parth Parmar"}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--dim)", margin: "6px 0 2px" }}>
                {profile?.collegeName ?? "Atlas SkillTech University"}
              </p>
              <strong style={{ fontFamily: '"Anton", sans-serif', fontSize: "14px", letterSpacing: "0.08em", color: "var(--acid)" }}>
                {profile?.illeniumId ?? "ILL-26-000001"}
              </strong>
            </div>
          </div>

          <div className="id-card-bottom">
            <div>
              <small>ROLE</small>
              <span style={{ textTransform: "uppercase" }}>{profile?.role ?? "participant"}</span>
            </div>
            <div>
              <small>QR STATUS</small>
              <span>{qrData ? "Ready to scan" : "Issued after approval"}</span>
            </div>
          </div>

          {qrData ? (
            <img
              className="id-qr"
              src={qrData}
              alt="Secure ILLENIUM QR"
              style={{ display: "block", width: "100%", maxWidth: "240px", margin: "16px auto 0", borderRadius: "4px" }}
            />
          ) : (
            <div className="id-pending">
              Your unique QR appears after registration and identity review are approved.
            </div>
          )}
        </div>

        {/* Instructions panel */}
        <aside className="workspace-panel">
          <div className="workspace-kicker">How to use it</div>
          <h2>One pass, every checkpoint.</h2>
          <p className="workspace-subtitle">
            Show the QR at campus entry, then again at the check-in desk for each event you registered for. It is verified server-side and cannot be reused after a successful check-in.
          </p>
          <div className="id-detail-list">
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
              <span style={{ fontFamily: '"Anton", sans-serif', color: "var(--acid)", fontSize: "20px", flexShrink: 0 }}>01</span>
              <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--bone)" }}>Campus entry</strong><br />
                <span style={{ color: "var(--dim)" }}>Present your pass at the main gate.</span>
              </p>
            </div>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
              <span style={{ fontFamily: '"Anton", sans-serif', color: "var(--acid)", fontSize: "20px", flexShrink: 0 }}>02</span>
              <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--bone)" }}>Programme</strong><br />
                <span style={{ color: "var(--dim)" }}>Use your dashboard to see where and when to report.</span>
              </p>
            </div>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <span style={{ fontFamily: '"Anton", sans-serif', color: "var(--acid)", fontSize: "20px", flexShrink: 0 }}>03</span>
              <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--bone)" }}>Event check-in</strong><br />
                <span style={{ color: "var(--dim)" }}>A unique event record prevents duplicate entry.</span>
              </p>
            </div>
          </div>
        </aside>
      </section>
    </RoleShell>
  );
}
