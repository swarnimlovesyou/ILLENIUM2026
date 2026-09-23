"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import {
  masterStore,
  EventRecord,
  Contingent,
  OCAdjustmentRecord,
  JudgeScoreRecord,
  BidRecord
} from "@/services/master-store";
import Link from "next/link";
import {
  Shield,
  Trophy,
  Sparkles,
  Calculator,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Gavel,
  ClipboardList
} from "lucide-react";

export default function MasterScoringPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [contingents, setContingents] = useState<Contingent[]>([]);
  const [scores, setScores] = useState<JudgeScoreRecord[]>([]);
  const [bids, setBids] = useState<BidRecord[]>([]);
  const [adjustments, setAdjustments] = useState<OCAdjustmentRecord[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Adjustment Form State
  const [adjContingentId, setAdjContingentId] = useState("");
  const [adjType, setAdjType] = useState<"penalty" | "bonus" | "correction">("penalty");
  const [adjDelta, setAdjDelta] = useState<number>(-10);
  const [adjReason, setAdjReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const evs = masterStore.getEvents();
    setEvents([...evs]);
    setContingents([...masterStore.getContingents()]);
    setScores([...masterStore.getScores()]);
    setBids([...masterStore.getBids()]);
    setAdjustments([...masterStore.getAdjustments()]);
    if (evs.length && !selectedEventId) {
      setSelectedEventId(evs[0].id);
    }
  }

  function handleAddAdjustment(e: React.FormEvent) {
    e.preventDefault();
    if (!adjContingentId || !adjReason) {
      setMessage("Please select a contingent and specify an audit reason.");
      return;
    }

    const delta = adjType === "penalty" ? -Math.abs(adjDelta) : Math.abs(adjDelta);
    masterStore.addAdjustment({
      eventId: selectedEventId || undefined,
      contingentId: adjContingentId,
      type: adjType,
      pointsDelta: delta,
      reason: adjReason,
      authorizedBy: "ADMIN-CP"
    });

    setAdjReason("");
    setMessage(`Applied ${adjType.toUpperCase()} of ${delta} pts to ${contingents.find((c) => c.id === adjContingentId)?.name}`);
    loadData();
  }

  function handleProcessBids(eventId: string) {
    const eventBids = bids.filter((b) => b.eventId === eventId);
    const ev = masterStore.getEventById(eventId);
    if (!ev) return;

    eventBids.forEach((bid, idx) => {
      const mockActualRank = (idx % 3) + 1;
      if (bid.predictedRank === mockActualRank) {
        bid.outcome = "correct";
        bid.pointsAwarded = ev.bidPositivePts;
      } else {
        bid.outcome = "incorrect";
        bid.pointsAwarded = ev.bidNegativePts;
      }
    });

    masterStore.logAudit(
      "SCORING-ADMIN",
      "bids.evaluated",
      "event",
      eventId,
      `Evaluated ${eventBids.length} bids for ${ev.name}`
    );
    setMessage(`Evaluated ${eventBids.length} bids for ${ev.name}! Outcomes updated.`);
    loadData();
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const eventScores = scores.filter((s) => s.eventId === selectedEvent?.id);
  const eventBids = bids.filter((b) => b.eventId === selectedEvent?.id);

  return (
    <RoleShell role="admin">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Page Head */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "rgba(255, 35, 143, 0.15)",
                border: "1px solid rgba(255, 35, 143, 0.15)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#ff238f",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "0.5rem"
              }}
            >
              <Shield size={13} />
              Master Scoring Engine
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Scoring, Bidding & Audit Controls</h1>
            <p style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
              Consolidate raw judge marks, process rank prediction bids (+X / 0 / -X), and record authorized disciplinary adjustments.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/leaderboard" className="btn btn-primary" style={{ gap: "0.4rem" }}>
              <Trophy size={15} />
              <span>View Leaderboard</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">
              <Sparkles size={14} style={{ color: "#ff238f" }} />
              Active Events
            </div>
            <div className="kpi-value">{events.length}</div>
            <div className="kpi-subtext">Master programme</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <Gavel size={14} style={{ color: "#ff238f" }} />
              Raw Judge Marks
            </div>
            <div className="kpi-value" style={{ color: "#ff238f" }}>
              {scores.length}
            </div>
            <div className="kpi-subtext">Vertical submissions</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <Flame size={14} style={{ color: "var(--gold)" }} />
              Bids Submitted
            </div>
            <div className="kpi-value">{bids.length}</div>
            <div className="kpi-subtext">+X / 0 / -X predictions</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <AlertTriangle size={14} style={{ color: "#ff238f" }} />
              OC Adjustments
            </div>
            <div className="kpi-value" style={{ color: "#ff238f" }}>
              {adjustments.length}
            </div>
            <div className="kpi-subtext">Penalties & bonuses</div>
          </div>
        </div>

        {/* Event Control Bar */}
        <div className="card" style={{ padding: "1rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "300px" }}>
              <span className="form-label" style={{ margin: 0, whiteSpace: "nowrap" }}>
                Target Event:
              </span>
              <select
                className="form-control"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                style={{ maxWidth: "400px" }}
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.code} — {ev.name} ({ev.category})
                  </option>
                ))}
              </select>
            </div>

            {selectedEvent && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="badge badge-acid">
                  Bid Rules: +{selectedEvent.bidPositivePts} / {selectedEvent.bidNegativePts} pts
                </span>
                <button
                  onClick={() => handleProcessBids(selectedEvent.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: "0.4rem" }}
                >
                  <Calculator size={14} />
                  <span>Evaluate Bids</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            style={{
              padding: "0.85rem 1.25rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(255, 35, 143, 0.15)",
              border: "1px solid rgba(255, 35, 143, 0.15)",
              color: "#ff238f",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {/* Judge Raw Submissions Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-surface)"
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.1rem" }}>
                1. Raw Judge Submissions — {selectedEvent?.name}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.15rem" }}>
                Vertical marks on /100 scale before scaling factors are applied.
              </p>
            </div>
            <Link href="/judge" className="btn btn-secondary btn-sm" style={{ gap: "0.4rem" }}>
              <Gavel size={14} />
              <span>Open Judge Desk</span>
            </Link>
          </div>

          <div className="data-table-container" style={{ border: "none", borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Submission ID</th>
                  <th>Judge ID</th>
                  <th>Participant / Team</th>
                  <th>Criterion</th>
                  <th style={{ textAlign: "right" }}>Raw /100</th>
                  <th style={{ textAlign: "right" }}>Weight</th>
                  <th style={{ textAlign: "right" }}>Calculated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {eventScores.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "var(--dim)" }}>
                      No judge scores recorded for this event yet.
                    </td>
                  </tr>
                ) : (
                  eventScores.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span className="mono" style={{ fontSize: "0.8rem" }}>
                          {s.id.slice(-8)}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{s.judgeProfileId}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{s.participantId || s.teamId || "Contingent Entry"}</span>
                      </td>
                      <td>{s.criterionId}</td>
                      <td style={{ textAlign: "right" }}>
                        <span className="mono" style={{ fontWeight: 700, color: "#ff238f" }}>
                          {s.rawScore}
                        </span>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}> / {s.maxScore}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>{s.weight}x</td>
                      <td style={{ textAlign: "right" }}>
                        <span className="mono" style={{ fontWeight: 700 }}>
                          {(s.rawScore * s.weight).toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bidding Predictions Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--line)",
              background: "var(--bg-surface)"
            }}
          >
            <h3 style={{ fontSize: "1.1rem" }}>2. Bidding Predictions (+X / 0 / -X)</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.15rem" }}>
              Predictions locked prior to event commencement. Correct = +X pts, Incorrect = -X pts.
            </p>
          </div>

          <div className="data-table-container" style={{ border: "none", borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Contingent</th>
                  <th>Predicted Rank</th>
                  <th>Submitted At</th>
                  <th>Outcome</th>
                  <th style={{ textAlign: "right" }}>Points Effect</th>
                </tr>
              </thead>
              <tbody>
                {eventBids.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--dim)" }}>
                      No rank prediction bids submitted for this event.
                    </td>
                  </tr>
                ) : (
                  eventBids.map((b) => {
                    const cont = contingents.find((c) => c.id === b.contingentId);
                    return (
                      <tr key={b.id}>
                        <td>
                          <span style={{ fontWeight: 600 }}>{cont?.code} — {cont?.name}</span>
                        </td>
                        <td>
                          <span className="mono" style={{ fontWeight: 700, color: "var(--bone)" }}>
                            Rank #{b.predictedRank}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.8rem", color: "var(--dim)" }}>
                            {new Date(b.submittedAt).toLocaleTimeString()}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              b.outcome === "correct"
                                ? "badge-acid"
                                : b.outcome === "incorrect"
                                ? "badge-crimson"
                                : "badge-neutral"
                            }`}
                            style={{ fontSize: "0.65rem" }}
                          >
                            {b.outcome.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span
                            className="mono"
                            style={{
                              fontWeight: 700,
                              color:
                                b.pointsAwarded > 0
                                  ? "#ff238f"
                                  : b.pointsAwarded < 0
                                  ? "#ff238f"
                                  : "var(--bone-dim)"
                            }}
                          >
                            {b.pointsAwarded > 0 ? `+${b.pointsAwarded}` : b.pointsAwarded} pts
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disciplinary & Adjustment Form */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <AlertTriangle size={18} style={{ color: "#ff238f" }} />
                Record Disciplinary Penalty / Administrative Adjustment
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.2rem" }}>
                Mandatory audit logging enforced for all penalties and operational corrections.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAddAdjustment}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              alignItems: "end"
            }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Target Contingent</label>
              <select
                className="form-control"
                value={adjContingentId}
                onChange={(e) => setAdjContingentId(e.target.value)}
                required
              >
                <option value="">-- Select Contingent --</option>
                {contingents.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Adjustment Type</label>
              <select
                className="form-control"
                value={adjType}
                onChange={(e) => setAdjType(e.target.value as any)}
              >
                <option value="penalty">Disciplinary Penalty (-)</option>
                <option value="bonus">Operational Bonus (+)</option>
                <option value="correction">Score Correction (+/-)</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Points Delta</label>
              <input
                type="number"
                className="form-control mono"
                value={adjDelta}
                onChange={(e) => setAdjDelta(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0, gridColumn: "span 2" }}>
              <label className="form-label">Mandatory Audit Reason</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Late stage reporting beyond grace window (Violation Section 12.3)"
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                required
              />
            </div>

            <div>
              <button type="submit" className="btn btn-danger" style={{ width: "100%" }}>
                Record Adjustment
              </button>
            </div>
          </form>

          {/* Adjustments Table */}
          {adjustments.length > 0 && (
            <div className="data-table-container" style={{ marginTop: "1.5rem" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Contingent</th>
                    <th>Type</th>
                    <th style={{ textAlign: "right" }}>Points Delta</th>
                    <th>Reason</th>
                    <th>Authorized By</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustments.map((a) => {
                    const cont = contingents.find((c) => c.id === a.contingentId);
                    return (
                      <tr key={a.id}>
                        <td>
                          <span style={{ fontWeight: 600 }}>{cont?.code} — {cont?.name}</span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              a.pointsDelta < 0 ? "badge-crimson" : "badge-acid"
                            }`}
                            style={{ fontSize: "0.65rem" }}
                          >
                            {a.type}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span
                            className="mono"
                            style={{
                              fontWeight: 700,
                              color: a.pointsDelta < 0 ? "#ff238f" : "#ff238f"
                            }}
                          >
                            {a.pointsDelta > 0 ? `+${a.pointsDelta}` : a.pointsDelta} pts
                          </span>
                        </td>
                        <td>{a.reason}</td>
                        <td>
                          <span className="mono" style={{ fontSize: "0.8rem" }}>{a.authorizedBy}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.8rem", color: "var(--dim)" }}>
                            {new Date(a.createdAt).toLocaleTimeString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RoleShell>
  );
}
