"use client";

import { useEffect, useState } from "react";
import { masterStore, LeaderboardEntry } from "@/services/master-store";
import Link from "next/link";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setEntries(masterStore.getLeaderboard());
  }, []);

  const filtered = entries.filter(e => 
    e.contingentCode.toLowerCase().includes(filter.toLowerCase()) ||
    e.contingentName.toLowerCase().includes(filter.toLowerCase()) ||
    e.collegeName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "var(--bone)", padding: "clamp(24px, 4vw, 48px) clamp(16px, 4vw, 32px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Navigation Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid rgba(244,241,233,.1)", paddingBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <Link href="/" className="brand" style={{ margin: 0 }}>
            <span className="brand-mark">✦</span> ILLENIUM 2026
          </Link>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link href="/admin/dashboard" className="button button-secondary" style={{ fontSize: "12px", minHeight: 36 }}>
              Control Room ↗
            </Link>
            <Link href="/judge" className="button button-secondary" style={{ fontSize: "12px", minHeight: 36 }}>
              Judge Portal ↗
            </Link>
          </div>
        </div>

        {/* Page Heading */}
        <div style={{ marginBottom: "28px" }}>
          <div className="eyebrow">Section 17 · Composite Championship Standings</div>
          <h1 className="display" style={{ fontSize: "clamp(36px, 6vw, 68px)", margin: "8px 0 12px" }}>
            Official Leaderboard
          </h1>
          <p className="muted" style={{ maxWidth: "60ch", lineHeight: 1.6 }}>
            Live cumulative championship tally: Event placements + Bidding rank predictions (+X / 0 / −X) + Audited disciplinary adjustments.
          </p>
        </div>

        {/* Podium Highlights */}
        {entries.length >= 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "28px" }}>
            {/* 1st Place */}
            <div style={{ background: "linear-gradient(135deg, rgba(216,255,46,.15) 0%, #14111d 100%)", border: "2px solid var(--acid)", padding: "24px", borderRadius: "2px" }}>
              <span className="tag" style={{ background: "var(--acid)", color: "var(--ink)", fontWeight: "bold" }}>👑 RANK #1</span>
              <h2 style={{ fontFamily: "Anton", fontSize: "28px", marginTop: "12px", marginBottom: "4px", color: "var(--bone)" }}>
                {entries[0].contingentName}
              </h2>
              <div style={{ fontSize: "12px", color: "var(--dim)", marginBottom: "16px" }}>{entries[0].collegeName} ({entries[0].contingentCode})</div>
              <div style={{ fontFamily: "Anton", fontSize: "48px", color: "var(--acid)", lineHeight: 1 }}>
                {entries[0].cumulativePoints} <span style={{ fontSize: "16px", color: "var(--bone)" }}>PTS</span>
              </div>
            </div>

            {/* 2nd Place */}
            <div style={{ background: "#14111d", border: "1px solid rgba(244,241,233,.2)", padding: "24px", borderRadius: "2px" }}>
              <span className="tag">🥈 RANK #2</span>
              <h2 style={{ fontFamily: "Anton", fontSize: "24px", marginTop: "12px", marginBottom: "4px", color: "var(--bone)" }}>
                {entries[1].contingentName}
              </h2>
              <div style={{ fontSize: "12px", color: "var(--dim)", marginBottom: "16px" }}>{entries[1].collegeName} ({entries[1].contingentCode})</div>
              <div style={{ fontFamily: "Anton", fontSize: "40px", color: "var(--bone)", lineHeight: 1 }}>
                {entries[1].cumulativePoints} <span style={{ fontSize: "16px", color: "var(--dim)" }}>PTS</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div style={{ background: "#14111d", border: "1px solid rgba(244,241,233,.2)", padding: "24px", borderRadius: "2px" }}>
              <span className="tag">🥉 RANK #3</span>
              <h2 style={{ fontFamily: "Anton", fontSize: "24px", marginTop: "12px", marginBottom: "4px", color: "var(--bone)" }}>
                {entries[2].contingentName}
              </h2>
              <div style={{ fontSize: "12px", color: "var(--dim)", marginBottom: "16px" }}>{entries[2].collegeName} ({entries[2].contingentCode})</div>
              <div style={{ fontFamily: "Anton", fontSize: "40px", color: "var(--bone)", lineHeight: 1 }}>
                {entries[2].cumulativePoints} <span style={{ fontSize: "16px", color: "var(--dim)" }}>PTS</span>
              </div>
            </div>
          </div>
        )}

        {/* Master Leaderboard Table */}
        <div className="workspace-panel" style={{ padding: 0 }}>
          <div style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(244,241,233,.1)", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ margin: 0 }}>Full Contingent Standings</h2>
            <input 
              className="workspace-input" 
              placeholder="Search code, team or college..." 
              value={filter} 
              onChange={e => setFilter(e.target.value)} 
              style={{ maxWidth: 300 }} 
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60, textAlign: "center" }}>Rank</th>
                  <th>Contingent</th>
                  <th>College</th>
                  <th>Event Pts</th>
                  <th>Bidding (+/−)</th>
                  <th>OC Adjustments</th>
                  <th style={{ textAlign: "right" }}>Cumulative Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(entry => (
                  <tr key={entry.contingentId}>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ 
                        fontFamily: "Anton", 
                        fontSize: "18px", 
                        color: entry.rank === 1 ? "var(--acid)" : entry.rank <= 3 ? "var(--bone)" : "var(--dim)" 
                      }}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td>
                      <b style={{ fontSize: "16px" }}>{entry.contingentName}</b>
                      <i>Code: {entry.contingentCode}</i>
                    </td>
                    <td>{entry.collegeName}</td>
                    <td><b>{entry.totalEventPoints}</b> pts</td>
                    <td>
                      <b style={{ color: entry.totalBiddingPoints > 0 ? "var(--acid)" : entry.totalBiddingPoints < 0 ? "var(--mag)" : "inherit" }}>
                        {entry.totalBiddingPoints > 0 ? `+${entry.totalBiddingPoints}` : entry.totalBiddingPoints} pts
                      </b>
                    </td>
                    <td>
                      <b style={{ color: entry.totalAdjustments < 0 ? "var(--mag)" : entry.totalAdjustments > 0 ? "var(--acid)" : "inherit" }}>
                        {entry.totalAdjustments > 0 ? `+${entry.totalAdjustments}` : entry.totalAdjustments} pts
                      </b>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <b style={{ fontFamily: "Anton", fontSize: "22px", color: entry.rank === 1 ? "var(--acid)" : "var(--bone)" }}>
                        {entry.cumulativePoints}
                      </b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
