"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile } from "@/services/master-store";
import {
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Building2,
  User,
  Info
} from "lucide-react";

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

  const isVerified = profile?.verificationStatus === "verified";

  return (
    <RoleShell role="participant">
      {/* Top Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Link href="/participant/dashboard" style={{ color: "var(--bone-dim)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem" }}>
            <ArrowLeft size={13} />
            <span>Dashboard</span>
          </Link>
          <span style={{ color: "var(--dim)" }}>/</span>
          <span style={{ color: "#ff238f", fontSize: "0.8rem", fontWeight: 600 }}>Digital ID</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#f2f0e9" }}>
              Digital ID <span style={{ color: "#ff238f" }}>Passport</span>
            </h1>
            <p style={{ marginTop: "0.25rem", color: "var(--bone-dim)", fontSize: "0.9rem" }}>
              Keep this cryptographic QR pass active at campus entry checkpoints and arena stations.
            </p>
          </div>

          <div
            style={{
              padding: "0.4rem 0.9rem",
              borderRadius: "999px",
              background: isVerified ? "rgba(255, 35, 143, 0.15)" : "rgba(255, 123, 0, 0.12)",
              border: `1px solid ${isVerified ? "rgba(255, 35, 143, 0.45)" : "rgba(255, 123, 0, 0.35)"}`,
              color: isVerified ? "#ff238f" : "#ff7b00",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <ShieldCheck size={14} />
            <span>{isVerified ? "IDENTITY VERIFIED" : "VERIFICATION PENDING"}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "1.5rem", alignItems: "start" }}>
        {/* Physical ID Pass Simulation */}
        <div
          className="card"
          style={{
            padding: "2rem",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(255, 35, 143, 0.12) 0%, rgba(13, 12, 17, 0.98) 100%)",
            border: "1px solid rgba(255, 35, 143, 0.4)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 35, 143, 0.15)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Card Top Meta */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 35, 143, 0.25)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "#ff238f",
                  color: "#07070a",
                  fontWeight: 900,
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                IL
              </div>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.04em", color: "#f2f0e9" }}>ILLENIUM™ 2026</span>
            </div>
            <span className="mono" style={{ fontSize: "0.75rem", color: "#ff238f", fontWeight: 700 }}>
              ALL-ACCESS PASS
            </span>
          </div>

          {/* User Profile Details */}
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ff238f 0%, #ff529a 100%)",
                color: "#07070a",
                fontSize: "24px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {profile?.fullName?.charAt(0) ?? "P"}
            </div>

            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "#f2f0e9", letterSpacing: "-0.01em" }}>
                {profile?.fullName ?? "Parth Parmar"}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--bone-dim)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                <Building2 size={13} style={{ color: "#ff238f" }} />
                <span>{profile?.collegeName ?? "Atlas SkillTech University"}</span>
              </div>
              <div className="mono" style={{ fontSize: "0.85rem", color: "#ff238f", fontWeight: 700, marginTop: "0.25rem" }}>
                ID: {profile?.illeniumId ?? "ILL-26-000001"}
              </div>
            </div>
          </div>

          {/* Meta Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              background: "rgba(0,0,0,0.35)",
              padding: "0.85rem 1rem",
              borderRadius: "8px",
              border: "1px solid var(--line)",
              marginBottom: "1.5rem"
            }}
          >
            <div>
              <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--dim)", fontWeight: 700 }}>ROLE / LEVEL</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f2f0e9", textTransform: "uppercase" }}>
                {profile?.role === "cl" ? "Contingent Leader" : profile?.role ?? "Participant"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--dim)", fontWeight: 700 }}>QR CRYPTO STATUS</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: qrData ? "#ff238f" : "var(--bone-dim)" }}>
                {qrData ? "Valid & Active" : "Issued after approval"}
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div
            style={{
              background: "#ffffff",
              padding: "1rem",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
            }}
          >
            {qrData ? (
              <img
                src={qrData}
                alt="Secure ILLENIUM QR"
                style={{ width: "100%", maxWidth: "220px", display: "block" }}
              />
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", color: "#333333", fontSize: "0.8rem", fontWeight: 600 }}>
                Unique QR appears upon server identity verification.
              </div>
            )}
            <div className="mono" style={{ fontSize: "0.7rem", color: "#111111", fontWeight: 700, marginTop: "0.4rem", letterSpacing: "0.06em" }}>
              {profile?.illeniumId ?? "ILL-26-000001"} &middot; NON-TRANSFERABLE
            </div>
          </div>
        </div>

        {/* Checkpoint Guidelines Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="card" style={{ padding: "1.75rem", background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ff238f", marginBottom: "0.75rem" }}>
              <Info size={16} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#f2f0e9" }}>One Pass, Every Checkpoint</h3>
            </div>
            <p style={{ color: "var(--bone-dim)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
              Show this cryptographic QR pass at campus entry, then again at the scanning desk for each registered competition.
              Each scan verifies server-side cryptographic tokens preventing duplicate or screenshot reuse.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span className="mono" style={{ color: "#ff238f", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1 }}>01</span>
                <div>
                  <strong style={{ color: "#f2f0e9", fontSize: "0.9rem" }}>Main Campus Gate Entry</strong>
                  <p style={{ margin: "0.2rem 0 0", color: "var(--bone-dim)", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    Present this pass alongside your physical college ID card to the OC Entry Scanner.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span className="mono" style={{ color: "#ff238f", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1 }}>02</span>
                <div>
                  <strong style={{ color: "#f2f0e9", fontSize: "0.9rem" }}>Competition Arena Check-in</strong>
                  <p style={{ margin: "0.2rem 0 0", color: "var(--bone-dim)", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    Scan your pass with the Event Head at least 20 minutes before your scheduled performance.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span className="mono" style={{ color: "#f5f3ed", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1 }}>03</span>
                <div>
                  <strong style={{ color: "#f2f0e9", fontSize: "0.9rem" }}>Live Results &amp; Trophy Points</strong>
                  <p style={{ margin: "0.2rem 0 0", color: "var(--bone-dim)", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    Scores from verified events are attributed in real-time to your college championship tally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
