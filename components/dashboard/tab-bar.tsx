"use client";

import React from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  badgeVariant?: "acid" | "success" | "warning" | "crimson" | "neutral";
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function TabBar({ tabs, activeTab, onChange }: TabBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.35rem",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--line)",
        overflowX: "auto",
        scrollbarWidth: "none"
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.9rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.825rem",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "var(--bone)" : "var(--bone-dim)",
              background: isActive ? "var(--bg-surface-elevated)" : "transparent",
              border: isActive ? "1px solid var(--line-strong)" : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap"
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "999px",
                  background: isActive ? "rgba(255, 35, 143, 0.15)" : "rgba(255, 255, 255, 0.06)",
                  color: isActive ? "#ff238f" : "var(--bone-dim)",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)"
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
