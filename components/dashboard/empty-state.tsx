"use client";

import React from "react";
import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.5rem 1.5rem",
        textAlign: "center",
        background: "var(--bg-card)",
        borderRadius: "var(--radius-md)",
        border: "1px dashed var(--line-strong)",
        gap: "0.75rem"
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--bone-dim)",
          marginBottom: "0.25rem"
        }}
      >
        <Icon size={20} />
      </div>
      <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--bone)" }}>{title}</h4>
      <p style={{ fontSize: "0.85rem", color: "var(--dim)", maxWidth: "420px", margin: 0 }}>
        {description}
      </p>
      {action && <div style={{ marginTop: "0.5rem" }}>{action}</div>}
    </div>
  );
}
