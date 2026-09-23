"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, Profile, EventRecord } from "@/services/master-store";
import {
  Sparkles,
  QrCode,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  Award,
  Layers,
  UserCheck
} from "lucide-react";

export default function ParticipantDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [checkIns, setCheckIns] = useState(0);

  useEffect(() => {
    // In demo mode, surface the CL profile as "current user"
    const p = masterStore.getProfileById("p-cl-parth");
    setProfile(p || null);
    setEvents(masterStore.getEvents().slice(0, 5));
    setCheckIns(masterStore.getCheckIns().length);
  }, []);

  return (
    <RoleShell role="participant">
      {/* Top Header Banner */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            background: "rgba(255, 35, 143, 0.12)",
            border: "1px solid rgba(255, 35, 143, 0.35)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#ff238f",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "0.75rem"
          }}
        >
          <Sparkles size={13} />
          Participant Passport &middot; ILLENIUM™ 2026
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#f2f0e9" }}>
              Your festival, <span style={{ color: "#ff238f" }}>organised.</span>
            </h1>
            <p style={{ marginTop: "0.4rem", color: "var(--bone-dim)", fontSize: "0.95rem" }}>
              {profile
                ? `Welcome back, ${profile.fullName.split(" ")[0]}. Everything you need for your events and digital pass lives here.`
                : "Complete your registration to unlock your participant passport."}
            </p>
          </div>

          <Link
            href="/participant/id"
            className="btn"
            style={{
              background: "linear-gradient(135deg, #ff238f 0%, #ff529a 100%)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "0.875rem",
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              boxShadow: "0 0 20px rgba(255, 35, 143, 0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <QrCode size={16} />
            <span>Open Digital ID Pass</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Hero Passport Identity Card */}
      <section
        className="card"
        style={{
          padding: "2rem",
          borderRadius: "14px",
          background: "linear-gradient(135deg, rgba(255, 35, 143, 0.08) 0%, rgba(13, 12, 17, 0.95) 100%)",
          border: "1px solid rgba(255, 35, 143, 0.3)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.7)",
          marginBottom: "2rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span className="mono" style={{ fontSize: "0.75rem", color: "#ff238f", fontWeight: 700, letterSpacing: "0.08em" }}>
                ILLENIUM™ / 2026 OFFICIAL PASSPORT
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  background: "rgba(216, 255, 46, 0.15)",
                  color: "var(--acid)",
                  border: "1px solid rgba(216, 255, 46, 0.3)"
                }}
              >
                VERIFIED ACTIVE
              </span>
            </div>

            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#f2f0e9" }}>
              {profile?.collegeName ?? "Atlas SkillTech University"}
            </h2>
            <p style={{ margin: "0.4rem 0 0", color: "var(--bone-dim)", fontSize: "0.9rem", maxWidth: "600px" }}>
              Your college affiliation, registered events, and checkpoint access credentials are synchronised with your master barcode.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/participant/id"
              className="btn btn-primary btn-sm"
              style={{ background: "#ff238f", borderColor: "#ff238f", color: "#ffffff", fontWeight: 800 }}
            >
              <QrCode size={14} />
              <span>View QR Pass</span>
            </Link>
            <Link
              href="/events"
              className="btn btn-secondary btn-sm"
              style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}
            >
              <span>Browse Programme</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Stat Metric Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem"
        }}
      >
        <div className="card" style={{ padding: "1.25rem 1.5rem", background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--dim)", fontWeight: 600 }}>
            ILLENIUM ID
          </div>
          <div className="mono" style={{ fontSize: "1.35rem", fontWeight: 700, color: "#ff238f", marginTop: "0.35rem" }}>
            {profile?.illeniumId ?? "ILL-26-000001"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
            Issued upon credential approval
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem 1.5rem", background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--dim)", fontWeight: 600 }}>
            Access Level / Role
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#f2f0e9", marginTop: "0.35rem", textTransform: "uppercase" }}>
            {profile?.role === "cl" ? "Contingent Leader (CL)" : profile?.role ?? "Participant"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
            Authorised all-access pass
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem 1.5rem", background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--dim)", fontWeight: 600 }}>
            Identity Verification
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.35rem" }}>
            <CheckCircle2 size={18} style={{ color: "var(--acid)" }} />
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--acid)", textTransform: "capitalize" }}>
              {profile?.verificationStatus ?? "Verified"}
            </span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
            Student ID &amp; Photo ID cleared
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem 1.5rem", background: "var(--bg-surface)", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--dim)", fontWeight: 600 }}>
            Scanned Check-ins
          </div>
          <div className="mono" style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--cyan)", marginTop: "0.35rem" }}>
            {checkIns} Check-in{checkIns === 1 ? "" : "s"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
            Campus entrance &amp; arena gates
          </div>
        </div>
      </div>

      {/* Programme & Registered Events */}
      <section
        className="card"
        style={{
          padding: "1.75rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--line)",
          marginBottom: "2rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "#f2f0e9" }}>
              Festival Programme &middot; Open Events
            </h2>
            <p style={{ margin: "0.25rem 0 0", color: "var(--bone-dim)", fontSize: "0.85rem" }}>
              Official registered competitions and schedule status.
            </p>
          </div>
          <Link href="/events" className="btn btn-secondary btn-sm" style={{ gap: "0.4rem" }}>
            <span>View All 22 Events</span>
            <ExternalLink size={13} />
          </Link>
        </div>

        {events.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "680px", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line-strong)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 1rem", color: "#ff238f" }}>EVENT</th>
                  <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>CATEGORY</th>
                  <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>VENUE</th>
                  <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>REPORTING TIME</th>
                  <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "1rem" }}>
                      <strong style={{ color: "#f2f0e9", display: "block", fontSize: "0.95rem" }}>{ev.name}</strong>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>{ev.category}</span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--bone-dim)" }}>
                        <MapPin size={13} />
                        <span>{ev.venue}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--bone-dim)" }}>
                        <Clock size={13} />
                        <span>
                          {new Date(ev.reportingTime).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        className="badge"
                        style={{
                          background: "rgba(216, 255, 46, 0.15)",
                          color: "var(--acid)",
                          border: "1px solid rgba(216, 255, 46, 0.3)",
                          fontSize: "0.7rem",
                          textTransform: "uppercase"
                        }}
                      >
                        {ev.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "2rem 0", textAlign: "center" }}>
            <p style={{ color: "var(--bone-dim)", fontSize: "0.9rem" }}>No events registered yet. Explore the programme to add competitions.</p>
            <Link href="/events" className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }}>
              Explore Events
            </Link>
          </div>
        )}
      </section>

      {/* Protocol & Gate Checkpoints */}
      <section
        className="card"
        style={{
          padding: "1.75rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--line)"
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 1rem", color: "#f2f0e9" }}>
          Festival Protocols &middot; Essential Notes
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)" }}>
            <strong style={{ color: "#ff238f", display: "block", marginBottom: "0.25rem" }}>01. At Main Campus Gate</strong>
            <p style={{ margin: 0, color: "var(--bone-dim)", fontSize: "0.825rem", lineHeight: 1.5 }}>
              Open your Digital ID pass. Turn screen brightness up. Physical college ID card must accompany the digital QR token.
            </p>
          </div>
          <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)" }}>
            <strong style={{ color: "var(--acid)", display: "block", marginBottom: "0.25rem" }}>02. Event Reporting Windows</strong>
            <p style={{ margin: 0, color: "var(--bone-dim)", fontSize: "0.825rem", lineHeight: 1.5 }}>
              Check reporting times in the timetable. Teams arriving after initial roll-call scan will forfeit performance priority slot.
            </p>
          </div>
          <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)" }}>
            <strong style={{ color: "var(--cyan)", display: "block", marginBottom: "0.25rem" }}>03. Operations &amp; Support</strong>
            <p style={{ margin: 0, color: "var(--bone-dim)", fontSize: "0.825rem", lineHeight: 1.5 }}>
              Need urgent help? Locate the Central OC Desk at Atrium Ground or contact events.illenium@atlasskilltech.university.
            </p>
          </div>
        </div>
      </section>
    </RoleShell>
  );
}
