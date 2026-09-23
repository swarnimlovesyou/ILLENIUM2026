"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UnifiedHeader } from "@/components/layout/unified-header";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles
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
  code: string;
  name: string;
  category: string;
  time: string;
  venue: string;
  types: string[];
}

const FESTIVAL_EVENTS: EventChoice[] = [
  { id: "e-01", code: "E-101", name: "SEVEN TO SMOKE", category: "PERFORMING ARTS", time: "11:00", venue: "Auditorium", types: ["CC", "PRNC"] },
  { id: "e-02", code: "E-102", name: "TEQBALL THUNDER", category: "INFORMALS", time: "11:00", venue: "Atrium", types: ["CC", "PRNC", "OD"] },
  { id: "e-03", code: "E-103", name: "DESI TO DRIP", category: "PERFORMING ARTS", time: "14:00", venue: "Auditorium", types: ["CC"] },
  { id: "e-04", code: "E-104", name: "MR. & MS. ILLENIUM™", category: "INFORMALS", time: "14:00", venue: "Atrium", types: ["CC", "PRNC"] },
  { id: "e-05", code: "E-105", name: "D.R.A.M.A (STREET PLAY)", category: "THEATRE & DRAMA", time: "16:30", venue: "Auditorium", types: ["CC"] },
  { id: "e-06", code: "E-106", name: "MONOCHROMATIC MASTERY", category: "FINE ARTS", time: "09:30", venue: "Studio One", types: ["CC", "PRNC", "OD"] },
  { id: "e-07", code: "E-107", name: "ANI-MATE YOUR FATE", category: "FINE ARTS", time: "11:00", venue: "Studio One", types: ["CC", "PRNC", "OD"] },
  { id: "e-08", code: "E-108", name: "SUSTAINACITY", category: "BUSINESS", time: "14:00", venue: "Quad", types: ["CC"] },
  { id: "e-09", code: "E-109", name: "MIRROR, MIRROR", category: "FINE ARTS", time: "16:30", venue: "Studio One", types: ["CC", "PRNC", "OD"] },
  { id: "e-10", code: "E-110", name: "VINTAGE VOGUE", category: "INFORMALS", time: "16:30", venue: "Quad", types: ["CC", "PRNC"] },
  { id: "e-11", code: "E-111", name: "HOMEROOM HARMONIES", category: "PERFORMING ARTS", time: "18:30", venue: "Auditorium", types: ["CC", "PRNC"] },
  { id: "e-12", code: "E-112", name: "STALLS & INFORMALS", category: "INFORMALS", time: "18:30", venue: "Quad", types: ["OD", "PRNC"] }
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
    leaderStatus: "sent" as "sent" | "review" | "approved",
    // Spot specific
    spotEvents: ["e-12"] as string[]
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

  const toggleSpotEvent = (id: string) => {
    setFormData((prev) => {
      const exists = prev.spotEvents.includes(id);
      return {
        ...prev,
        spotEvents: exists
          ? prev.spotEvents.filter((x) => x !== id)
          : [...prev.spotEvents, id]
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
    showToast("Leader Application Submitted to Executive Core");
  };

  const handleJoinSubmit = () => {
    if (!formData.truthConfirmed) {
      alert("Please confirm your identity and roster declaration.");
      return;
    }
    setMode("done");
  };

  const handleSpotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please enter your name and phone number.");
      return;
    }
    setMode("done");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070a", color: "#f1efe7", display: "flex", flexDirection: "column" }}>
      <UnifiedHeader />

      <div style={{ flex: 1, padding: "2.5rem 1.25rem 5rem", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        {/* Main Anton Paper Panel */}
        <div
          style={{
            width: "100%",
            maxWidth: "1040px",
            background: "#f1efe7",
            color: "#070707",
            borderRadius: "26px 0 0 26px",
            padding: "clamp(2rem, 5vw, 3.5rem)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
            position: "relative",
            minHeight: "75vh"
          }}
        >
          {/* Header Top Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.75rem",
              borderBottom: "1px solid rgba(7,7,7,0.18)",
              paddingBottom: "1rem"
            }}
          >
            <div style={{ fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.95rem", letterSpacing: "0.04em", color: "#070707" }}>
              {mode === "home" && "/ REGISTER / INDEX"}
              {mode === "leader" && "/ REGISTER / LEADER"}
              {mode === "join" && `/ REGISTER / JOIN / STEP ${joinStep}`}
              {mode === "on-the-spot" && "/ REGISTER / ON-THE-SPOT"}
              {mode === "status" && "/ REGISTER / STATUS-TRACKER"}
              {mode === "done" && "/ REGISTER / CONFIRMATION"}
            </div>

            <div style={{ fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.06em", color: "#8d8a82" }}>
              SIGN-UP / ILLENIUM™ 2026
            </div>
          </div>

          {/* Toast */}
          {toastMessage && (
            <div
              style={{
                position: "fixed",
                right: "24px",
                bottom: "24px",
                zIndex: 90,
                background: "#070707",
                color: "#ffffff",
                padding: "1rem 1.5rem",
                fontFamily: '"Anton", Impact, sans-serif',
                fontSize: "0.95rem",
                textTransform: "uppercase",
                borderRadius: "4px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
              }}
            >
              {toastMessage}
            </div>
          )}

          {/* PATHWAY 1: HOME PORTAL SELECTOR */}
          {mode === "home" && (
            <div>
              <h1
                style={{
                  fontFamily: '"Anton", Impact, sans-serif',
                  fontSize: "clamp(3.2rem, 8vw, 6.5rem)",
                  lineHeight: 0.88,
                  textTransform: "uppercase",
                  letterSpacing: "-0.03em",
                  margin: "0 0 1.5rem",
                  color: "#070707"
                }}
              >
                BRING YOUR<br />
                <span style={{ color: "#ff238f" }}>COLLEGE.</span>
              </h1>

              <p style={{ fontSize: "1.05rem", lineHeight: 1.5, color: "#4c4a45", maxWidth: "700px", margin: "0 0 2.5rem" }}>
                One student claims the college and becomes its Contingent Leader. They add the roster, enter the events, and collect the credentials envelope.
                Alternatively, join your college contingent with an issued code, or enter on-the-spot.
              </p>

              {/* 4 Hero Route Cards matching Anton specification */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1rem"
                }}
              >
                {/* Route Card 1: Leader */}
                <div
                  onClick={() => setMode("leader")}
                  style={{
                    background: "#070707",
                    color: "#ffffff",
                    padding: "2rem",
                    minHeight: "220px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.18s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ff238f";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#070707";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div>
                    <h3 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "2.2rem", textTransform: "uppercase", margin: 0, lineHeight: 0.95, color: "#ffffff" }}>
                      REGISTER YOUR CONTINGENT
                    </h3>
                    <p style={{ margin: "0.75rem 0 0", fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.45, fontWeight: 500 }}>
                      For the student becoming the Contingency Leader. Submit claim to Executive Core.
                    </p>
                  </div>
                  <div style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "2.5rem", alignSelf: "flex-end", color: "#ffffff" }}>↗</div>
                </div>

                {/* Route Card 2: Join */}
                <div
                  onClick={() => {
                    setMode("join");
                    setJoinStep(1);
                  }}
                  style={{
                    background: "#070707",
                    color: "#ffffff",
                    padding: "2rem",
                    minHeight: "220px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.18s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ff238f";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#070707";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div>
                    <h3 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "2.2rem", textTransform: "uppercase", margin: 0, lineHeight: 0.95, color: "#ffffff" }}>
                      JOIN A CONTINGENCY
                    </h3>
                    <p style={{ margin: "0.75rem 0 0", fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.45, fontWeight: 500 }}>
                      Enter your college&apos;s contingency code (e.g. ILLENIUM26) and start the 7-step join flow.
                    </p>
                  </div>
                  <div style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "2.5rem", alignSelf: "flex-end", color: "#ffffff" }}>↗</div>
                </div>

                {/* Route Card 3: On The Spot */}
                <div
                  onClick={() => setMode("on-the-spot")}
                  style={{
                    background: "#070707",
                    color: "#ffffff",
                    padding: "2rem",
                    minHeight: "220px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.18s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ff238f";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#070707";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div>
                    <h3 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "2.2rem", textTransform: "uppercase", margin: 0, lineHeight: 0.95, color: "#ffffff" }}>
                      ENTER ON THE DAY
                    </h3>
                    <p style={{ margin: "0.75rem 0 0", fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.45, fontWeight: 500 }}>
                      On-the-spot route for open categories and non-contingency independent entrants.
                    </p>
                  </div>
                  <div style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "2.5rem", alignSelf: "flex-end", color: "#ffffff" }}>↗</div>
                </div>

                {/* Route Card 4: Status Tracker */}
                <div
                  onClick={() => setMode("status")}
                  style={{
                    background: "#070707",
                    color: "#ffffff",
                    padding: "2rem",
                    minHeight: "220px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.18s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ff238f";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#070707";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div>
                    <h3 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "2.2rem", textTransform: "uppercase", margin: 0, lineHeight: 0.95, color: "#ffffff" }}>
                      CHECK APPROVAL STATUS
                    </h3>
                    <p style={{ margin: "0.75rem 0 0", fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.45, fontWeight: 500 }}>
                      Review progress on your Contingent Leader claim and access credentials.
                    </p>
                  </div>
                  <div style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "2.5rem", alignSelf: "flex-end", color: "#ffffff" }}>↗</div>
                </div>
              </div>
            </div>
          )}

          {/* PATHWAY 2: CONTINGENT LEADER CLAIM */}
          {mode === "leader" && (
            <div>
              <button
                type="button"
                onClick={() => setMode("home")}
                style={{ background: "none", border: "none", color: "#070707", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem" }}
              >
                ← BACK TO OPTIONS
              </button>

              <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem", color: "#070707" }}>
                CLAIM YOUR <span style={{ color: "#ff238f" }}>COLLEGE.</span>
              </h1>

              <p style={{ fontSize: "1rem", color: "#4c4a45", lineHeight: 1.5, maxWidth: "680px", margin: "0 0 1.5rem" }}>
                One student claims the college and becomes its official Contingent Leader (CL). Your application is dispatched to the Executive Core for approval.
              </p>

              <form onSubmit={handleLeaderSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "680px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                    Select Invited College
                  </label>
                  <select
                    value={formData.leaderCollege}
                    onChange={(e) => setFormData({ ...formData, leaderCollege: e.target.value })}
                    style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none", fontSize: "0.95rem" }}
                    required
                  >
                    <option value="">-- Choose your university/college --</option>
                    {INVITED_COLLEGES.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                      Leader Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Parth Parmar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                      Official Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98207 73181"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="leader@college.edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                    required
                  />
                </div>

                {/* Pink Banner Alert */}
                <div
                  style={{
                    background: "#ff238f",
                    color: "#ffffff",
                    padding: "12px 16px",
                    fontFamily: '"Anton", Impact, sans-serif',
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    margin: "0.5rem 0"
                  }}
                >
                  CL PRIVILEGE: LEADER CLAIMS THE CONTINGENT ROSTER AND COLLECTS SEALED BADGES
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", margin: "0.5rem 0" }}>
                  <input
                    type="checkbox"
                    id="leaderRules"
                    checked={formData.leaderRules}
                    onChange={(e) => setFormData({ ...formData, leaderRules: e.target.checked })}
                    style={{ width: "18px", height: "18px", marginTop: "2px" }}
                    required
                  />
                  <label htmlFor="leaderRules" style={{ fontSize: "0.85rem", color: "#333", lineHeight: 1.4, cursor: "pointer" }}>
                    I agree to the ILLENIUM™ 2026 Code of Conduct, contingency points allocations, and representation rules.
                  </label>
                </div>

                <button
                  type="submit"
                  style={{
                    border: "none",
                    background: "#070707",
                    color: "#ffffff",
                    padding: "16px 24px",
                    fontFamily: '"Anton", Impact, sans-serif',
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    marginTop: "0.5rem"
                  }}
                >
                  SUBMIT CL APPLICATION →
                </button>
              </form>
            </div>
          )}

          {/* PATHWAY 3: ON THE SPOT ENTRY (MATCHING IMAGE 1) */}
          {mode === "on-the-spot" && (
            <div>
              <button
                type="button"
                onClick={() => setMode("home")}
                style={{ background: "none", border: "none", color: "#070707", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem" }}
              >
                ← BACK TO OPTIONS
              </button>

              <h1
                style={{
                  fontFamily: '"Anton", Impact, sans-serif',
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  lineHeight: 0.88,
                  textTransform: "uppercase",
                  letterSpacing: "-0.03em",
                  margin: "0 0 1rem",
                  color: "#070707"
                }}
              >
                ENTER<br />
                ON THE<br />
                <span style={{ color: "#ff238f" }}>DAY.</span>
              </h1>

              <p style={{ fontSize: "1.05rem", color: "#4c4a45", lineHeight: 1.5, maxWidth: "720px", margin: "0 0 1.25rem" }}>
                On-the-spot entry is available only on festival days and only for events that allow it. No pre-set characters or prompts.
              </p>

              {/* Exact Pink Banner from Screenshot */}
              <div
                style={{
                  background: "#ff238f",
                  color: "#ffffff",
                  padding: "14px 18px",
                  fontFamily: '"Anton", Impact, sans-serif',
                  fontSize: "1.05rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  margin: "1.25rem 0 2rem"
                }}
              >
                WHEN THE FESTIVAL IS CLOSED, THIS FORM STAYS CLOSED.
              </div>

              <form onSubmit={handleSpotSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <h2 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.8rem", textTransform: "uppercase", margin: "0 0 1rem" }}>
                    EVENTS OPEN TO ON-THE-SPOT
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderTop: "1.5px solid #111", borderBottom: "1.5px solid #111", padding: "1.25rem 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input
                        type="checkbox"
                        id="spot-stalls"
                        checked={formData.spotEvents.includes("e-12")}
                        onChange={() => toggleSpotEvent("e-12")}
                        style={{ width: "22px", height: "22px" }}
                      />
                      <label htmlFor="spot-stalls" style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.35rem", textTransform: "uppercase", margin: 0, cursor: "pointer" }}>
                        STALLS &amp; INFORMALS <span style={{ fontSize: "0.85rem", color: "#666", fontFamily: "Arial, sans-serif" }}>18:30 &middot; QUAD</span>
                      </label>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input
                        type="checkbox"
                        id="spot-teq"
                        checked={formData.spotEvents.includes("e-02")}
                        onChange={() => toggleSpotEvent("e-02")}
                        style={{ width: "22px", height: "22px" }}
                      />
                      <label htmlFor="spot-teq" style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.35rem", textTransform: "uppercase", margin: 0, cursor: "pointer" }}>
                        TEQBALL THUNDER <span style={{ fontSize: "0.85rem", color: "#666", fontFamily: "Arial, sans-serif" }}>11:00 &middot; ATRIUM</span>
                      </label>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input
                        type="checkbox"
                        id="spot-mono"
                        checked={formData.spotEvents.includes("e-06")}
                        onChange={() => toggleSpotEvent("e-06")}
                        style={{ width: "22px", height: "22px" }}
                      />
                      <label htmlFor="spot-mono" style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.35rem", textTransform: "uppercase", margin: 0, cursor: "pointer" }}>
                        MONOCHROMATIC MASTERY <span style={{ fontSize: "0.85rem", color: "#666", fontFamily: "Arial, sans-serif" }}>09:30 &middot; STUDIO ONE</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98207 73181"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    border: "none",
                    background: "#070707",
                    color: "#ffffff",
                    padding: "16px 24px",
                    fontFamily: '"Anton", Impact, sans-serif',
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    maxWidth: "300px"
                  }}
                >
                  GET ON-THE-SPOT PASS →
                </button>
              </form>
            </div>
          )}

          {/* PATHWAY 4: 7-STEP JOIN CONTINGENT WIZARD */}
          {mode === "join" && (
            <div>
              {/* Progress Steps */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    STEP {joinStep} OF 7 &middot;{" "}
                    {joinStep === 1 && "CODE VALIDATION"}
                    {joinStep === 2 && "YOUR DETAILS"}
                    {joinStep === 3 && "PARTICIPATION TYPE"}
                    {joinStep === 4 && "DOCUMENT UPLOADS"}
                    {joinStep === 5 && "EVENT SELECTION"}
                    {joinStep === 6 && "EMERGENCY CONTACT"}
                    {joinStep === 7 && "REVIEW & DECLARATION"}
                  </div>

                  <button
                    type="button"
                    onClick={() => setMode("home")}
                    style={{ background: "none", border: "none", color: "#8d8a82", fontFamily: '"Anton", Impact, sans-serif', fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    CANCEL
                  </button>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                    <div
                      key={s}
                      style={{
                        height: "6px",
                        flex: 1,
                        background: s < joinStep ? "#070707" : s === joinStep ? "#ff238f" : "#d0cdc4",
                        transition: "background 0.2s ease"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: CODE VALIDATION */}
              {joinStep === 1 && (
                <div>
                  <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(2.8rem, 6vw, 4.8rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem" }}>
                    ENTER YOUR <span style={{ color: "#ff238f" }}>CODE.</span>
                  </h1>
                  <p style={{ fontSize: "1rem", color: "#4c4a45", lineHeight: 1.5, margin: "0 0 1.5rem" }}>
                    Enter the contingency code supplied by your college Contingent Leader (or use test code: <strong>ILLENIUM26</strong>).
                  </p>

                  <div style={{ maxWidth: "550px" }}>
                    <input
                      type="text"
                      placeholder="e.g. ILLENIUM26 or ATL26-7KQ"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      style={{ width: "100%", height: "60px", border: "2px solid #070707", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.4rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 16px", outline: "none", marginBottom: "1rem" }}
                    />

                    {formData.codeConfirmed && (
                      <div style={{ padding: "1rem 1.25rem", background: "#ffd8e9", border: "1px solid #ff238f", color: "#070707", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <CheckCircle2 size={18} style={{ color: "#ff238f" }} />
                        <span style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase" }}>
                          VERIFIED: {formData.collegeName}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setJoinStep(2)}
                      disabled={!formData.code}
                      style={{
                        border: "none",
                        background: "#070707",
                        color: "#ffffff",
                        padding: "16px 28px",
                        fontFamily: '"Anton", Impact, sans-serif',
                        fontSize: "1.1rem",
                        textTransform: "uppercase",
                        cursor: "pointer"
                      }}
                    >
                      CONTINUE TO DETAILS →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DETAILS */}
              {joinStep === 2 && (
                <div>
                  <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem" }}>
                    YOUR <span style={{ color: "#ff238f" }}>DETAILS.</span>
                  </h1>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "680px" }}>
                    <div>
                      <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "0.35rem" }}>Full Name</label>
                      <input
                        type="text"
                        placeholder="Parth Parmar"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "0.35rem" }}>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98207 73181"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "0.35rem" }}>Student Email</label>
                      <input
                        type="email"
                        placeholder="parth@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "0.35rem" }}>Passport Password</label>
                      <input
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem" }}>
                    <button
                      type="button"
                      onClick={() => setJoinStep(1)}
                      style={{ border: "1.5px solid #070707", background: "transparent", color: "#070707", padding: "14px 22px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      ← BACK
                    </button>
                    <button
                      type="button"
                      onClick={() => setJoinStep(3)}
                      style={{ border: "none", background: "#070707", color: "#ffffff", padding: "14px 28px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      CHOOSE PARTICIPATION TYPE →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PARTICIPATION CATEGORY */}
              {joinStep === 3 && (
                <div>
                  <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem" }}>
                    PARTICIPATION <span style={{ color: "#ff238f" }}>TYPE.</span>
                  </h1>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", maxWidth: "720px", margin: "1.5rem 0" }}>
                    {/* Card CC */}
                    <div
                      onClick={() => setFormData({ ...formData, joinType: "CC" })}
                      style={{
                        border: "2px solid #151515",
                        padding: "1.75rem",
                        background: formData.joinType === "CC" ? "#ff238f" : "transparent",
                        color: formData.joinType === "CC" ? "#ffffff" : "#070707",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <span style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.1rem" }}>CC / 01</span>
                      <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "2rem", margin: "0.5rem 0" }}>
                        CONTINGENT CONTENDER
                      </strong>
                      <p style={{ fontSize: "0.85rem", lineHeight: 1.4, margin: 0 }}>
                        You compete for official points toward your college&apos;s festival championship tally.
                      </p>
                    </div>

                    {/* Card PRNC */}
                    <div
                      onClick={() => setFormData({ ...formData, joinType: "PRNC" })}
                      style={{
                        border: "2px solid #151515",
                        padding: "1.75rem",
                        background: formData.joinType === "PRNC" ? "#ff238f" : "transparent",
                        color: formData.joinType === "PRNC" ? "#ffffff" : "#070707",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <span style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.1rem" }}>PRNC / 02</span>
                      <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "2rem", margin: "0.5rem 0" }}>
                        NON-COMPETING
                      </strong>
                      <p style={{ fontSize: "0.85rem", lineHeight: 1.4, margin: 0 }}>
                        Participate in workshops, open informals, and exhibitions with individual certification.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem" }}>
                    <button
                      type="button"
                      onClick={() => setJoinStep(2)}
                      style={{ border: "1.5px solid #070707", background: "transparent", color: "#070707", padding: "14px 22px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      ← BACK
                    </button>
                    <button
                      type="button"
                      onClick={() => setJoinStep(4)}
                      style={{ border: "none", background: "#070707", color: "#ffffff", padding: "14px 28px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      UPLOAD DOCUMENTS →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENTS */}
              {joinStep === 4 && (
                <div>
                  <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem" }}>
                    DOCUMENT <span style={{ color: "#ff238f" }}>UPLOADS.</span>
                  </h1>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", maxWidth: "760px", margin: "1.5rem 0" }}>
                    <div style={{ border: "2px dashed #222", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "150px" }}>
                      <div style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.4rem", textTransform: "uppercase" }}>COLLEGE STUDENT ID</div>
                      <input
                        type="file"
                        onChange={(e) => setFormData({ ...formData, collegeIdName: e.target.files?.[0]?.name || "student_id.pdf" })}
                        style={{ marginTop: "1rem", height: "auto" }}
                      />
                    </div>

                    <div style={{ border: "2px dashed #222", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "150px" }}>
                      <div style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.4rem", textTransform: "uppercase" }}>GOVERNMENT PHOTO ID</div>
                      <input
                        type="file"
                        onChange={(e) => setFormData({ ...formData, govIdName: e.target.files?.[0]?.name || "gov_id.pdf" })}
                        style={{ marginTop: "1rem", height: "auto" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem" }}>
                    <button
                      type="button"
                      onClick={() => setJoinStep(3)}
                      style={{ border: "1.5px solid #070707", background: "transparent", color: "#070707", padding: "14px 22px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      ← BACK
                    </button>
                    <button
                      type="button"
                      onClick={() => setJoinStep(5)}
                      style={{ border: "none", background: "#070707", color: "#ffffff", padding: "14px 28px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      SELECT EVENTS →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: EVENT SELECTION */}
              {joinStep === 5 && (
                <div>
                  <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem" }}>
                    SELECT <span style={{ color: "#ff238f" }}>EVENTS.</span>
                  </h1>

                  <div style={{ borderTop: "1.5px solid #111", borderBottom: "1.5px solid #111", margin: "1.5rem 0", padding: "0.5rem 0" }}>
                    {FESTIVAL_EVENTS.map((ev) => {
                      const isSelected = formData.selectedEvents.includes(ev.id);
                      return (
                        <div
                          key={ev.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "32px 1fr auto",
                            gap: "12px",
                            alignItems: "center",
                            borderBottom: "1px solid rgba(7,7,7,0.14)",
                            padding: "12px 0",
                            background: isSelected ? "#ffd8e9" : "transparent"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEvent(ev.id)}
                            style={{ width: "20px", height: "20px" }}
                          />
                          <div>
                            <div style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.25rem", textTransform: "uppercase" }}>{ev.name}</div>
                            <span style={{ fontSize: "0.75rem", color: "#666" }}>{ev.category} &middot; {ev.time} &middot; {ev.venue}</span>
                          </div>
                          <span style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "0.85rem", color: isSelected ? "#ff238f" : "#999" }}>
                            {isSelected ? "SELECTED" : "AVAILABLE"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem" }}>
                    <button
                      type="button"
                      onClick={() => setJoinStep(4)}
                      style={{ border: "1.5px solid #070707", background: "transparent", color: "#070707", padding: "14px 22px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      ← BACK
                    </button>
                    <button
                      type="button"
                      onClick={() => setJoinStep(6)}
                      style={{ border: "none", background: "#070707", color: "#ffffff", padding: "14px 28px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      EMERGENCY CONTACT →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: EMERGENCY CONTACT */}
              {joinStep === 6 && (
                <div>
                  <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem" }}>
                    EMERGENCY <span style={{ color: "#ff238f" }}>CONTACT.</span>
                  </h1>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "680px", margin: "1.5rem 0" }}>
                    <div>
                      <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "0.35rem" }}>Contact Name</label>
                      <input
                        type="text"
                        placeholder="Parent / Guardian Name"
                        value={formData.emergencyName}
                        onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                        style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "0.35rem" }}>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98200 12345"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                        style={{ width: "100%", height: "54px", border: "1.5px solid #161616", background: "transparent", padding: "0 14px", outline: "none" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem" }}>
                    <button
                      type="button"
                      onClick={() => setJoinStep(5)}
                      style={{ border: "1.5px solid #070707", background: "transparent", color: "#070707", padding: "14px 22px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      ← BACK
                    </button>
                    <button
                      type="button"
                      onClick={() => setJoinStep(7)}
                      style={{ border: "none", background: "#070707", color: "#ffffff", padding: "14px 28px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      REVIEW &amp; DECLARE →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: REVIEW & DECLARE */}
              {joinStep === 7 && (
                <div>
                  <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem" }}>
                    REVIEW &amp; <span style={{ color: "#ff238f" }}>CONFIRM.</span>
                  </h1>

                  <div style={{ borderTop: "2px solid #111", margin: "1.5rem 0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1rem", padding: "14px 0", borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                      <span style={{ fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase" }}>COLLEGE</span>
                      <span>{formData.collegeName || "Atlas SkillTech University"}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1rem", padding: "14px 0", borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                      <span style={{ fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase" }}>PARTICIPANT</span>
                      <span>{formData.fullName || "Parth Parmar"} ({formData.phone})</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1rem", padding: "14px 0", borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                      <span style={{ fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase" }}>PARTICIPATION TYPE</span>
                      <span>{formData.joinType === "CC" ? "Contingent Contender (Points Active)" : "Non-Competing Individual"}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1rem", padding: "14px 0", borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                      <span style={{ fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase" }}>EVENTS</span>
                      <span>{formData.selectedEvents.length} Selected</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", margin: "1.5rem 0" }}>
                    <input
                      type="checkbox"
                      id="truth"
                      checked={formData.truthConfirmed}
                      onChange={(e) => setFormData({ ...formData, truthConfirmed: e.target.checked })}
                      style={{ width: "20px", height: "20px", marginTop: "2px" }}
                      required
                    />
                    <label htmlFor="truth" style={{ fontSize: "0.85rem", color: "#333", lineHeight: 1.4, cursor: "pointer" }}>
                      I solemnly affirm that the submitted documents and college identity belong to me and adhere to all ILLENIUM™ regulations.
                    </label>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => setJoinStep(6)}
                      style={{ border: "1.5px solid #070707", background: "transparent", color: "#070707", padding: "14px 22px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      ← BACK
                    </button>
                    <button
                      type="button"
                      onClick={handleJoinSubmit}
                      style={{ border: "none", background: "#ff238f", color: "#ffffff", padding: "14px 32px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.1rem", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      COMPLETE REGISTRATION →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PATHWAY 5: STATUS TRACKER */}
          {mode === "status" && (
            <div>
              <button
                type="button"
                onClick={() => setMode("home")}
                style={{ background: "none", border: "none", color: "#070707", fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem" }}
              >
                ← BACK TO OPTIONS
              </button>

              <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem", color: "#070707" }}>
                CONTINGENT <span style={{ color: "#ff238f" }}>STATUS.</span>
              </h1>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "2px solid #111", borderBottom: "2px solid #111", margin: "2rem 0" }}>
                <div style={{ padding: "1.5rem 1rem", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff238f", marginBottom: "0.75rem" }} />
                  <strong style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.35rem", textTransform: "uppercase", display: "block" }}>1. APPLICATION SENT</strong>
                  <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.3rem 0 0" }}>Dispatched to Central OC &amp; Executive Core</p>
                </div>
                <div style={{ padding: "1.5rem 1rem", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff238f", marginBottom: "0.75rem" }} />
                  <strong style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.35rem", textTransform: "uppercase", display: "block" }}>2. IDENTITY REVIEW</strong>
                  <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.3rem 0 0" }}>Student credentials verified against university list</p>
                </div>
                <div style={{ padding: "1.5rem 1rem" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff238f", marginBottom: "0.75rem" }} />
                  <strong style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "1.35rem", textTransform: "uppercase", display: "block" }}>3. CODE GENERATED</strong>
                  <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.3rem 0 0" }}>Contingency code active for college roster</p>
                </div>
              </div>

              {/* Code Box */}
              <div style={{ background: "#070707", color: "#ffffff", padding: "1.75rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontFamily: '"Anton", Impact, sans-serif', letterSpacing: "0.06em", color: "#8d8a82" }}>ISSUED CONTINGENCY CODE</span>
                  <div style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "2.8rem", letterSpacing: "0.08em", color: "#ff238f" }}>ILLENIUM26</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("ILLENIUM26");
                    showToast("Contingency Code Copied!");
                  }}
                  style={{ background: "#ff238f", border: "none", color: "#ffffff", padding: "12px 18px", fontFamily: '"Anton", Impact, sans-serif', fontSize: "0.95rem", textTransform: "uppercase", cursor: "pointer" }}
                >
                  COPY CODE
                </button>
              </div>
            </div>
          )}

          {/* PATHWAY 6: CONFIRMATION DONE */}
          {mode === "done" && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#ff238f", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <CheckCircle2 size={36} />
              </div>

              <h1 style={{ fontFamily: '"Anton", Impact, sans-serif', fontSize: "clamp(3rem, 7vw, 5rem)", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 1rem" }}>
                REGISTRATION<br /><span style={{ color: "#ff238f" }}>COMPLETED.</span>
              </h1>

              <p style={{ fontSize: "1.1rem", color: "#4c4a45", maxWidth: "600px", margin: "0 auto 2rem", lineHeight: 1.5 }}>
                Your participant pass has been recorded in the ILLENIUM™ 2026 database. Sign in to your passport portal to view your QR badge.
              </p>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href="/auth/login"
                  style={{
                    border: "none",
                    background: "#070707",
                    color: "#ffffff",
                    padding: "16px 28px",
                    fontFamily: '"Anton", Impact, sans-serif',
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <span>SIGN IN TO PORTAL</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/events"
                  style={{
                    border: "1.5px solid #070707",
                    background: "transparent",
                    color: "#070707",
                    padding: "16px 28px",
                    fontFamily: '"Anton", Impact, sans-serif',
                    fontSize: "1.1rem",
                    textTransform: "uppercase"
                  }}
                >
                  BROWSE 22 EVENTS
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
