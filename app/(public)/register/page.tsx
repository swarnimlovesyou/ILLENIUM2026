"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UnifiedHeader } from "@/components/layout/unified-header";
import {
  Users,
  Building2,
  Ticket,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Upload,
  CreditCard,
  ShieldCheck,
  Calendar,
  Sparkles,
  Search,
  Copy,
  ExternalLink,
  ChevronRight
} from "lucide-react";

const INVITED_COLLEGES = [
  "Atlas SkillTech University, Mumbai",
  "St. Xavier's College, Mumbai",
  "NMIMS Mumbai",
  "HR College of Commerce & Economics",
  "Mithibai College",
  "Jai Hind College",
  "KC College",
  "R.A. Podar College of Commerce",
  "Ruia College",
  "Wilson College",
  "Sophia College for Women",
  "K.J. Somaiya College",
  "Thadomal Shahani Engineering College",
  "D.J. Sanghvi College of Engineering",
  "Symbiosis International, Pune"
];

interface EventChoice {
  id: string;
  name: string;
  category: string;
  time: string;
  venue: string;
  types: string[];
}

const FESTIVAL_EVENTS: EventChoice[] = [
  { id: "e-01", name: "Seven To Smoke", category: "Performing Arts", time: "Day 1 · 11:00", venue: "Auditorium", types: ["CC", "PRNC"] },
  { id: "e-02", name: "Teqball Thunder", category: "Informals", time: "Day 1 · 11:00", venue: "Atrium", types: ["CC", "PRNC", "OD"] },
  { id: "e-03", name: "Desi To Drip", category: "Fashion & Dance", time: "Day 1 · 14:00", venue: "Auditorium", types: ["CC"] },
  { id: "e-04", name: "Mr. & Ms. Illenium™", category: "Flagship Informals", time: "Day 1 · 14:00", venue: "Atrium", types: ["CC", "PRNC"] },
  { id: "e-05", name: "D.R.A.M.A (Street Play)", category: "Theatre & Drama", time: "Day 1 · 16:30", venue: "Quad", types: ["CC"] },
  { id: "e-06", name: "Homeroom Harmonies", category: "Performing Arts", time: "Day 1 · 18:30", venue: "Auditorium", types: ["CC", "PRNC"] },
  { id: "e-07", name: "Monochromatic Mastery", category: "Fine Arts", time: "Day 1 · 09:30", venue: "Studio One", types: ["CC", "PRNC", "OD"] },
  { id: "e-08", name: "Sustainacity", category: "Business & Management", time: "Day 1 · 14:00", venue: "Quad Room 2", types: ["CC", "PRNC"] },
  { id: "e-09", name: "Ani-mate Your Fate", category: "Fine Arts", time: "Day 1 · 11:00", venue: "Studio One", types: ["CC", "PRNC", "OD"] },
  { id: "e-10", name: "Mirror, Mirror", category: "Fine Arts", time: "Day 1 · 16:30", venue: "Studio One", types: ["CC", "PRNC", "OD"] },
  { id: "e-11", name: "Vintage Vogue", category: "Informals", time: "Day 1 · 16:30", venue: "Quad", types: ["CC", "PRNC"] },
  { id: "e-12", name: "Battle of the Bands", category: "Performing Arts", time: "Day 2 · 16:00", venue: "Main Stage", types: ["CC"] }
];

type RegistrationMode = "home" | "leader" | "join" | "on-the-spot" | "status" | "done";

export default function RegisterPage() {
  const [mode, setMode] = useState<RegistrationMode>("home");
  const [joinStep, setJoinStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    codeConfirmed: false,
    collegeName: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
    joinType: "CC" as "CC" | "PRNC",
    selectedEvents: [] as string[],
    profilePhotoName: "",
    collegeIdName: "",
    govIdName: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    truthConfirmed: false,
    // Leader specific
    leaderCollege: "",
    leaderRules: false,
    leaderStatus: "sent" as "sent" | "review" | "approved"
  });

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Read query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const m = params.get("mode");
      if (m === "join" || m === "leader" || m === "on-the-spot" || m === "status") {
        setMode(m as RegistrationMode);
      }
      const c = params.get("code");
      if (c) {
        setFormData((prev) => ({ ...prev, code: c }));
      }
    }
  }, []);

  // Check code match
  useEffect(() => {
    const clean = formData.code.trim().toUpperCase();
    if (clean === "ILLENIUM26" || clean === "ATL26-7KQ" || clean === "CC-01") {
      setFormData((prev) => ({
        ...prev,
        collegeName: "Atlas SkillTech University",
        codeConfirmed: true
      }));
    }
  }, [formData.code]);

  const toggleEvent = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selectedEvents.includes(id);
      return {
        ...prev,
        selectedEvents: exists
          ? prev.selectedEvents.filter((x) => x !== id)
          : [...prev.selectedEvents, id]
      };
    });
  };

  const handleLeaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leaderCollege) {
      alert("Please select your invited college.");
      return;
    }
    setFormData((prev) => ({ ...prev, leaderStatus: "sent" }));
    setMode("status");
    showToast("Leader Request Submitted to Executive Core");
  };

  const handleJoinSubmit = () => {
    if (!formData.truthConfirmed) {
      alert("Please confirm that all details are accurate.");
      return;
    }
    setMode("done");
    showToast("Registration Successfully Submitted");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <UnifiedHeader />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1000,
            background: "var(--acid)",
            color: "var(--ink)",
            padding: "0.75rem 1.25rem",
            borderRadius: "var(--radius-sm)",
            fontWeight: 700,
            fontSize: "0.85rem",
            boxShadow: "var(--shadow-lg)",
            animation: "fadeIn 0.2s ease"
          }}
        >
          {toastMessage}
        </div>
      )}

      <main style={{ maxWidth: "1000px", margin: "0 auto", width: "100%", padding: "2.5rem 1.5rem", flex: 1 }}>
        {/* ========================================================================= */}
        {/* VIEW 1: REGISTRATION HUB / HOME                                           */}
        {/* ========================================================================= */}
        {mode === "home" && (
          <div>
            <div style={{ marginBottom: "2.5rem" }}>
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
                <Sparkles size={13} />
                ILLENIUM 2026 Registration
              </div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Festival Sign-Up & Entry
              </h1>
              <p style={{ marginTop: "0.4rem", fontSize: "0.95rem", maxWidth: "680px" }}>
                Choose your entry pathway: Apply as a Contingency Leader for your college, join with an issued contingency code, enter on-the-spot on fest days, or check your approval status.
              </p>
            </div>

            {/* 4 Primary Pathways Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.25rem",
                marginBottom: "2.5rem"
              }}
            >
              {/* Card 1: Contingency Leader */}
              <div
                onClick={() => setMode("leader")}
                className="card card-interactive"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "220px"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span className="badge badge-gold">College Lead</span>
                    <Building2 size={20} style={{ color: "var(--gold)" }} />
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                    Contingency Leader
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)" }}>
                    For a representative from an invited college. Submit your application to Executive Core to unlock your college's code.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--gold)", fontSize: "0.85rem", fontWeight: 700, marginTop: "1rem" }}>
                  <span>Apply as Leader</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 2: Join a College */}
              <div
                onClick={() => {
                  setJoinStep(1);
                  setMode("join");
                }}
                className="card card-interactive"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "220px",
                  borderColor: "rgba(216, 255, 46, 0.4)",
                  background: "linear-gradient(180deg, rgba(216, 255, 46, 0.04) 0%, var(--bg-card) 100%)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span className="badge badge-acid">7-Step Fast Track</span>
                    <Ticket size={20} style={{ color: "var(--acid)" }} />
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                    Join a College Team
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)" }}>
                    Have a contingency code from your leader? Start the verified 7-step join flow to connect your identity and events.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--acid)", fontSize: "0.85rem", fontWeight: 700, marginTop: "1rem" }}>
                  <span>Enter Code & Join</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 3: On The Spot Entry */}
              <div
                onClick={() => setMode("on-the-spot")}
                className="card card-interactive"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "220px"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span className="badge badge-neutral">Festival Days</span>
                    <Clock size={20} style={{ color: "var(--cyan)" }} />
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                    On The Spot Entry
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)" }}>
                    No college team? Register for open standalone events on fest days with OD designation.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--cyan)", fontSize: "0.85rem", fontWeight: 700, marginTop: "1rem" }}>
                  <span>Open Entry Form</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 4: Check Status */}
              <div
                onClick={() => setMode("status")}
                className="card card-interactive"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "220px"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span className="badge badge-neutral">Live Review</span>
                    <ShieldCheck size={20} style={{ color: "var(--mag)" }} />
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                    Check Approval Status
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)" }}>
                    Already applied as a Contingency Leader? Check if your request has been reviewed or retrieve your active code.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--mag)", fontSize: "0.85rem", fontWeight: 700, marginTop: "1rem" }}>
                  <span>Check Status</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CONTINGENCY LEADER APPLICATION                                    */}
        {/* ========================================================================= */}
        {mode === "leader" && (
          <div>
            <button
              onClick={() => setMode("home")}
              className="btn btn-ghost btn-sm"
              style={{ marginBottom: "1.5rem", gap: "0.4rem" }}
            >
              <ArrowLeft size={14} />
              <span>Back to Pathways</span>
            </button>

            <div className="card">
              <div className="card-header">
                <div>
                  <span className="badge badge-gold" style={{ marginBottom: "0.5rem" }}>
                    Contingency Leader Desk
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Bring Your College to ILLENIUM</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                    Only invited colleges can register. Fill out your details below to submit your credentials to the Executive Core.
                  </p>
                </div>
              </div>

              <form onSubmit={handleLeaderSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Parth Parmar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Phone Number (+91)</label>
                    <input
                      type="tel"
                      className="form-control mono"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="leader@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Create Account Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter a secure password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0, gridColumn: "span 2" }}>
                    <label className="form-label">Invited College</label>
                    <select
                      className="form-control"
                      value={formData.leaderCollege}
                      onChange={(e) => setFormData({ ...formData, leaderCollege: e.target.value })}
                      required
                    >
                      <option value="">-- Select Your Invited College --</option>
                      {INVITED_COLLEGES.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0, gridColumn: "span 2" }}>
                    <label className="form-label">Official College ID Card Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          collegeIdName: e.target.files?.[0]?.name || ""
                        })
                      }
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--dim)", marginTop: "0.25rem" }}>
                      Upload a clear photo so the Executive Core can verify your student credentials.
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input
                    type="checkbox"
                    id="leaderRules"
                    checked={formData.leaderRules}
                    onChange={(e) => setFormData({ ...formData, leaderRules: e.target.checked })}
                    required
                  />
                  <label htmlFor="leaderRules" style={{ fontSize: "0.85rem", color: "var(--bone-dim)", cursor: "pointer" }}>
                    I confirm I have read and agree to the official ILLENIUM 2026 Code of Conduct and fest regulations.
                  </label>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setMode("home")} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ gap: "0.4rem" }}>
                    <span>Send for Approval</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: 7-STEP JOIN WIZARD                                                */}
        {/* ========================================================================= */}
        {mode === "join" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <button
                onClick={() => {
                  if (joinStep > 1) setJoinStep(joinStep - 1);
                  else setMode("home");
                }}
                className="btn btn-ghost btn-sm"
                style={{ gap: "0.4rem" }}
              >
                <ArrowLeft size={14} />
                <span>{joinStep > 1 ? "Previous Step" : "Cancel"}</span>
              </button>

              {/* Progress Indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="mono" style={{ fontSize: "0.75rem", color: "var(--bone-dim)" }}>
                  STEP {joinStep} OF 7
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                    <div
                      key={s}
                      style={{
                        width: "18px",
                        height: "4px",
                        borderRadius: "2px",
                        background:
                          s < joinStep
                            ? "var(--acid)"
                            : s === joinStep
                            ? "#fff"
                            : "rgba(255, 255, 255, 0.15)"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              {/* STEP 1: CONTINGENCY CODE */}
              {joinStep === 1 && (
                <div>
                  <span className="badge badge-acid" style={{ marginBottom: "0.5rem" }}>
                    Step 1 · College Validation
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Enter Contingency Code</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                    Your code connects you directly to your college team roster. Ask your Contingency Leader if you haven't received one yet.
                  </p>

                  <div className="form-group" style={{ maxWidth: "480px" }}>
                    <label className="form-label">Contingency Code</label>
                    <input
                      type="text"
                      className="form-control mono"
                      placeholder="e.g. ILLENIUM26 or ATL26-7KQ"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.05em" }}
                      autoFocus
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--acid)", marginTop: "0.35rem" }}>
                      Active Demo Codes: <b>ILLENIUM26</b> or <b>ATL26-7KQ</b>
                    </span>
                  </div>

                  {formData.codeConfirmed && (
                    <div
                      style={{
                        padding: "1rem 1.25rem",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(216, 255, 46, 0.08)",
                        border: "1px solid rgba(216, 255, 46, 0.3)",
                        marginTop: "1.25rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--acid)" }}>
                          College Verified
                        </div>
                        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--bone)" }}>
                          {formData.collegeName}
                        </div>
                      </div>
                      <span className="badge badge-success">Valid Code</span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                    <button
                      onClick={() => setJoinStep(2)}
                      className="btn btn-primary"
                      style={{ gap: "0.4rem" }}
                    >
                      <span>Continue to Details</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL DETAILS */}
              {joinStep === 2 && (
                <div>
                  <span className="badge badge-acid" style={{ marginBottom: "0.5rem" }}>
                    Step 2 · Personal Profile
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Your Identity Details</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                    We use your email and phone to bind your digital ILLENIUM ID passport and credentials.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Swarnim Jambhrunkar"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Phone Number (+91)</label>
                      <input
                        type="tel"
                        className="form-control mono"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Account Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                    <button onClick={() => setJoinStep(3)} className="btn btn-primary" style={{ gap: "0.4rem" }}>
                      <span>Next: Participation Type</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PARTICIPATION TYPE */}
              {joinStep === 3 && (
                <div>
                  <span className="badge badge-acid" style={{ marginBottom: "0.5rem" }}>
                    Step 3 · Representation Role
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>How Are You Taking Part?</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                    Select your participation tier. If unsure, check with your Contingency Leader.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div
                      onClick={() => setFormData({ ...formData, joinType: "CC" })}
                      className={`card card-interactive ${formData.joinType === "CC" ? "podium-gold" : ""}`}
                      style={{
                        cursor: "pointer",
                        borderWidth: formData.joinType === "CC" ? "2px" : "1px",
                        borderColor: formData.joinType === "CC" ? "var(--acid)" : "var(--line)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span className="mono" style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--acid)" }}>
                          CC
                        </span>
                        {formData.joinType === "CC" && <CheckCircle2 size={18} style={{ color: "var(--acid)" }} />}
                      </div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Competes for College</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                        Competes directly in scoring events and earns points toward the championship tally.
                      </p>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, joinType: "PRNC" })}
                      className={`card card-interactive ${formData.joinType === "PRNC" ? "podium-gold" : ""}`}
                      style={{
                        cursor: "pointer",
                        borderWidth: formData.joinType === "PRNC" ? "2px" : "1px",
                        borderColor: formData.joinType === "PRNC" ? "var(--acid)" : "var(--line)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span className="mono" style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--cyan)" }}>
                          PRNC
                        </span>
                        {formData.joinType === "PRNC" && <CheckCircle2 size={18} style={{ color: "var(--cyan)" }} />}
                      </div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Takes Part (Non-Scoring)</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                        Takes part in festival proceedings for the college with non-competing point treatment.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                    <button onClick={() => setJoinStep(4)} className="btn btn-primary" style={{ gap: "0.4rem" }}>
                      <span>Next: Verification Documents</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENTS UPLOAD */}
              {joinStep === 4 && (
                <div>
                  <span className="badge badge-acid" style={{ marginBottom: "0.5rem" }}>
                    Step 4 · Verification Credentials
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Profile Photo & IDs</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                    Used solely for desk accreditation and physical wristband issuance. Files are stored securely.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Profile Photo (Headshot)</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setFormData({ ...formData, profilePhotoName: e.target.files?.[0]?.name || "" })
                        }
                      />
                      <span style={{ fontSize: "0.75rem", color: "var(--dim)", marginTop: "0.2rem" }}>
                        Clear face on plain background.
                      </span>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">College ID Card</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setFormData({ ...formData, collegeIdName: e.target.files?.[0]?.name || "" })
                        }
                      />
                      <span style={{ fontSize: "0.75rem", color: "var(--dim)", marginTop: "0.2rem" }}>
                        Photo or scan of physical college ID.
                      </span>
                    </div>

                    <div className="form-group" style={{ margin: 0, gridColumn: "span 2" }}>
                      <label className="form-label">Government ID (Aadhaar / Passport / Driving Licence)</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setFormData({ ...formData, govIdName: e.target.files?.[0]?.name || "" })
                        }
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                    <button onClick={() => setJoinStep(5)} className="btn btn-primary" style={{ gap: "0.4rem" }}>
                      <span>Next: Choose Events</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: CHOOSE EVENTS */}
              {joinStep === 5 && (
                <div>
                  <span className="badge badge-acid" style={{ marginBottom: "0.5rem" }}>
                    Step 5 · Programme Selection
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Choose Your Events</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                    Select the events you wish to enter. Your Contingency Leader can still modify entries prior to deadlines.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
                    {FESTIVAL_EVENTS.map((ev) => {
                      const isSelected = formData.selectedEvents.includes(ev.id);
                      return (
                        <div
                          key={ev.id}
                          onClick={() => toggleEvent(ev.id)}
                          style={{
                            padding: "1rem",
                            borderRadius: "var(--radius-sm)",
                            background: isSelected ? "rgba(216, 255, 46, 0.08)" : "var(--bg-surface)",
                            border: isSelected ? "1px solid var(--acid)" : "1px solid var(--line)",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? "var(--acid)" : "var(--bone)" }}>
                              {ev.name}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--dim)", marginTop: "0.15rem" }}>
                              {ev.category} · {ev.time}
                            </div>
                          </div>
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "4px",
                              border: isSelected ? "none" : "1px solid var(--line-strong)",
                              background: isSelected ? "var(--acid)" : "transparent",
                              color: "var(--ink)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {isSelected && <CheckCircle2 size={14} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                    <button onClick={() => setJoinStep(6)} className="btn btn-primary" style={{ gap: "0.4rem" }}>
                      <span>Next: Emergency Contact</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: EMERGENCY CONTACT */}
              {joinStep === 6 && (
                <div>
                  <span className="badge badge-acid" style={{ marginBottom: "0.5rem" }}>
                    Step 6 · Safety & Emergency
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Who Do We Call?</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                    A designated emergency contact in case of an on-site medical incident.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Contact Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Ramesh Parmar"
                        value={formData.emergencyName}
                        onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Contact Phone (+91)</label>
                      <input
                        type="tel"
                        className="form-control mono"
                        placeholder="+91 98765 43210"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0, gridColumn: "span 2" }}>
                      <label className="form-label">Relationship (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Parent / Guardian / Faculty In-Charge"
                        value={formData.emergencyRelation}
                        onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                    <button onClick={() => setJoinStep(7)} className="btn btn-primary" style={{ gap: "0.4rem" }}>
                      <span>Next: Review & Submit</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: REVIEW & SUBMIT */}
              {joinStep === 7 && (
                <div>
                  <span className="badge badge-acid" style={{ marginBottom: "0.5rem" }}>
                    Step 7 · Final Verification
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Check Everything</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                    Please review your submission details. Click "Edit" next to any field if you need to make changes.
                  </p>

                  <div className="data-table-container" style={{ marginBottom: "1.5rem" }}>
                    <table className="data-table">
                      <tbody>
                        <tr>
                          <td style={{ width: "160px", color: "var(--bone-dim)", fontWeight: 600 }}>Full Name</td>
                          <td style={{ fontWeight: 700 }}>{formData.fullName || "—"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button onClick={() => setJoinStep(2)} className="btn btn-ghost btn-sm">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: "var(--bone-dim)", fontWeight: 600 }}>College</td>
                          <td style={{ fontWeight: 700 }}>{formData.collegeName || "Atlas SkillTech University"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button onClick={() => setJoinStep(1)} className="btn btn-ghost btn-sm">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: "var(--bone-dim)", fontWeight: 600 }}>Phone / Email</td>
                          <td>{formData.phone || "—"} · {formData.email || "—"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button onClick={() => setJoinStep(2)} className="btn btn-ghost btn-sm">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: "var(--bone-dim)", fontWeight: 600 }}>Participation Tier</td>
                          <td><span className="badge badge-acid">{formData.joinType}</span></td>
                          <td style={{ textAlign: "right" }}>
                            <button onClick={() => setJoinStep(3)} className="btn btn-ghost btn-sm">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: "var(--bone-dim)", fontWeight: 600 }}>Chosen Events</td>
                          <td>
                            {formData.selectedEvents.length
                              ? formData.selectedEvents
                                  .map((id) => FESTIVAL_EVENTS.find((e) => e.id === id)?.name)
                                  .filter(Boolean)
                                  .join(", ")
                              : "None selected yet"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button onClick={() => setJoinStep(5)} className="btn btn-ghost btn-sm">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: "var(--bone-dim)", fontWeight: 600 }}>Emergency Contact</td>
                          <td>{formData.emergencyName || "—"} ({formData.emergencyPhone || "—"})</td>
                          <td style={{ textAlign: "right" }}>
                            <button onClick={() => setJoinStep(6)} className="btn btn-ghost btn-sm">Edit</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    <input
                      type="checkbox"
                      id="truth"
                      checked={formData.truthConfirmed}
                      onChange={(e) => setFormData({ ...formData, truthConfirmed: e.target.checked })}
                      required
                    />
                    <label htmlFor="truth" style={{ fontSize: "0.85rem", color: "var(--bone)", cursor: "pointer" }}>
                      I certify that all details submitted above are authentic and accurate.
                    </label>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                    <button onClick={() => setJoinStep(6)} className="btn btn-secondary">
                      Back
                    </button>
                    <button onClick={handleJoinSubmit} className="btn btn-primary" style={{ gap: "0.4rem" }}>
                      <span>Submit Registration</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: ON THE SPOT FESTIVAL ENTRY                                        */}
        {/* ========================================================================= */}
        {mode === "on-the-spot" && (
          <div>
            <button
              onClick={() => setMode("home")}
              className="btn btn-ghost btn-sm"
              style={{ marginBottom: "1.5rem", gap: "0.4rem" }}
            >
              <ArrowLeft size={14} />
              <span>Back to Pathways</span>
            </button>

            <div className="card">
              <div className="card-header">
                <div>
                  <span className="badge badge-neutral" style={{ marginBottom: "0.5rem" }}>
                    On The Spot Registration
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Enter On Festival Days</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                    Available on festival days for individual and informal events allowing on-the-spot entry (OD).
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                  Events Open for On-the-Spot Entry
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.5rem" }}>
                  {FESTIVAL_EVENTS.filter((e) => e.types.includes("OD")).map((ev) => (
                    <div
                      key={ev.id}
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--line)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{ev.name}</span>
                        <div style={{ fontSize: "0.75rem", color: "var(--dim)" }}>{ev.time} · {ev.venue}</div>
                      </div>
                      <span className="badge badge-acid" style={{ fontSize: "0.65rem" }}>OD Open</span>
                    </div>
                  ))}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("On-the-Spot Details Sent to Accreditation Desk");
                  setMode("done");
                }}
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" placeholder="Your name" required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Phone (+91)</label>
                    <input type="tel" className="form-control mono" placeholder="+91 98765 43210" required />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setMode("home")} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ gap: "0.4rem" }}>
                    <span>Submit & Proceed to Desk</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: LEADER APPROVAL STATUS & CODE RELEASE                             */}
        {/* ========================================================================= */}
        {mode === "status" && (
          <div>
            <button
              onClick={() => setMode("home")}
              className="btn btn-ghost btn-sm"
              style={{ marginBottom: "1.5rem", gap: "0.4rem" }}
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>

            <div className="card">
              <div className="card-header">
                <div>
                  <span className="badge badge-gold" style={{ marginBottom: "0.5rem" }}>
                    Status Tracker
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>
                    {formData.leaderStatus === "approved" ? "You're Approved." : "Request Received."}
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                    {formData.leaderStatus === "approved"
                      ? "Your college has been verified. Your unique contingency code is ready below."
                      : "Your application is currently being verified by the Executive Core."}
                  </p>
                </div>
              </div>

              {/* 3-Step Status Tracker */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.75rem",
                  margin: "1.5rem 0",
                  padding: "1.25rem",
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={20} style={{ color: "var(--acid)" }} />
                  <div>
                    <strong style={{ fontSize: "0.9rem" }}>1. Sent</strong>
                    <p style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Request received</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Clock
                    size={20}
                    style={{
                      color: formData.leaderStatus === "approved" ? "var(--acid)" : "var(--gold)"
                    }}
                  />
                  <div>
                    <strong style={{ fontSize: "0.9rem" }}>2. Under Review</strong>
                    <p style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Executive Core review</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <ShieldCheck
                    size={20}
                    style={{
                      color: formData.leaderStatus === "approved" ? "var(--acid)" : "var(--dim)"
                    }}
                  />
                  <div>
                    <strong style={{ fontSize: "0.9rem" }}>3. Approved</strong>
                    <p style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Code released</p>
                  </div>
                </div>
              </div>

              {/* Code Box if Approved */}
              {formData.leaderStatus === "approved" && (
                <div
                  style={{
                    padding: "1.5rem",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(216, 255, 46, 0.08)",
                    border: "1px solid rgba(216, 255, 46, 0.4)",
                    marginBottom: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--acid)", fontWeight: 700 }}>
                      Official Contingency Code
                    </div>
                    <div className="mono" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--bone)", letterSpacing: "0.08em" }}>
                      ATL26-7KQ
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.2rem" }}>
                      Atlas SkillTech University · Allocation Active
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText("ATL26-7KQ");
                      showToast("Contingency Code Copied!");
                    }}
                    className="btn btn-primary"
                    style={{ gap: "0.4rem" }}
                  >
                    <Copy size={15} />
                    <span>Copy Code</span>
                  </button>
                </div>
              )}

              {/* Demo State Switcher */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--dim)" }}>Demo Simulation:</span>
                <button
                  onClick={() => setFormData({ ...formData, leaderStatus: "approved" })}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: "0.75rem", color: "var(--acid)" }}
                >
                  Simulate Approved
                </button>
                <button
                  onClick={() => setFormData({ ...formData, leaderStatus: "review" })}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: "0.75rem" }}
                >
                  Simulate Under Review
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <Link href="/admin/contingents" className="btn btn-primary" style={{ gap: "0.4rem" }}>
                  <span>Contingency Leader Portal</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: CONFIRMATION / QUEUE SUBMISSION SUCCESS                           */}
        {/* ========================================================================= */}
        {mode === "done" && (
          <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                background: "rgba(216, 255, 46, 0.15)",
                color: "var(--acid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem"
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>You're in the Queue!</h1>
            <p style={{ maxWidth: "560px", margin: "0.5rem auto 2rem", fontSize: "0.95rem", color: "var(--bone-dim)" }}>
              Your details have been registered. Your Contingency Leader and the Accreditation Desk will review and issue your digital ILLENIUM ID passport and physical RFID wristband.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <Link href="/participant/dashboard" className="btn btn-primary" style={{ gap: "0.4rem" }}>
                <span>Go to My Passport Dashboard</span>
                <ArrowRight size={14} />
              </Link>
              <Link href="/" className="btn btn-secondary">
                Festival Landing
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
