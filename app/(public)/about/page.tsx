import Link from "next/link";
import { UnifiedHeader } from "@/components/layout/unified-header";
import { Sparkles, MapPin, Calendar, Mail, Shield, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--bone)", display: "flex", flexDirection: "column" }}>
      <UnifiedHeader />

      <main style={{ flex: 1, maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem 6rem", width: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            background: "rgba(255, 35, 143, 0.15)",
            border: "1px solid rgba(255, 35, 143, 0.15)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#ff238f",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "1rem"
          }}
        >
          <Sparkles size={13} />
          About ILLENIUM™ 2026
        </div>

        <h1 style={{ fontSize: "clamp(2.75rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>
          A festival <span style={{ color: "#ff238f" }}>with a pulse.</span>
        </h1>

        <p style={{ marginTop: "1rem", fontSize: "1.15rem", color: "var(--bone-dim)", lineHeight: 1.7, maxWidth: "760px" }}>
          ILLENIUM™ is one of the only intercollegiate cultural fests in India whose legacy is trademarked.
          Film, music, and creative industry leaders have opened and closed it, with scoring judged by active professionals in their respective disciplines.
        </p>

        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginTop: "3rem"
          }}
        >
          <div className="card" style={{ padding: "1.75rem", background: "var(--bg-surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ff238f", marginBottom: "0.75rem" }}>
              <MapPin size={18} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--bone)" }}>Where</h3>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--bone-dim)", lineHeight: 1.6, margin: 0 }}>
              Atlas SkillTech University<br />
              Equinox Business Park, Ambedkar Nagar<br />
              Kurla West, Mumbai 400070<br />
              <span style={{ color: "#ff238f", fontSize: "0.8rem", fontWeight: 600 }}>Nearest Station: Kurla</span>
            </p>
          </div>

          <div className="card" style={{ padding: "1.75rem", background: "var(--bg-surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ff238f", marginBottom: "0.75rem" }}>
              <Calendar size={18} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--bone)" }}>When</h3>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--bone-dim)", lineHeight: 1.6, margin: 0 }}>
              Saturday 28 November 2026<br />
              Sunday 29 November 2026<br />
              Contingent leaders&apos; briefing meet precedes the festival kickoff.
            </p>
          </div>

          <div className="card" style={{ padding: "1.75rem", background: "var(--bg-surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ff238f", marginBottom: "0.75rem" }}>
              <Mail size={18} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--bone)" }}>Official Outreach</h3>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--bone-dim)", lineHeight: 1.6, margin: 0 }}>
              <a href="mailto:events.illenium@atlasskilltech.university" style={{ color: "var(--bone)", textDecoration: "underline" }}>
                events.illenium@atlasskilltech.university
              </a><br />
              Managed by the 300-student Executive Committee across 14 specialized departments.
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div style={{ marginTop: "3.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/register?mode=join" className="btn btn-primary btn-md">
            <span>Join Your College Contingency</span>
            <ArrowRight size={15} />
          </Link>
          <Link href="/events" className="btn btn-secondary btn-md">
            <span>Browse 22 Festival Events</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
