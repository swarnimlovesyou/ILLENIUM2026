"use client";

import { useEffect, useState } from "react";
import { masterStore, LeaderboardEntry } from "@/services/master-store";
import Link from "next/link";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Search,
  Shield,
  Flame,
  ArrowUpRight,
  Sparkles,
  SlidersHorizontal
} from "lucide-react";
import { UnifiedHeader } from "@/components/layout/unified-header";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setEntries(masterStore.getLeaderboard());
  }, []);

  const filtered = entries.filter(
    (e) =>
      e.contingentCode.toLowerCase().includes(filter.toLowerCase()) ||
      e.contingentName.toLowerCase().includes(filter.toLowerCase()) ||
      e.collegeName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <UnifiedHeader />

      <main style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", padding: "2.5rem 1.5rem", flex: 1 }}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "rgba(255, 200, 55, 0.1)",
                border: "1px solid rgba(255, 200, 55, 0.3)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--gold)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "0.75rem"
              }}
            >
              <Trophy size={13} />
              Championship Standings
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
              Official Festival Leaderboard
            </h1>
            <p style={{ marginTop: "0.4rem", maxWidth: "680px", fontSize: "0.95rem" }}>
              Live cumulative championship tally computed from validated event scores, bidding rank predictions (+X / 0 / -X), and audited OC adjustments.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/admin/scoring" className="btn btn-secondary btn-sm" style={{ gap: "0.4rem" }}>
              <Shield size={14} />
              <span>Scoring Engine</span>
            </Link>
            <Link href="/judge" className="btn btn-secondary btn-sm" style={{ gap: "0.4rem" }}>
              <SlidersHorizontal size={14} />
              <span>Judge Console</span>
            </Link>
          </div>
        </div>

        {/* Podium Cards */}
        {entries.length >= 3 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem"
            }}
          >
            {/* 1st Place - Gold */}
            <div className="podium-card podium-gold">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span className="badge badge-gold" style={{ gap: "0.4rem" }}>
                  <Crown size={12} />
                  Rank #01 Gold
                </span>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--gold)" }}>
                  {entries[0].contingentCode}
                </span>
              </div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--bone)", marginBottom: "0.25rem" }}>
                {entries[0].contingentName}
              </h2>
              <div style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginBottom: "1.5rem" }}>
                {entries[0].collegeName}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.75rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    lineHeight: 1
                  }}
                >
                  {entries[0].cumulativePoints}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--bone-dim)" }}>
                  TOTAL PTS
                </span>
              </div>
            </div>

            {/* 2nd Place - Silver */}
            <div className="podium-card podium-silver">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span className="badge badge-neutral" style={{ gap: "0.4rem", borderColor: "rgba(192, 200, 208, 0.4)" }}>
                  <Medal size={12} />
                  Rank #02 Silver
                </span>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--silver)" }}>
                  {entries[1].contingentCode}
                </span>
              </div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--bone)", marginBottom: "0.25rem" }}>
                {entries[1].contingentName}
              </h2>
              <div style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginBottom: "1.5rem" }}>
                {entries[1].collegeName}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.75rem",
                    fontWeight: 700,
                    color: "var(--bone)",
                    lineHeight: 1
                  }}
                >
                  {entries[1].cumulativePoints}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--bone-dim)" }}>
                  TOTAL PTS
                </span>
              </div>
            </div>

            {/* 3rd Place - Bronze */}
            <div className="podium-card podium-bronze">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span className="badge badge-neutral" style={{ gap: "0.4rem", borderColor: "rgba(205, 127, 50, 0.4)" }}>
                  <Award size={12} />
                  Rank #03 Bronze
                </span>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--bronze)" }}>
                  {entries[2].contingentCode}
                </span>
              </div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--bone)", marginBottom: "0.25rem" }}>
                {entries[2].contingentName}
              </h2>
              <div style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginBottom: "1.5rem" }}>
                {entries[2].collegeName}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.75rem",
                    fontWeight: 700,
                    color: "var(--bone)",
                    lineHeight: 1
                  }}
                >
                  {entries[2].cumulativePoints}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--bone-dim)" }}>
                  TOTAL PTS
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Master Standings Table Card */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Card Header & Search */}
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              background: "var(--bg-surface)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Trophy size={18} style={{ color: "var(--gold)" }} />
              <h3 style={{ fontSize: "1.1rem" }}>All Contingent Standings</h3>
              <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>
                {filtered.length} Teams
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", maxWidth: "340px" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--dim)"
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by code, team, or college..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ paddingLeft: "36px", fontSize: "0.85rem" }}
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="data-table-container" style={{ border: "none", borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "70px", textAlign: "center" }}>Rank</th>
                  <th>Contingent</th>
                  <th>College Name</th>
                  <th style={{ textAlign: "right" }}>Event Pts</th>
                  <th style={{ textAlign: "right" }}>Bidding (+/-)</th>
                  <th style={{ textAlign: "right" }}>OC Adjustments</th>
                  <th style={{ textAlign: "right" }}>Cumulative Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.contingentId}>
                    <td style={{ textAlign: "center" }}>
                      <span
                        className="mono"
                        style={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color:
                            entry.rank === 1
                              ? "var(--gold)"
                              : entry.rank === 2
                              ? "var(--silver)"
                              : entry.rank === 3
                              ? "var(--bronze)"
                              : "var(--bone-dim)"
                        }}
                      >
                        #{entry.rank.toString().padStart(2, "0")}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 700, color: "var(--bone)", fontSize: "0.95rem" }}>
                          {entry.contingentName}
                        </span>
                        <span className="mono" style={{ fontSize: "0.75rem", color: "var(--acid)" }}>
                          CODE: {entry.contingentCode}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: "var(--bone-dim)", fontSize: "0.875rem" }}>
                        {entry.collegeName}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: 600, color: "var(--bone)" }}>
                        {entry.totalEventPoints}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            entry.totalBiddingPoints > 0
                              ? "var(--acid)"
                              : entry.totalBiddingPoints < 0
                              ? "var(--mag)"
                              : "var(--bone-dim)"
                        }}
                      >
                        {entry.totalBiddingPoints > 0 ? `+${entry.totalBiddingPoints}` : entry.totalBiddingPoints}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            entry.totalAdjustments < 0
                              ? "var(--mag)"
                              : entry.totalAdjustments > 0
                              ? "var(--acid)"
                              : "var(--bone-dim)"
                        }}
                      >
                        {entry.totalAdjustments > 0 ? `+${entry.totalAdjustments}` : entry.totalAdjustments}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: entry.rank === 1 ? "var(--gold)" : "var(--bone)"
                        }}
                      >
                        {entry.cumulativePoints}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
