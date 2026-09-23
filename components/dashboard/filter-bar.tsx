"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdown {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (val: string) => void;
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDropdown[];
  resultsCount?: number;
  totalCount?: number;
  onClear?: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search records...",
  filters = [],
  resultsCount,
  totalCount,
  onClear
}: FilterBarProps) {
  const hasActiveFilters = searchQuery !== "" || filters.some((f) => f.value !== "" && f.value !== "all");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
        padding: "0.85rem 1.25rem",
        background: "var(--bg-card)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-md)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", flex: 1, minWidth: 0, width: "100%" }}>
        {/* Search input container */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            flex: 1,
            maxWidth: "380px"
          }}
        >
          <Search
            size={15}
            style={{
              position: "absolute",
              left: "0.85rem",
              color: "var(--dim)",
              pointerEvents: "none"
            }}
          />
          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              paddingLeft: "2.4rem",
              paddingRight: searchQuery ? "2.2rem" : "1rem",
              fontSize: "0.85rem",
              paddingTop: "0.55rem",
              paddingBottom: "0.55rem"
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              style={{
                position: "absolute",
                right: "0.6rem",
                background: "transparent",
                border: "none",
                color: "var(--dim)",
                cursor: "pointer",
                padding: "0.2rem",
                display: "flex",
                alignItems: "center"
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        {filters.map((f) => (
          <div key={f.id} style={{ minWidth: "140px" }}>
            <select
              className="form-control"
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              style={{
                fontSize: "0.825rem",
                paddingTop: "0.55rem",
                paddingBottom: "0.55rem",
                cursor: "pointer"
              }}
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {hasActiveFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: "0.75rem", color: "#ff238f", padding: "0.4rem 0.6rem" }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {resultsCount !== undefined && (
        <div style={{ fontSize: "0.8rem", color: "var(--dim)", whiteSpace: "nowrap" }}>
          Showing <span style={{ color: "var(--bone)", fontWeight: 600 }}>{resultsCount}</span>
          {totalCount !== undefined && (
            <>
              {" "}
              of <span style={{ color: "var(--bone)", fontWeight: 600 }}>{totalCount}</span>
            </>
          )}{" "}
          records
        </div>
      )}
    </div>
  );
}
