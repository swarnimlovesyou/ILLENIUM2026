"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  QrCode,
  Gavel,
  Trophy,
  Users,
  Compass,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  ChevronDown,
  X,
  Activity,
  Ticket,
  Search,
  ExternalLink,
  ClipboardList
} from "lucide-react";

interface PortalItem {
  name: string;
  category: "Public" | "Operations" | "Scoring" | "Leadership";
  href: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  accent?: "acid" | "crimson" | "gold" | "cyan";
}

const PORTALS: PortalItem[] = [
  {
    name: "Public Experience",
    category: "Public",
    href: "/",
    description: "Festival schedule, stage line-up, and general attendee information.",
    icon: Compass,
    accent: "acid"
  },
  {
    name: "Event Schedule",
    category: "Public",
    href: "/events",
    description: "Full vertical-by-vertical schedule and rules guidebook.",
    icon: Sparkles,
    accent: "acid"
  },
  {
    name: "Accreditation & Wristbands",
    category: "Operations",
    href: "/admin/verification",
    description: "Desk check-in, identity review, Day 1/Day 2 RFID wristband binding.",
    icon: Ticket,
    badge: "Desk",
    accent: "acid"
  },
  {
    name: "OC Gate & Entry Scanner",
    category: "Operations",
    href: "/oc/scanner",
    description: "High-speed camera scanner for gate access, meals, and event entry.",
    icon: QrCode,
    badge: "Mobile",
    accent: "cyan"
  },
  {
    name: "CL/ACL Meet & Allocations",
    category: "Leadership",
    href: "/admin/contingents",
    description: "Contingent code bidding, college leader desk, and slot assignments.",
    icon: Users,
    badge: "Leaders",
    accent: "gold"
  },
  {
    name: "Judge Scoring Console",
    category: "Scoring",
    href: "/judge",
    description: "Criterion-level evaluation, raw score entry, and sealed submission.",
    icon: Gavel,
    badge: "Judges",
    accent: "crimson"
  },
  {
    name: "Participant Bidding & ID",
    category: "Leadership",
    href: "/participant/bidding",
    description: "Digital identity card and contingent rank prediction bidding.",
    icon: FileCheck2,
    accent: "acid"
  },
  {
    name: "Master Scoring Engine",
    category: "Scoring",
    href: "/admin/scoring",
    description: "Formula scaling, bidding resolution (+X/0/-X), and official seal.",
    icon: Shield,
    badge: "Admin",
    accent: "crimson"
  },
  {
    name: "Official Leaderboard",
    category: "Scoring",
    href: "/leaderboard",
    description: "Live aggregated contingent points, podium standings, and event logs.",
    icon: Trophy,
    badge: "Live",
    accent: "gold"
  },
  {
    name: "Audit Trail",
    category: "Operations",
    href: "/admin/audit",
    description: "Immutable compliance log for all score modifications & wristband replacements.",
    icon: ClipboardList,
    badge: "Security",
    accent: "cyan"
  }
];

export function UnifiedHeader() {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close palette on route change or ESC
  useEffect(() => {
    setPaletteOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredPortals = PORTALS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 800,
          background: "rgba(9, 8, 14, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--line)",
          padding: "0.75rem 1.5rem"
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem"
          }}
        >
          {/* Left: Brand & Status */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                textDecoration: "none"
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "var(--acid)",
                  color: "var(--ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "14px",
                  fontFamily: "var(--font-display)"
                }}
              >
                IL
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  letterSpacing: "-0.02em",
                  color: "var(--bone)"
                }}
              >
                ILLENIUM <span style={{ color: "var(--acid)" }}>2026</span>
              </span>
            </Link>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "rgba(216, 255, 46, 0.08)",
                border: "1px solid rgba(216, 255, 46, 0.2)",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--acid)",
                letterSpacing: "0.04em",
                textTransform: "uppercase"
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--acid)",
                  boxShadow: "0 0 8px var(--acid)"
                }}
                className="animate-pulse-glow"
              />
              Live Ops
            </div>
          </div>

          {/* Center: High-Frequency Links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}
          >
            <Link
              href="/events"
              className={`btn btn-sm ${pathname === "/events" ? "btn-secondary" : "btn-ghost"}`}
              style={{ fontWeight: 500 }}
            >
              Events
            </Link>
            <Link
              href="/leaderboard"
              className={`btn btn-sm ${pathname === "/leaderboard" ? "btn-secondary" : "btn-ghost"}`}
              style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Trophy size={14} style={{ color: "var(--gold)" }} />
              Leaderboard
            </Link>
            <Link
              href="/admin/scoring"
              className={`btn btn-sm ${pathname.startsWith("/admin/scoring") ? "btn-secondary" : "btn-ghost"}`}
              style={{ fontWeight: 500 }}
            >
              Scoring
            </Link>
            <Link
              href="/oc/scanner"
              className={`btn btn-sm ${pathname.startsWith("/oc/scanner") ? "btn-secondary" : "btn-ghost"}`}
              style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <QrCode size={14} style={{ color: "var(--cyan)" }} />
              Scanner
            </Link>
          </nav>

          {/* Right: Master Portal & Role Command Palette Trigger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={() => setPaletteOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.45rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                borderColor: "rgba(216, 255, 46, 0.25)",
                background: "rgba(24, 22, 34, 0.9)"
              }}
            >
              <Layers size={14} style={{ color: "var(--acid)" }} />
              <span style={{ fontWeight: 600 }}>Portals & Roles</span>
              <kbd
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  padding: "0.1rem 0.35rem",
                  borderRadius: "3px",
                  fontSize: "0.65rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--bone-dim)",
                  border: "1px solid var(--line)"
                }}
              >
                Ctrl+K
              </kbd>
            </button>

            <Link href="/auth/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Interactive Command Hub & Portal Switcher Modal */}
      {paletteOpen && (
        <div
          className="scrim active"
          onClick={() => setPaletteOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "760px",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--line-strong)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
              animation: "fadeIn 0.15s ease"
            }}
          >
            {/* Modal Header & Search */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "var(--bg-surface)"
              }}
            >
              <Search size={18} style={{ color: "var(--acid)" }} />
              <input
                type="text"
                autoFocus
                placeholder="Search operational portals, role desks, tools (e.g. Judge, Scanner, Bidding, Accreditation)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--bone)",
                  fontSize: "1rem",
                  fontFamily: "var(--font-sans)"
                }}
              />
              <button
                onClick={() => setPaletteOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: "0.25rem", color: "var(--bone-dim)" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Portal Directory Grid */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                maxHeight: "65vh",
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "0.75rem"
              }}
            >
              {filteredPortals.map((portal) => {
                const IconComponent = portal.icon;
                const isCurrent = pathname === portal.href || pathname.startsWith(portal.href + "/");

                return (
                  <Link
                    key={portal.href}
                    href={portal.href}
                    onClick={() => setPaletteOpen(false)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.35rem",
                      padding: "1rem",
                      borderRadius: "var(--radius-md)",
                      background: isCurrent ? "rgba(216, 255, 46, 0.06)" : "var(--bg-card)",
                      border: isCurrent
                        ? "1px solid rgba(216, 255, 46, 0.4)"
                        : "1px solid var(--line)",
                      textDecoration: "none",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--line-strong)";
                      e.currentTarget.style.background = "var(--bg-surface-highlight)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isCurrent
                        ? "rgba(216, 255, 46, 0.4)"
                        : "var(--line)";
                      e.currentTarget.style.background = isCurrent
                        ? "rgba(216, 255, 46, 0.06)"
                        : "var(--bg-card)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            padding: "0.4rem",
                            borderRadius: "6px",
                            background: "rgba(255, 255, 255, 0.05)",
                            color: portal.accent === "acid" ? "var(--acid)" : portal.accent === "crimson" ? "var(--mag)" : portal.accent === "gold" ? "var(--gold)" : "var(--cyan)"
                          }}
                        >
                          <IconComponent size={16} />
                        </div>
                        <span style={{ fontWeight: 600, color: "var(--bone)", fontSize: "0.95rem" }}>
                          {portal.name}
                        </span>
                      </div>
                      {portal.badge && (
                        <span
                          className={`badge ${
                            portal.badge === "Desk" || portal.badge === "Live"
                              ? "badge-acid"
                              : portal.badge === "Judges" || portal.badge === "Admin"
                              ? "badge-crimson"
                              : "badge-neutral"
                          }`}
                          style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}
                        >
                          {portal.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.775rem", color: "var(--bone-dim)", margin: 0 }}>
                      {portal.description}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "0.75rem 1.5rem",
                background: "var(--bg-surface)",
                borderTop: "1px solid var(--line)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "var(--dim)"
              }}
            >
              <span>ILLENIUM 2026 Operations Console</span>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
