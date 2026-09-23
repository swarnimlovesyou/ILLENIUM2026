"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight, Trophy, Sparkles, Layers } from "lucide-react";
import { UnifiedHeader } from "./unified-header";

const links = [
  { href: "/events", label: "Programme" },
  { href: "/leaderboard", label: "Live Standings" },
  { href: "/about", label: "The Festival" }
];

export function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <UnifiedHeader />
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          background: "rgba(18, 16, 25, 0.7)",
          borderBottom: "1px solid var(--line)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)"
        }}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none"
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "4px",
              background: "var(--acid)",
              color: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "12px",
              fontFamily: "var(--font-display)"
            }}
          >
            IL
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "var(--bone)",
                letterSpacing: "-0.01em"
              }}
            >
              ILLENIUM
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)",
                color: "var(--bone-dim)",
                marginLeft: "0.4rem"
              }}
            >
              2026 / MUMBAI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: pathname.startsWith(link.href) ? "var(--acid)" : "var(--bone-dim)",
                transition: "color 0.15s ease"
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/auth/login" className="btn btn-ghost btn-sm">
            Sign In
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">
            <span>Get Pass</span>
            <ArrowUpRight size={14} />
          </Link>
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="btn btn-ghost btn-sm"
            style={{ display: "none" }}
            aria-label="Toggle navigation"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
    </>
  );
}
