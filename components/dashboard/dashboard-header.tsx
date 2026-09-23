"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
  kicker: string;
  icon?: LucideIcon;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  accent?: "acid" | "mag" | "cyan" | "gold";
}

export function DashboardHeader({
  kicker,
  icon: Icon,
  title,
  subtitle,
  actions,
  accent = "acid"
}: DashboardHeaderProps) {
  const accentColor =
    accent === "mag"
      ? "#ff238f"
      : accent === "cyan"
      ? "#ff238f"
      : accent === "gold"
      ? "var(--gold)"
      : "#ff238f";

  const accentBg =
    accent === "mag"
      ? "rgba(255, 35, 143, 0.15)"
      : accent === "cyan"
      ? "rgba(255, 35, 143, 0.15)"
      : accent === "gold"
      ? "rgba(255, 200, 55, 0.1)"
      : "rgba(255, 35, 143, 0.15)";

  const accentBorder =
    accent === "mag"
      ? "rgba(255, 35, 143, 0.15)"
      : accent === "cyan"
      ? "rgba(255, 35, 143, 0.15)"
      : accent === "gold"
      ? "rgba(255, 200, 55, 0.3)"
      : "rgba(255, 35, 143, 0.15)";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "0.5rem"
      }}
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            background: accentBg,
            border: `1px solid ${accentBorder}`,
            fontSize: "0.75rem",
            fontWeight: 600,
            color: accentColor,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "0.5rem"
          }}
        >
          {Icon && <Icon size={13} />}
          <span>{kicker}</span>
        </div>
        <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h1>
        <p style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "var(--bone-dim)", maxWidth: "800px" }}>
          {subtitle}
        </p>
      </div>

      {actions && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {actions}
        </div>
      )}
    </div>
  );
}
