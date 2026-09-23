"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, EventRecord, Contingent, BidRecord } from "@/services/master-store";
import {
  Flame,
  Lock,
  Trophy,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers
} from "lucide-react";

export default function ParticipantBiddingPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [contingents, setContingents] = useState<Contingent[]>([]);
  const [bids, setBids] = useState<BidRecord[]>([]);

  // Bid form
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedContingentId, setSelectedContingentId] = useState("");
  const [predictedRank, setPredictedRank] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const evs = masterStore.getEvents().filter((e) => e.biddingEnabled);
    const conts = masterStore.getContingents();
    setEvents(evs);
    setContingents(conts);
    setBids([...masterStore.getBids()]);
    if (evs.length && !selectedEventId) setSelectedEventId(evs[0].id);
    if (conts.length && !selectedContingentId) setSelectedContingentId(conts[0].id);
  }

  function handlePlaceBid(e: React.FormEvent) {
    e.preventDefault();
    const ev = events.find((e) => e.id === selectedEventId);
    if (!ev) return;

    const existing = bids.find(
      (b) => b.eventId === selectedEventId && b.contingentId === selectedContingentId
    );
    if (existing) {
      setMessage(`A bid for this event has already been locked for rank #${existing.predictedRank}.`);
      return;
    }

    masterStore.placeBid({
      eventId: selectedEventId,
      contingentId: selectedContingentId,
      predictedRank,
      profileId: "p-cl-parth"
    });

    setMessage(
      `Rank prediction locked! If you achieve Rank #${predictedRank}, you will earn +${ev.bidPositivePts} points (${ev.bidNegativePts} pts if missed).`
    );
    loadData();
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <RoleShell role="participant">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Page Head */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              background: "rgba(216, 255, 46, 0.1)",
              border: "1px solid rgba(216, 255, 46, 0.3)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--acid)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "0.5rem"
            }}
          >
            <Flame size={13} />
            Strategic Bidding Portal
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Event Rank Predictions</h1>
          <p style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
            Back your contingent: Predict your final ranking in competitive events before the deadline. Earn +X bonus points for an exact forecast, or absorb −X penalty if missed.
          </p>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">
              <Sparkles size={14} style={{ color: "var(--acid)" }} />
              Eligible Events
            </div>
            <div className="kpi-value">{events.length}</div>
            <div className="kpi-subtext">Competitive verticals</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <Lock size={14} style={{ color: "var(--cyan)" }} />
              Active Predictions
            </div>
            <div className="kpi-value" style={{ color: "var(--acid)" }}>
              {bids.length}
            </div>
            <div className="kpi-subtext">Confirmed rank forecasts</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <TrendingUp size={14} style={{ color: "var(--gold)" }} />
              Potential Upside
            </div>
            <div className="kpi-value" style={{ color: "var(--gold)" }}>
              +40 PTS
            </div>
            <div className="kpi-subtext">Championship boost</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">
              <AlertTriangle size={14} style={{ color: "var(--mag)" }} />
              Risk Exposure
            </div>
            <div className="kpi-value" style={{ color: "var(--mag)" }}>
              -20 PTS
            </div>
            <div className="kpi-subtext">Penalty on missed outcome</div>
          </div>
        </div>

        {message && (
          <div
            style={{
              padding: "0.85rem 1.25rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(216, 255, 46, 0.1)",
              border: "1px solid rgba(216, 255, 46, 0.3)",
              color: "var(--acid)",
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

        {/* Place Bid Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Lock size={18} style={{ color: "var(--acid)" }} />
                Submit Contingent Forecast
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.2rem" }}>
                Predictions lock irrevocably upon submission and preserve cryptographic timestamping.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePlaceBid}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              alignItems: "end"
            }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Select Event</label>
              <select
                className="form-control"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.code} — {ev.name} (+{ev.bidPositivePts} / {ev.bidNegativePts} pts)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">My Contingent</label>
              <select
                className="form-control"
                value={selectedContingentId}
                onChange={(e) => setSelectedContingentId(e.target.value)}
              >
                {contingents.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Predicted Final Position</label>
              <select
                className="form-control"
                value={predictedRank}
                onChange={(e) => setPredictedRank(Number(e.target.value))}
              >
                <option value={1}>Rank #1 (First Place / Champion)</option>
                <option value={2}>Rank #2 (Runner Up)</option>
                <option value={3}>Rank #3 (Second Runner Up)</option>
                <option value={4}>Rank #4 (Top 4 Finish)</option>
                <option value={5}>Rank #5 (Top 5 Finish)</option>
              </select>
            </div>

            <div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", gap: "0.4rem" }}>
                <Lock size={14} />
                <span>
                  Lock Bid (+{selectedEvent?.bidPositivePts || 10} / {selectedEvent?.bidNegativePts || -5})
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Submitted Bids Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--line)",
              background: "var(--bg-surface)"
            }}
          >
            <h3 style={{ fontSize: "1.05rem" }}>Active & Historical Predictions</h3>
          </div>

          <div className="data-table-container" style={{ border: "none", borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Contingent</th>
                  <th>Predicted Position</th>
                  <th>Timestamp</th>
                  <th>Status / Outcome</th>
                  <th style={{ textAlign: "right" }}>Championship Pts</th>
                </tr>
              </thead>
              <tbody>
                {bids.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--dim)" }}>
                      No bids submitted yet. Lock your predictions above.
                    </td>
                  </tr>
                ) : (
                  bids.map((b) => {
                    const ev = events.find((e) => e.id === b.eventId);
                    const cont = contingents.find((c) => c.id === b.contingentId);
                    return (
                      <tr key={b.id}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 600 }}>{ev?.name || b.eventId}</span>
                            <span className="mono" style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                              {ev?.code}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{cont?.code} — {cont?.name}</span>
                        </td>
                        <td>
                          <span className="badge badge-acid" style={{ fontSize: "0.75rem" }}>
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
                                  ? "var(--acid)"
                                  : b.pointsAwarded < 0
                                  ? "var(--mag)"
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
      </div>
    </RoleShell>
  );
}
