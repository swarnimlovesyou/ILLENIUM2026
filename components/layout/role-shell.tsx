"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Flame,
  CreditCard,
  Trophy,
  QrCode,
  CheckCircle2,
  Gavel,
  Users,
  Shield,
  ClipboardList,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Layers,
  Sparkles,
  Ticket
} from "lucide-react";
import { UnifiedHeader } from "./unified-header";

type Role = "participant" | "oc" | "admin" | "judge";

const configs = {
  participant: {
    label: "Participant Desk",
    title: "Passport & Predictions",
    nav: [
      { href: "/participant/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/events", label: "Programme", icon: Calendar },
      { href: "/participant/bidding", label: "Event Bidding", icon: Flame },
      { href: "/participant/id", label: "Digital Pass", icon: CreditCard },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy }
    ]
  },
  oc: {
    label: "Field Operations",
    title: "Gate & Check-in Control",
    nav: [
      { href: "/oc/dashboard", label: "Shift Summary", icon: LayoutDashboard },
      { href: "/oc/scanner", label: "Gate Scanner", icon: QrCode },
      { href: "/oc/check-ins", label: "Check-in Logs", icon: CheckCircle2 },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy }
    ]
  },
  judge: {
    label: "Judge Console",
    title: "Authenticated Scoring",
    nav: [
      { href: "/judge", label: "Score Evaluation", icon: Gavel },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy }
    ]
  },
  admin: {
    label: "Festival Command Center",
    title: "Operations Console",
    nav: [
      { href: "/admin/dashboard", label: "Command Overview", icon: LayoutDashboard },
      { href: "/admin/contingents", label: "Contingents (CL/ACL)", icon: Users },
      { href: "/admin/verification", label: "Accreditation & Wristbands", icon: Ticket },
      { href: "/admin/participants", label: "Participants", icon: Users },
      { href: "/admin/events", label: "Events Master", icon: Sparkles },
      { href: "/admin/scoring", label: "Scoring & Bids", icon: Shield },
      { href: "/admin/audit", label: "Audit Trail", icon: ClipboardList },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy }
    ]
  }
} as const;

export function RoleShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const config = configs[role];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function signOut() {
    try {
      await createClient().auth.signOut();
    } catch {
      /* ignore */
    }
    window.location.href = "/auth/login";
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
      {/* Top Universal Header */}
      <UnifiedHeader />

      {/* Mobile Role Sub-header (only visible on mobile screens) */}
      <div
        className="role-shell-mobile-top"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.6rem 1rem",
          background: "rgba(14, 13, 20, 0.96)",
          borderBottom: "1px solid var(--line)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: "53px",
          zIndex: 700
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ff238f",
              boxShadow: "0 0 8px #ff238f"
            }}
          />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--bone)" }}>
            {config.label}
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--bone-dim)" }}>
            &middot; {config.title}
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="btn btn-secondary btn-sm"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.35rem 0.65rem",
            fontSize: "0.75rem"
          }}
          aria-label="Open mobile desk navigation"
        >
          <Menu size={14} style={{ color: "#ff238f" }} />
          <span>All Pages</span>
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Desktop Sidebar (hidden on mobile via CSS) */}
        <aside
          className="role-shell-sidebar"
          style={{
            width: "260px",
            background: "var(--bg-surface)",
            borderRight: "1px solid var(--line)",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "1.5rem 1rem",
            flexShrink: 0
          }}
        >
          <div>
            {/* Context Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--line)",
                marginBottom: "1.5rem"
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ff238f",
                  boxShadow: "0 0 8px #ff238f"
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--bone)" }}>
                  {config.label}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--bone-dim)" }}>
                  {config.title}
                </span>
              </div>
            </div>

            {/* Navigation items */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {config.nav.map((item) => {
                const IconComponent = item.icon;
                const isSelected = pathname === item.href || (item.href !== "/leaderboard" && item.href !== "/events" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.875rem",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "var(--bone)" : "var(--bone-dim)",
                      background: isSelected ? "var(--bg-surface-elevated)" : "transparent",
                      border: isSelected ? "1px solid var(--line-strong)" : "1px solid transparent",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <IconComponent
                      size={16}
                      style={{
                        color: isSelected ? "#ff238f" : "var(--bone-dim)"
                      }}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom Controls */}
          <div
            style={{
              paddingTop: "1rem",
              borderTop: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem"
            }}
          >
            <Link
              href="/"
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: "flex-start", gap: "0.6rem" }}
            >
              <ExternalLink size={14} />
              <span>Public Landing</span>
            </Link>
            <button
              onClick={signOut}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: "flex-start", gap: "0.6rem", color: "#ff238f" }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Viewport */}
        <main
          className="role-shell-main"
          style={{
            flex: 1,
            padding: "2rem",
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
            overflowX: "hidden"
          }}
        >
          {children}
        </main>
      </div>

      {/* Mobile Slide-over Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="scrim active"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 900,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "flex-start"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(320px, 85vw)",
              height: "100%",
              background: "var(--bg-surface)",
              borderRight: "1px solid var(--line-strong)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "1.5rem 1.25rem",
              animation: "fadeIn 0.2s ease"
            }}
          >
            <div>
              {/* Drawer Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--line)"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--bone)" }}>
                    {config.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--bone-dim)" }}>
                    {config.title}
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: "0.3rem" }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {config.nav.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = pathname === item.href || (item.href !== "/leaderboard" && item.href !== "/events" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 0.9rem",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.9rem",
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? "var(--bone)" : "var(--bone-dim)",
                        background: isSelected ? "rgba(255, 35, 143, 0.15)" : "transparent",
                        border: isSelected ? "1px solid rgba(255, 35, 143, 0.3)" : "1px solid transparent"
                      }}
                    >
                      <IconComponent
                        size={17}
                        style={{
                          color: isSelected ? "#ff238f" : "var(--bone-dim)"
                        }}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Controls */}
            <div
              style={{
                paddingTop: "1rem",
                borderTop: "1px solid var(--line)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}
            >
              <Link
                href="/"
                className="btn btn-ghost btn-sm"
                onClick={() => setMobileMenuOpen(false)}
                style={{ justifyContent: "flex-start", gap: "0.6rem" }}
              >
                <ExternalLink size={15} />
                <span>Public Landing</span>
              </Link>
              <button
                onClick={signOut}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: "flex-start", gap: "0.6rem", color: "#ff238f" }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Dock (only visible on mobile screens) */}
      <nav
        className="role-shell-bottom-dock"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "rgba(12, 11, 18, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid var(--line)",
          zIndex: 750,
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 0.5rem"
        }}
      >
        {/* Render top 4 quick items from config.nav */}
        {config.nav.slice(0, 4).map((item) => {
          const IconComponent = item.icon;
          const isSelected = pathname === item.href || (item.href !== "/leaderboard" && item.href !== "/events" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.2rem",
                flex: 1,
                height: "100%",
                textDecoration: "none",
                color: isSelected ? "#ff238f" : "var(--bone-dim)",
                transition: "color 0.15s ease",
                position: "relative"
              }}
            >
              <IconComponent size={18} style={{ color: isSelected ? "#ff238f" : "var(--bone-dim)" }} />
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: isSelected ? 700 : 500,
                  letterSpacing: "-0.01em",
                  maxWidth: "65px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {item.label}
              </span>
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    width: "16px",
                    height: "2px",
                    background: "#ff238f",
                    borderRadius: "999px"
                  }}
                />
              )}
            </Link>
          );
        })}

        {/* 5th Button: More / Menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.2rem",
            flex: 1,
            height: "100%",
            background: "none",
            border: "none",
            color: mobileMenuOpen ? "#ff238f" : "var(--bone-dim)",
            cursor: "pointer"
          }}
          aria-label="Toggle full navigation drawer"
        >
          <Menu size={18} style={{ color: mobileMenuOpen ? "#ff238f" : "var(--bone-dim)" }} />
          <span style={{ fontSize: "0.65rem", fontWeight: 500 }}>More</span>
        </button>
      </nav>
    </div>
  );
}
