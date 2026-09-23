"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, EventRecord, Contingent, BidRecord } from "@/services/master-store";

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
    const evs = masterStore.getEvents().filter(e => e.biddingEnabled);
    const conts = masterStore.getContingents();
    setEvents(evs);
    setContingents(conts);
    setBids([...masterStore.getBids()]);
    if (evs.length && !selectedEventId) setSelectedEventId(evs[0].id);
    if (conts.length && !selectedContingentId) setSelectedContingentId(conts[0].id);
  }

  function handlePlaceBid(e: React.FormEvent) {
    e.preventDefault();
    const ev = events.find(e => e.id === selectedEventId);
    if (!ev) return;

    // Check if bid already exists
    const existing = bids.find(b => b.eventId === selectedEventId && b.contingentId === selectedContingentId);
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

    setMessage(`Rank prediction locked! If you achieve Rank #${predictedRank}, you will earn +${ev.bidPositivePts} points (or ${ev.bidNegativePts} if missed).`);
    loadData();
  }

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <RoleShell role="participant">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Section 11 · Strategic Bidding</div>
          <h1>Event Rank Predictions</h1>
          <p className="workspace-subtitle">
            Back your contingent: Predict your final ranking in competitive events before the deadline. High stakes: +X points for a match, −X points if missed.
          </p>
        </div>
        <span className="live-pill"><i /> Bidding Open</span>
      </div>

      <div className="data-grid">
        <div className="data-card">
          <div className="data-card-label">Events with Bidding</div>
          <div className="data-card-value">{events.length}</div>
          <div className="data-card-note">Level 2 &amp; 3 categories</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">My Locked Bids</div>
          <div className="data-card-value status-good">{bids.length}</div>
          <div className="data-card-note">Confirmed rank forecasts</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Potential Reward</div>
          <div className="data-card-value status-good">+40 PTS</div>
          <div className="data-card-note">Championship boost</div>
        </div>
        <div className="data-card">
          <div className="data-card-label">Risk Exposure</div>
          <div className="data-card-value status-bad">−20 PTS</div>
          <div className="data-card-note">Penalty on incorrect outcome</div>
        </div>
      </div>

      {message && (
        <div style={{ padding: "14px 18px", marginBottom: "20px", borderRadius: "2px", background: "rgba(216,255,46,.1)", border: "1px solid var(--acid)", color: "var(--acid)", fontSize: "14px" }}>
          {message}
        </div>
      )}

      {/* Place Bid Form */}
      <div className="workspace-panel">
        <h2>Submit Rank Prediction</h2>
        <p style={{ marginBottom: "18px" }}>
          Bids are locked at the stated deadline and preserve the original submission timestamp.
        </p>

        <form onSubmit={handlePlaceBid} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "end" }}>
          <div>
            <label className="workspace-label">Select Event</label>
            <select 
              className="workspace-select" 
              value={selectedEventId} 
              onChange={e => setSelectedEventId(e.target.value)}
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.code} · {ev.name} (+{ev.bidPositivePts} / {ev.bidNegativePts} pts)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="workspace-label">My Contingent</label>
            <select 
              className="workspace-select" 
              value={selectedContingentId} 
              onChange={e => setSelectedContingentId(e.target.value)}
            >
              {contingents.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="workspace-label">Predicted Final Position</label>
            <select 
              className="workspace-select" 
              value={predictedRank} 
              onChange={e => setPredictedRank(Number(e.target.value))}
            >
              <option value={1}>Rank #1 (First Place / Winner)</option>
              <option value={2}>Rank #2 (Runner Up)</option>
              <option value={3}>Rank #3 (Second Runner Up)</option>
              <option value={4}>Rank #4 (Top 4 Finish)</option>
              <option value={5}>Rank #5 (Top 5 Finish)</option>
            </select>
          </div>

          <div>
            <button type="submit" className="button button-primary" style={{ width: "100%" }}>
              🔒 Lock In Bid (+{selectedEvent?.bidPositivePts || 10} / {selectedEvent?.bidNegativePts || -5})
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Bids Table */}
      <div className="workspace-panel" style={{ padding: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(244,241,233,.1)" }}>
          <h2>My Active &amp; Historical Bids</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Contingent</th>
                <th>Predicted Rank</th>
                <th>Timestamp Locked</th>
                <th>Status / Outcome</th>
                <th>Championship Pts</th>
              </tr>
            </thead>
            <tbody>
              {bids.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "var(--dim)" }}>
                    No bids submitted yet. Use the form above to lock your prediction before event deadlines.
                  </td>
                </tr>
              ) : (
                bids.map(b => {
                  const ev = events.find(e => e.id === b.eventId);
                  const cont = contingents.find(c => c.id === b.contingentId);
                  return (
                    <tr key={b.id}>
                      <td>
                        <b>{ev?.name || b.eventId}</b>
                        <i>{ev?.code}</i>
                      </td>
                      <td><b>{cont?.code} · {cont?.name}</b></td>
                      <td>
                        <span style={{ fontFamily: "Anton", fontSize: "16px", color: "var(--acid)" }}>
                          RANK #{b.predictedRank}
                        </span>
                      </td>
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
    </RoleShell>
  );
}
