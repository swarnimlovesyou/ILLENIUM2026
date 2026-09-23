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

      <div style={{ display: "flex", flex: 1 }}>
        {/* Desktop & Mobile Sidebar */}
        <aside
          style={{
            width: "260px",
            background: "var(--bg-surface)",
            borderRight: "1px solid var(--line)",
            display: "flex",
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
                  background: role === "admin" ? "#ff238f" : role === "judge" ? "#ff238f" : "#ff238f",
                  boxShadow: `0 0 8px ${role === "admin" ? "#ff238f" : role === "judge" ? "#ff238f" : "#ff238f"}`
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
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                        e.currentTarget.style.color = "var(--bone)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--bone-dim)";
                      }
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
    </div>
  );
}
