"use client";

import { useEffect, useState } from "react";
import { RoleShell } from "@/components/layout/role-shell";
import { masterStore, EventRecord, ScoringCriterion, Contingent } from "@/services/master-store";
import {
  Gavel,
  Lock,
  Save,
  CheckCircle2,
  Info,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function JudgePortalPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [criteria, setCriteria] = useState<ScoringCriterion[]>([]);
  const [contingents, setContingents] = useState<Contingent[]>([]);
  const [selectedContingentId, setSelectedContingentId] = useState("");

  // Numeric marks keyed by criterionId: 0-100
  const [marks, setMarks] = useState<Record<string, number>>({});
  // Raw string inputs to allow user to type and clear gracefully
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({});
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
    if (!crit.length) {
      const fallback: ScoringCriterion[] = [
        { id: `crit-${eventId}-1`, eventId, name: "Technique & Form", maxScore: 100, weight: 1.0, description: "Precision and skill execution" },
        { id: `crit-${eventId}-2`, eventId, name: "Musicality & Rhythm", maxScore: 100, weight: 1.0, description: "Flow with beats" },
        { id: `crit-${eventId}-3`, eventId, name: "Stage Impact", maxScore: 100, weight: 1.0, description: "Crowd response and presence" }
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
    setRawInputs({});
    setSubmittedMessage("");
  }

  function handleContingentChange(id: string) {
    setSelectedContingentId(id);
    setMarks({});
    setRawInputs({});
    setSubmittedMessage("");
  }

  function handleScoreInputChange(criterionId: string, val: string) {
    // If blank, allow empty typing state while setting calculation score to 0
    if (val === "") {
      setRawInputs((prev) => ({ ...prev, [criterionId]: "" }));
      setMarks((prev) => ({ ...prev, [criterionId]: 0 }));
      return;
    }

    // Filter non-numeric characters
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) return;

    let num = parseInt(clean, 10);
    if (isNaN(num)) return;

    // Enforce 0-100 range strictly
    if (num > 100) num = 100;
    if (num < 0) num = 0;

    setRawInputs((prev) => ({ ...prev, [criterionId]: String(num) }));
    setMarks((prev) => ({ ...prev, [criterionId]: num }));
  }

  function handleScoreBlur(criterionId: string) {
    // If left empty on blur, normalize to "0"
    if (!rawInputs[criterionId] || rawInputs[criterionId].trim() === "") {
      setRawInputs((prev) => ({ ...prev, [criterionId]: "0" }));
      setMarks((prev) => ({ ...prev, [criterionId]: 0 }));
    }
  }

  function handleSubmit(status: "draft" | "submitted") {
    if (!selectedContingentId) {
      alert("Please select the participant / contingent you are scoring.");
      return;
    }

    const currentEvent = events.find((e) => e.id === selectedEventId);
    const currentContingent = contingents.find((c) => c.id === selectedContingentId);

    criteria.forEach((c) => {
      const raw = marks[c.id] !== undefined ? marks[c.id] : 0;
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
        ? `Official score submitted and sealed for ${currentContingent?.name} in ${currentEvent?.name}.`
        : `Draft score saved successfully for ${currentContingent?.name}.`
    );
    setIsDraft(status === "draft");
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const selectedContingent = contingents.find((c) => c.id === selectedContingentId);

  // Compute live total score
  const totalWeighted = criteria.reduce((sum, c) => sum + (marks[c.id] || 0) * c.weight, 0);
  const maxPossible = criteria.reduce((sum, c) => sum + c.maxScore * c.weight, 0);
  const percentage = maxPossible > 0 ? ((totalWeighted / maxPossible) * 100).toFixed(1) : "0.0";

  return (
    <RoleShell role="judge">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "rgba(255, 45, 111, 0.1)",
                border: "1px solid rgba(255, 45, 111, 0.3)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--mag)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "0.5rem"
              }}
            >
              <Gavel size={13} />
              Authenticated Evaluation Desk
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Judge Scoring Terminal</h1>
            <p style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
              Evaluate contestants across official verticals (/100). All submissions are cryptographically timestamped and sealed.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.85rem",
              borderRadius: "var(--radius-sm)",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--line)"
            }}
          >
            <ShieldCheck size={16} style={{ color: "var(--acid)" }} />
            <span style={{ fontSize: "0.8rem", color: "var(--bone)", fontWeight: 600 }}>
              Judge Vikramaditya Sen
            </span>
            <span className="mono" style={{ fontSize: "0.75rem", color: "var(--bone-dim)" }}>
              (ILL-26-J001)
            </span>
          </div>
        </div>

        {/* Status Notification */}
        {submittedMessage && (
          <div
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "var(--radius-md)",
              background: isDraft ? "rgba(245, 158, 11, 0.1)" : "rgba(216, 255, 46, 0.1)",
              border: isDraft ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid rgba(216, 255, 46, 0.3)",
              color: isDraft ? "var(--warning)" : "var(--acid)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}
          >
            <CheckCircle2 size={18} />
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{submittedMessage}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: "0.15rem" }}>
                Timestamp: {new Date().toLocaleTimeString()} · Status: {isDraft ? "Draft Saved" : "Official Score Sealed"}
              </div>
            </div>
          </div>
        )}

        {/* Selection Configuration Card */}
        <div className="card">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem"
            }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Assigned Event</label>
              <select
                className="form-control"
                value={selectedEventId}
                onChange={(e) => handleEventChange(e.target.value)}
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.code} — {ev.name} ({ev.venue})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Contestant / Contingent</label>
              <select
                className="form-control"
                value={selectedContingentId}
                onChange={(e) => handleContingentChange(e.target.value)}
              >
                <option value="">-- Choose Contestant Entry --</option>
                {contingents.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name} ({c.collegeName})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Format &amp; Rule Bounds</label>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.85rem",
                  color: "var(--bone-dim)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>Format: <b style={{ color: "var(--bone)" }}>{selectedEvent?.eventType.toUpperCase() || "SOLO"}</b></span>
                <span>Scale: <b style={{ color: "var(--acid)" }}>0 to 100</b></span>
              </div>
            </div>
          </div>
        </div>

        {/* Criteria Evaluation Form */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--line)",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.2rem" }}>
                Criteria Scoring — {selectedContingent ? selectedContingent.name : "Select Contestant"}
              </h3>
              <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                Enter raw score (0–100) for each criterion. Weighted score calculates automatically in real time.
              </p>
            </div>

            <div
              style={{
                textAlign: "right",
                background: "var(--bg-surface)",
                padding: "0.75rem 1.25rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--line)"
              }}
            >
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--bone-dim)" }}>
                Calculated Weighted Score
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--acid)",
                  lineHeight: 1.1
                }}
              >
                {percentage}%
              </div>
              <div className="mono" style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                {totalWeighted} / {maxPossible} pts
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {criteria.map((c, index) => {
              const currentVal =
                rawInputs[c.id] !== undefined
                  ? rawInputs[c.id]
                  : marks[c.id] !== undefined
                  ? String(marks[c.id])
                  : "";

              return (
                <div
                  key={c.id}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--line)",
                    padding: "1.25rem 1.5rem",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1.25rem"
                  }}
                >
                  <div style={{ flex: 1, minWidth: "260px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="mono" style={{ color: "var(--acid)", fontWeight: 700 }}>
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontWeight: 600, color: "var(--bone)", fontSize: "1rem" }}>
                        {c.name}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>
                        {c.weight}x Weight
                      </span>
                    </div>
                    <p style={{ marginTop: "0.35rem", fontSize: "0.85rem", color: "var(--bone-dim)", margin: "0.35rem 0 0" }}>
                      {c.description}
                    </p>
                  </div>

                  {/* Manual Numeric Score Input: [  85  ] / 100 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "var(--bg-card)",
                        border: "1px solid var(--line-strong)",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.15rem 0.5rem"
                      }}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0"
                        value={currentVal}
                        onChange={(e) => handleScoreInputChange(c.id, e.target.value)}
                        onBlur={() => handleScoreBlur(c.id)}
                        className="mono"
                        style={{
                          width: "64px",
                          textAlign: "center",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "var(--acid)",
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          padding: "0.45rem 0"
                        }}
                        aria-label={`Score for ${c.name}`}
                      />
                    </div>
                    <span className="mono" style={{ color: "var(--dim)", fontSize: "0.95rem", fontWeight: 600 }}>
                      / {c.maxScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "2rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--line)"
            }}
          >
            <button
              onClick={() => handleSubmit("draft")}
              className="btn btn-secondary"
              style={{ gap: "0.5rem" }}
            >
              <Save size={15} />
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => handleSubmit("submitted")}
              className="btn btn-primary"
              style={{ gap: "0.5rem" }}
            >
              <Lock size={15} />
              <span>Submit &amp; Seal Score</span>
            </button>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
