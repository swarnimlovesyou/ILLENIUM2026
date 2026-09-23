"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subtext?: string;
  icon?: LucideIcon;
  color?: string; // e.g. "#ff238f", "var(--success)", "var(--warning)", "#ff238f", "#ff238f", "var(--gold)"
}

export function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  color = "#ff238f"
}: MetricCardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">
        {Icon && <Icon size={14} style={{ color }} />}
        <span>{label}</span>
      </div>
      <div className="kpi-value" style={{ color: color === "#ff238f" ? "var(--bone)" : color }}>
        {value}
      </div>
      {subtext && <div className="kpi-subtext">{subtext}</div>}
    </div>
  );
}

export function MetricGrid({ children }: { children: React.ReactNode }) {
  return <div className="kpi-grid">{children}</div>;
}
