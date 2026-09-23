"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, EventRecord, ScoringCriterion, Contingent } from "@/services/master-store";
import Link from "next/link";

export default function JudgePortalPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [criteria, setCriteria] = useState<ScoringCriterion[]>([]);
  const [contingents, setContingents] = useState<Contingent[]>([]);
  const [selectedContingentId, setSelectedContingentId] = useState("");
  
  // Marks keyed by criterionId: 0-100
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    const evs = masterStore.getEvents();
    setEvents(evs);
    setContingents(masterStore.getContingents());
    if (evs.length) {
      setSelectedEventId(evs[0].id);
      loadCriteria(evs[0].id);
    }
  }, []);

  function loadCriteria(eventId: string) {
    const crit = masterStore.getCriteriaByEvent(eventId);
    // If no criteria seeded for this specific event, provide fallback standard fest criteria
    if (!crit.length) {
      const fallback: ScoringCriterion[] = [
        { id: `crit-${eventId}-1`, eventId, name: "Execution & Technique", maxScore: 100, weight: 1.0, description: "Mastery and precision" },
        { id: `crit-${eventId}-2`, eventId, name: "Creativity & Originality", maxScore: 100, weight: 1.0, description: "Innovation and flair" },
        { id: `crit-${eventId}-3`, eventId, name: "Overall Stage Presence", maxScore: 100, weight: 1.0, description: "Crowd impact and delivery" }
      ];
      setCriteria(fallback);
    } else {
      setCriteria(crit);
    }
  }

  function handleEventChange(id: string) {
    setSelectedEventId(id);
    loadCriteria(id);
    setMarks({});
    setSubmittedMessage("");
  }

  function handleScoreChange(criterionId: string, val: number) {
    const clamped = Math.max(0, Math.min(100, val || 0));
    setMarks(prev => ({ ...prev, [criterionId]: clamped }));
  }

  function handleSubmit(status: "draft" | "submitted") {
    if (!selectedContingentId) {
      alert("Please select the participant / contingent you are scoring.");
      return;
    }

    const currentEvent = events.find(e => e.id === selectedEventId);
    const currentContingent = contingents.find(c => c.id === selectedContingentId);

    criteria.forEach(c => {
      const raw = marks[c.id] || 0;
      masterStore.submitJudgeScore({
        eventId: selectedEventId,
        judgeProfileId: "JUDGE-VIKRAM-SEN",
        participantId: selectedContingentId,
        criterionId: c.name,
        rawScore: raw,
        maxScore: c.maxScore,
        weight: c.weight,
        calculatedScore: raw * c.weight,
        status,
        version: 1
      });
    });

    setSubmittedMessage(
      status === "submitted" 
        ? `Official score submitted and locked for ${currentContingent?.name} in ${currentEvent?.name}!`
        : `Draft score saved successfully for ${currentContingent?.name}.`
    );
    setIsDraft(status === "draft");
  }

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const selectedContingent = contingents.find(c => c.id === selectedContingentId);

  // Compute live total score
  const totalWeighted = criteria.reduce((sum, c) => sum + ((marks[c.id] || 0) * c.weight), 0);
  const maxPossible = criteria.reduce((sum, c) => sum + (c.maxScore * c.weight), 0);
  const percentage = maxPossible > 0 ? ((totalWeighted / maxPossible) * 100).toFixed(1) : "0.0";

  return (
    <RoleShell role="judge">
      <div className="workspace-page-head">
        <div>
          <div className="workspace-kicker">Section 9 · Authenticated Scoring</div>
          <h1>Judge Scoring Portal</h1>
          <p className="workspace-subtitle">
            Authenticated judge terminal: Evaluate contestants on /100 verticals. Submissions are timestamped, weighted, and sealed.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span className="live-pill"><i /> Judge: Vikramaditya Sen (ILL-26-J001)</span>
        </div>
      </div>

      {submittedMessage && (
        <div style={{ 
          padding: "16px 20px", 
          marginBottom: "20px", 
          borderRadius: "2px", 
          background: isDraft ? "rgba(255,159,28,.1)" : "rgba(216,255,46,.12)", 
          border: `1px solid ${isDraft ? "#ff9f1c" : "var(--acid)"}`, 
          color: isDraft ? "#ff9f1c" : "var(--acid)", 
          fontSize: "14px" 
        }}>
          <b>✓ {submittedMessage}</b>
          <div style={{ marginTop: "6px", fontSize: "12px", opacity: 0.8 }}>
            Timestamp: {new Date().toLocaleTimeString()} · Record ID: authenticated judge seal
          </div>
        </div>
      )}

      {/* Event and Contestant Selection */}
      <div className="workspace-panel" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        <div>
          <label className="workspace-label">Assigned Event</label>
          <select 
            className="workspace-select" 
            value={selectedEventId} 
            onChange={e => handleEventChange(e.target.value)}
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.code} · {ev.name} ({ev.venue})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="workspace-label">Participant / Contingent Being Scored</label>
          <select 
            className="workspace-select" 
            value={selectedContingentId} 
            onChange={e => setSelectedContingentId(e.target.value)}
          >
            <option value="">-- Choose Contestant Entry --</option>
            {contingents.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} · {c.name} ({c.collegeName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="workspace-label">Event Format &amp; Rule</label>
          <div style={{ padding: "10px 14px", background: "rgba(244,241,233,.04)", border: "1px solid rgba(244,241,233,.1)", borderRadius: "2px", fontSize: "13px" }}>
            <b>{selectedEvent?.eventType.toUpperCase()}</b> · Range: <b>0 to 100</b> per vertical
          </div>
        </div>
      </div>

      {/* Criteria Scoring Form */}
      <div className="workspace-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h2>Scoring Verticals · {selectedContingent ? selectedContingent.name : "Select Contestant"}</h2>
            <p>Score each criterion independently on a scale of 0 to 100.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "11px", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--dim)" }}>Live Weighted Score</span>
            <div style={{ fontFamily: "Anton", fontSize: "36px", color: "var(--acid)" }}>
              {percentage}%
            </div>
            <span style={{ fontSize: "11px", color: "var(--dim)" }}>{totalWeighted} / {maxPossible} weighted pts</span>
          </div>
        </div>

        <div style={{ display: "grid", gap: "18px" }}>
          {criteria.map((c, index) => {
            const currentMark = marks[c.id] || 0;
            return (
              <div 
                key={c.id} 
                style={{ 
                  background: "#191524", 
                  border: "1px solid rgba(244,241,233,.1)", 
                  padding: "18px 20px", 
                  borderRadius: "2px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "center",
                  gap: "20px"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontFamily: "Anton", color: "var(--acid)", fontSize: "18px" }}>#{index + 1}</span>
                    <b style={{ fontSize: "16px", color: "var(--bone)" }}>{c.name}</b>
                    <span className="tag" style={{ fontSize: "10px" }}>Weight: {c.weight}x</span>
                  </div>
                  <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--dim)" }}>
                    {c.description || "Official fest evaluation parameter."}
                  </p>
                </div>

                <div style={{ minWidth: 160 }}>
                  <input 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={currentMark} 
                    onChange={e => handleScoreChange(c.id, Number(e.target.value))} 
                    style={{ width: "100%", accentColor: "var(--acid)" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input 
                    type="number" 
                    min={0} 
                    max={100} 
                    value={currentMark} 
                    onChange={e => handleScoreChange(c.id, Number(e.target.value))}
                    className="workspace-input" 
                    style={{ width: 80, textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "var(--acid)" }}
                  />
                  <span style={{ color: "var(--dim)", fontSize: "14px" }}>/ 100</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
          <button 
            className="button button-secondary" 
            onClick={() => handleSubmit("draft")}
          >
            Save Draft
          </button>
          <button 
            className="button button-primary" 
            onClick={() => handleSubmit("submitted")}
          >
            🔒 Submit &amp; Seal Score
          </button>
        </div>
      </div>
    </RoleShell>
  );
}
