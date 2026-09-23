"use client";

import React from "react";

export type BadgeVariant =
  | "acid"
  | "success"
  | "warning"
  | "crimson"
  | "cyan"
  | "gold"
  | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
}

export function StatusBadge({ label, variant = "neutral", dot = true }: StatusBadgeProps) {
  const getBadgeClass = () => {
    switch (variant) {
      case "acid":
        return "badge-acid";
      case "success":
        return "badge-success";
      case "warning":
        return "badge-neutral";
      case "crimson":
        return "badge-crimson";
      case "gold":
        return "badge-gold";
      default:
        return "badge-neutral";
    }
  };

  const getCustomStyle = (): React.CSSProperties => {
    if (variant === "cyan") {
      return {
        background: "rgba(255, 35, 143, 0.15)",
        color: "#ff238f",
        border: "1px solid rgba(255, 35, 143, 0.15)"
      };
    }
    if (variant === "warning") {
      return {
        background: "rgba(245, 158, 11, 0.12)",
        color: "var(--warning)",
        border: "1px solid rgba(245, 158, 11, 0.3)"
      };
    }
    return {};
  };

  const getDotColor = () => {
    switch (variant) {
      case "acid":
        return "#ff238f";
      case "success":
        return "var(--success)";
      case "warning":
        return "var(--warning)";
      case "crimson":
        return "#ff238f";
      case "cyan":
        return "#ff238f";
      case "gold":
        return "var(--gold)";
      default:
        return "var(--bone-dim)";
    }
  };

  return (
    <span
      className={`badge ${getBadgeClass()}`}
      style={{
        fontSize: "0.7rem",
        padding: "0.2rem 0.55rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        ...getCustomStyle()
      }}
    >
      {dot && (
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: getDotColor(),
            display: "inline-block"
          }}
        />
      )}
      <span>{label}</span>
    </span>
  );
}
