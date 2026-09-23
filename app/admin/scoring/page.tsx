"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, EventRecord, Contingent, OCAdjustmentRecord, JudgeScoreRecord, BidRecord } from "@/services/master-store";
import Link from "next/link";

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
      setMessage("Please select a contingent and specify a reason.");
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
    setMessage(`Applied ${adjType.toUpperCase()} of ${delta} pts to ${contingents.find(c => c.id === adjContingentId)?.name}`);
    loadData();
  }

  function handleProcessBids(eventId: string) {
    // Process pending bids for this event against mock final ranks
    const eventBids = bids.filter(b => b.eventId === eventId);
    const ev = masterStore.getEventById(eventId);
    if (!ev) return;

    eventBids.forEach((bid, idx) => {
      // Mock actual rank determination: e.g. Rank 1, 2, 3
      const mockActualRank = (idx % 3) + 1;
      if (bid.predictedRank === mockActualRank) {
        bid.outcome = "correct";
        bid.pointsAwarded = ev.bidPositivePts;
      } else {
        bid.outcome = "incorrect";
        bid.pointsAwarded = ev.bidNegativePts;
      }
    });

    masterStore.logAudit("SCORING-ADMIN", "bids.evaluated", "event", eventId, `Evaluated ${eventBids.length} bids for ${ev.name}`);
    setMessage(`Evaluated ${eventBids.length} bids for ${ev.name}! Outcomes updated.`);
    loadData();
  }

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];
  const eventScores = scores.filter(s => s.eventId === selectedEvent?.id);
  const eventBids = bids.filter(b => b.eventId === selectedEvent?.id);
  const eventAdjs = adjustments.filter(a => a.eventId === selectedEvent?.id);

  return (
    <RoleShell role="admin">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Section 14 &amp; 17 · Master Scoring Engine</div>
          <h1>Scoring, Bidding &amp; Adjustments</h1>
          <p className="workspace-subtitle">
            Consolidate raw judge verticals, evaluate rank prediction bids (+X / 0 / −X), and record authorized disciplinary adjustments.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/leaderboard" className="button button-primary">
            🏆 View Live Leaderboard ↗
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="data-grid">
        <div className="data-card">
          <div className="data-card-label">Total Events</div>
          <div className="data-card-value">{events.length}</div>
          <div className="data-card-note">In master programme</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Raw Judge Marks</div>
          <div className="data-card-value status-good">{scores.length}</div>
          <div className="data-card-note">Vertical submissions</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Bids Submitted</div>
          <div className="data-card-value">{bids.length}</div>
          <div className="data-card-note">+X / 0 / −X predictions</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">OC Adjustments</div>
          <div className="data-card-value status-bad">{adjustments.length}</div>
          <div className="data-card-note">Audited penalties/bonuses</div>
        </div>
      </div>

      {/* Event Selector Bar */}
      <div className="workspace-panel" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "16px 20px" }}>
        <b style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: ".14em", color: "var(--acid)" }}>
          Active Event Control:
        </b>
        <select 
          className="workspace-select" 
          value={selectedEventId} 
          onChange={e => setSelectedEventId(e.target.value)}
          style={{ maxWidth: 360 }}
        >
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.code} · {ev.name} ({ev.category})
            </option>
          ))}
        </select>
        {selectedEvent && (
          <div style={{ display: "flex", gap: "12px", marginLeft: "auto", alignItems: "center" }}>
            <span className="tag">Bid: +{selectedEvent.bidPositivePts} / {selectedEvent.bidNegativePts} pts</span>
            <button 
              className="button button-outline" 
              onClick={() => handleProcessBids(selectedEvent.id)}
            >
              ★ Evaluate Bids
            </button>
          </div>
        )}
      </div>

      {message && (
        <div style={{ padding: "12px 18px", marginBottom: "16px", borderRadius: "2px", background: "rgba(216,255,46,.1)", border: "1px solid var(--acid)", color: "var(--acid)", fontSize: "13px" }}>
          {message}
        </div>
      )}

      {/* Active Event Breakdown: Judging Scores */}
      <div className="workspace-panel" style={{ padding: 0 }}>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(244,241,233,.1)" }}>
          <div>
            <h2>1. Raw Judge Submissions · {selectedEvent?.name}</h2>
            <p>Vertical scores on a /100 scale before weighted scaling. Raw values are immutable.</p>
          </div>
          <Link href="/judge" className="button button-secondary" style={{ fontSize: "12px", minHeight: 34 }}>
            Open Judge Portal ↗
          </Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Submission ID</th>
                <th>Judge</th>
                <th>Participant / Team</th>
                <th>Criterion</th>
                <th>Raw /100</th>
                <th>Weight</th>
                <th>Scaled Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {eventScores.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "24px", color: "var(--dim)" }}>
                    No judge scores recorded for this event yet. Use the <Link href="/judge" style={{ color: "var(--acid)" }}>Judge Portal</Link> to submit vertical scores.
                  </td>
                </tr>
              ) : (
                eventScores.map(s => (
                  <tr key={s.id}>
                    <td><code>{s.id.slice(-8)}</code></td>
                    <td><b>{s.judgeProfileId}</b></td>
                    <td><b>{s.participantId || s.teamId || "Contingent Entry"}</b></td>
                    <td>{s.criterionId}</td>
                    <td><b style={{ color: "var(--acid)" }}>{s.rawScore}</b> / {s.maxScore}</td>
                    <td>{s.weight}x</td>
                    <td><b>{((s.rawScore * s.weight)).toFixed(1)}</b></td>
                    <td><span className="status-pill status-success">{s.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bidding Submissions & Outcomes */}
      <div className="workspace-panel" style={{ padding: 0 }}>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(244,241,233,.1)" }}>
          <div>
            <h2>2. Bidding Predictions (+X / 0 / −X)</h2>
            <p>Contingents predict their final rank before event deadline. Correct = +X pts, Incorrect = −X pts.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Contingent</th>
                <th>Predicted Rank</th>
                <th>Submitted At</th>
                <th>Outcome</th>
                <th>Points Effect</th>
              </tr>
            </thead>
            <tbody>
              {eventBids.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "var(--dim)" }}>
                    No rank prediction bids submitted for this event. Bids lock at {selectedEvent?.bidDeadline ? new Date(selectedEvent.bidDeadline).toLocaleTimeString() : "deadline"}.
                  </td>
                </tr>
              ) : (
                eventBids.map(b => {
                  const cont = contingents.find(c => c.id === b.contingentId);
                  return (
                    <tr key={b.id}>
                      <td><b>{cont?.code} · {cont?.name}</b></td>
                      <td><b>Rank #{b.predictedRank}</b></td>
                      <td><i>{new Date(b.submittedAt).toLocaleTimeString()}</i></td>
                      <td>
                        <span className={`status-pill ${b.outcome === "correct" ? "status-success" : b.outcome === "incorrect" ? "status-danger" : "status-warning"}`}>
                          {b.outcome.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <b style={{ color: b.pointsAwarded > 0 ? "var(--acid)" : b.pointsAwarded < 0 ? "var(--mag)" : "inherit" }}>
                          {b.pointsAwarded > 0 ? `+${b.pointsAwarded}` : b.pointsAwarded} pts
                        </b>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OC Adjustments / Penalties */}
      <div className="workspace-panel">
        <h2>3. Apply Disciplinary Penalty / Administrative Adjustment</h2>
        <p style={{ marginBottom: "16px" }}>
          Section 12: Record authorized operational/disciplinary adjustments. All adjustments require an approved role and an immutable audit trail.
        </p>

        <form onSubmit={handleAddAdjustment} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", alignItems: "end" }}>
          <div>
            <label className="workspace-label">Target Contingent</label>
            <select className="workspace-select" value={adjContingentId} onChange={e => setAdjContingentId(e.target.value)} required>
              <option value="">-- Select Contingent --</option>
              {contingents.map(c => (
                <option key={c.id} value={c.id}>{c.code} · {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="workspace-label">Adjustment Type</label>
            <select className="workspace-select" value={adjType} onChange={e => setAdjType(e.target.value as any)}>
              <option value="penalty">Disciplinary Penalty (−)</option>
              <option value="bonus">Operational Bonus (+)</option>
              <option value="correction">Score Correction (±)</option>
            </select>
          </div>
          <div>
            <label className="workspace-label">Points Value</label>
            <input 
              className="workspace-input" 
              type="number" 
              value={adjDelta} 
              onChange={e => setAdjDelta(Number(e.target.value))} 
              required 
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label className="workspace-label">Audit Reason (Mandatory)</label>
            <input 
              className="workspace-input" 
              placeholder="e.g. Late reporting exceeding grace period (Section 12.3 violation)" 
              value={adjReason} 
              onChange={e => setAdjReason(e.target.value)} 
              required 
            />
          </div>
          <div>
            <button type="submit" className="button button-danger" style={{ width: "100%" }}>
              Record Adjustment
            </button>
          </div>
        </form>

        {/* Existing Adjustments Table */}
        {adjustments.length > 0 && (
          <div className="table-wrap" style={{ marginTop: "20px" }}>
            <table>
              <thead>
                <tr>
                  <th>Contingent</th>
                  <th>Type</th>
                  <th>Delta</th>
                  <th>Reason</th>
                  <th>Authorized By</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {adjustments.map(a => {
                  const cont = contingents.find(c => c.id === a.contingentId);
                  return (
                    <tr key={a.id}>
                      <td><b>{cont?.code} · {cont?.name}</b></td>
                      <td><span className={`status-pill ${a.pointsDelta < 0 ? "status-danger" : "status-success"}`}>{a.type}</span></td>
                      <td><b style={{ color: a.pointsDelta < 0 ? "var(--mag)" : "var(--acid)" }}>{a.pointsDelta > 0 ? `+${a.pointsDelta}` : a.pointsDelta} pts</b></td>
                      <td>{a.reason}</td>
                      <td>{a.authorizedBy}</td>
                      <td><i>{new Date(a.createdAt).toLocaleTimeString()}</i></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
