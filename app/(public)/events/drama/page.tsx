"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicNav } from "@/components/layout/public-nav";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Flame,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Ticket
} from "lucide-react";

const DRAMA_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80",
    caption: "The Quad Stage 360° Arena filled with spectators during the Street Play finals."
  },
  {
    url: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80",
    caption: "Contingent troupe performing coordinated choral formations and physical theatre."
  },
  {
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    caption: "Live acoustic percussion and rhythmic beats setting the cadence for the satire."
  },
  {
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    caption: "Audience surrounding the open-air perimeter in front of the campus building."
  },
  {
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    caption: "Dramatic monologue delivered with acoustic vocal resonance."
  },
  {
    url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    caption: "Contingent team celebration after sealing the official score evaluation."
  }
];

export default function DramaEventPage() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setActivePhotoIndex(index);
  const closeLightbox = () => setActivePhotoIndex(null);

  const prevPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + DRAMA_PHOTOS.length - 1) % DRAMA_PHOTOS.length);
    }
  };

  const nextPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % DRAMA_PHOTOS.length);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--bone)", display: "flex", flexDirection: "column" }}>
      {/* Universal Public Navigation */}
      <PublicNav />

      {/* Main Content Container */}
      <main style={{ flex: 1, maxWidth: "1240px", margin: "0 auto", padding: "2rem 1.5rem 5rem", width: "100%" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <Link
            href="/events"
            className="btn btn-secondary btn-sm"
            style={{
              gap: "0.4rem",
              background: "var(--bg-surface)",
              borderColor: "var(--line)"
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to All Events</span>
          </Link>
          <span style={{ color: "var(--dim)", fontSize: "0.85rem" }}>/</span>
          <span style={{ fontSize: "0.85rem", color: "var(--bone-dim)" }}>Programme</span>
          <span style={{ color: "var(--dim)", fontSize: "0.85rem" }}>/</span>
          <span style={{ fontSize: "0.85rem", color: "#ff238f", fontWeight: 600 }}>D.R.A.M.A (Street Play)</span>
        </div>

        {/* 1. HERO SECTION */}
        <section
          style={{
            position: "relative",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            padding: "3.5rem 2.5rem",
            background: "linear-gradient(135deg, rgba(24, 22, 34, 0.95) 0%, rgba(9, 8, 14, 0.98) 100%)",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow-lg)",
            marginBottom: "3rem"
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "450px",
              height: "450px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 35, 143, 0.15) 0%, transparent 70%)",
              pointerEvents: "none"
            }}
          />

          <div style={{ position: "relative", zIndex: 1, maxWidth: "880px" }}>
            {/* Badges Bar */}
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  background: "rgba(255, 35, 143, 0.15)",
                  border: "1px solid rgba(255, 35, 143, 0.15)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#ff238f",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase"
                }}
              >
                <Sparkles size={13} />
                Flagship Vertical · E-105
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "999px",
                  background: "rgba(255, 35, 143, 0.15)",
                  border: "1px solid rgba(255, 35, 143, 0.15)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#ff238f",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase"
                }}
              >
                <Trophy size={13} />
                Level 2 Contingent Event
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "999px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--success)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase"
                }}
              >
                <CheckCircle2 size={13} />
                Registration Open
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: "1rem"
              }}
            >
              D.R.A.M.A{" "}
              <span style={{ fontSize: "0.65em", color: "var(--bone-dim)", fontWeight: 500 }}>
                (Street Play)
              </span>
            </h1>

            {/* Tagline */}
            <p
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                color: "var(--bone-dim)",
                lineHeight: 1.6,
                marginBottom: "2rem",
                maxWidth: "720px"
              }}
            >
              High-octane satire, choral movement, and raw acoustic storytelling in the center of the crowd.
              Contingents battle for championship points on the open Quad Stage.
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <Link href="/register" className="btn btn-primary btn-lg" style={{ gap: "0.6rem" }}>
                <span>Register Contingent Entry</span>
                <ArrowUpRight size={18} />
              </Link>

              <Link
                href="/participant/bidding"
                className="btn btn-secondary btn-lg"
                style={{ gap: "0.6rem" }}
              >
                <Flame size={18} style={{ color: "#ff238f" }} />
                <span>Contingent Bidding (+15 / -8)</span>
              </Link>
            </div>
          </div>

          {/* Quick Summary Pill Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginTop: "2.5rem",
              paddingTop: "1.75rem",
              borderTop: "1px solid var(--line)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Calendar size={18} style={{ color: "#ff238f" }} />
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Date</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>Saturday, 28 Nov 2026</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Clock size={18} style={{ color: "#ff238f" }} />
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Time</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>16:30 IST (Report 16:00)</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <MapPin size={18} style={{ color: "#ff238f" }} />
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Venue</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>Quad Stage (Open Air)</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Users size={18} style={{ color: "var(--gold)" }} />
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--dim)", textTransform: "uppercase" }}>Team Size</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>8 to 15 Performers</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ABOUT THE DRAMA COMPETITION */}
        <section style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ color: "#ff238f", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              01 · Overview
            </span>
          </div>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>About the Drama Competition</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.5rem"
            }}
          >
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--bone)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={18} style={{ color: "#ff238f" }} />
                Pure Campus Street Theatre
              </h3>
              <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.7, color: "var(--bone-dim)" }}>
                D.R.A.M.A is the headline theatre competition of ILLENIUM 2026. Performing troupes command the open-air
                Quad in front of hundreds of students and faculty without audio amplification, microphones, or pre-recorded tracks.
                Everything hinges on vocal power, crisp formations, body percussion, and biting contemporary commentary.
              </p>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--bone)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Trophy size={18} style={{ color: "var(--gold)" }} />
                Championship Impact
              </h3>
              <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.7, color: "var(--bone-dim)" }}>
                As a Level 2 flagship competition, D.R.A.M.A carries major points toward the overall ILLENIUM Trophy.
                The points scored are credited directly to the college contingent tally, not individual actors.
                Contingent Leaders can also stake contingent prediction bids before the 15:30 deadline for bonus points.
              </p>
            </div>
          </div>
        </section>

        {/* 3. EVENT SPECIFICATION GRID */}
        <section style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ color: "#ff238f", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              02 · Specifications
            </span>
          </div>
          <h2 style={{ fontSize: "2rem", marginBottom: "1.25rem" }}>Official Competition Parameters</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem"
            }}
          >
            <div className="card" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--dim)", marginBottom: "0.3rem" }}>
                Event Identifier
              </div>
              <div className="mono" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ff238f" }}>
                E-105 · D.R.A.M.A
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                Vertical: Theatre &amp; Performing Arts
              </div>
            </div>

            <div className="card" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--dim)", marginBottom: "0.3rem" }}>
                Schedule &amp; Reporting
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--bone)" }}>
                16:30 – 18:00 IST
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                Mandatory Stage Desk Check-in: 16:00 IST
              </div>
            </div>

            <div className="card" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--dim)", marginBottom: "0.3rem" }}>
                Arena &amp; Staging
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--bone)" }}>
                Quad Stage
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                Atlas SkillTech Campus · 360° Circular Arena
              </div>
            </div>

            <div className="card" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--dim)", marginBottom: "0.3rem" }}>
                Team Configuration
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--bone)" }}>
                8 to 15 Performers
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                Contingent entry with verified CL roster
              </div>
            </div>

            <div className="card" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--dim)", marginBottom: "0.3rem" }}>
                Accreditation Pass
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--success)" }}>
                Day 1 RFID Wristband
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                Scanned via OC Scanner at backstage perimeter
              </div>
            </div>

            <div className="card" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--dim)", marginBottom: "0.3rem" }}>
                Bidding &amp; Stakes
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ff238f" }}>
                +15 Win / -8 Penalty
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--bone-dim)", marginTop: "0.25rem" }}>
                CL Bid Lock Deadline: 15:30 IST
              </div>
            </div>
          </div>
        </section>

        {/* 4. RULES & FORMAT SECTION */}
        <section style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ color: "#ff238f", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              03 · Rules &amp; Guidelines
            </span>
          </div>
          <h2 style={{ fontSize: "2rem", marginBottom: "1.25rem" }}>Competition Format &amp; Protocols</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr",
                alignItems: "flex-start",
                gap: "1.25rem",
                padding: "1.5rem"
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255, 35, 143, 0.15)",
                  border: "1px solid rgba(255, 35, 143, 0.15)",
                  color: "#ff238f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "1.1rem"
                }}
              >
                01
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>Acoustic Authenticity &amp; Sound</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--bone-dim)", lineHeight: 1.6 }}>
                  Performances must be entirely acoustic. No electronic microphones, sound consoles, collar mics, or recorded
                  audio tracks are permitted. Traditional live acoustic instruments (e.g. dholak, dafli, morchang, ghungroo, tambourines)
                  are permitted and encouraged.
                </p>
              </div>
            </div>

            <div
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr",
                alignItems: "flex-start",
                gap: "1.25rem",
                padding: "1.5rem"
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255, 35, 143, 0.15)",
                  border: "1px solid rgba(255, 35, 143, 0.15)",
                  color: "#ff238f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "1.1rem"
                }}
              >
                02
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>360-Degree Staging &amp; Audience Boundary</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--bone-dim)", lineHeight: 1.6 }}>
                  The Quad Stage is an open circular arena with audience on all sides. Choreography and voice projection
                  must actively engage the entire perimeter. Touching or physically pulling audience members into the acting circle
                  is prohibited.
                </p>
              </div>
            </div>

            <div
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr",
                alignItems: "flex-start",
                gap: "1.25rem",
                padding: "1.5rem"
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255, 35, 143, 0.15)",
                  border: "1px solid rgba(255, 35, 143, 0.15)",
                  color: "#ff238f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "1.1rem"
                }}
              >
                03
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>Props, Costumes &amp; Campus Cleanliness</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--bone-dim)", lineHeight: 1.6 }}>
                  Props must be handheld and self-managed. Usage of fire, hazardous chemicals, liquids, live animals, or colored powder
                  that damages campus property is strictly banned and causes immediate disqualification. All props must be cleared
                  within 60 seconds of performance conclusion.
                </p>
              </div>
            </div>

            <div
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr",
                alignItems: "flex-start",
                gap: "1.25rem",
                padding: "1.5rem"
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255, 200, 55, 0.1)",
                  border: "1px solid rgba(255, 200, 55, 0.3)",
                  color: "var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "1.1rem"
                }}
              >
                04
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>Judge Rubric &amp; Score Criteria</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--bone-dim)", lineHeight: 1.6 }}>
                  Performances are evaluated by official industry judges across 3 core criteria (0–100 scale):
                  <strong style={{ color: "var(--bone)" }}> Technique &amp; Form</strong> (vocal clarity, blocking, timing),
                  <strong style={{ color: "var(--bone)" }}> Musicality &amp; Rhythm</strong> (meter, percussion, flow), and
                  <strong style={{ color: "var(--bone)" }}> Stage Impact</strong> (crowd response, emotional resonance, satirical bite).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PHOTO GALLERY & LIGHTBOX */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <span style={{ color: "#ff238f", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  04 · Archive
                </span>
              </div>
              <h2 style={{ fontSize: "2rem" }}>Quad Stage Moments &amp; Gallery</h2>
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--dim)" }}>
              Click any photograph to view high-resolution archive preview
            </span>
          </div>

          {/* Asymmetric Gallery Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.25rem"
            }}
          >
            {DRAMA_PHOTOS.map((photo, index) => (
              <div
                key={photo.url}
                onClick={() => openLightbox(index)}
                className="card card-interactive"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  group: "true"
                } as React.CSSProperties}
              >
                <div style={{ position: "relative", width: "100%", height: "240px", overflow: "hidden" }}>
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(9, 8, 14, 0.9) 0%, transparent 60%)",
                      pointerEvents: "none"
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      right: "0.75rem",
                      background: "rgba(9, 8, 14, 0.7)",
                      backdropFilter: "blur(6px)",
                      borderRadius: "6px",
                      padding: "0.35rem",
                      color: "var(--bone)",
                      border: "1px solid var(--line)"
                    }}
                  >
                    <Maximize2 size={14} />
                  </div>
                </div>

                <div style={{ padding: "1rem 1.25rem" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", margin: 0, lineHeight: 1.5 }}>
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CALL TO ACTION FOOTER */}
        <section
          style={{
            textAlign: "center",
            padding: "3.5rem 2rem",
            background: "var(--bg-surface)",
            border: "1px solid var(--line-strong)",
            borderRadius: "var(--radius-lg)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "400px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #ff238f, transparent)"
            }}
          />
          <h2 style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>Claim Your Contingent Slot</h2>
          <p style={{ maxWidth: "560px", margin: "0 auto 2rem", color: "var(--bone-dim)", fontSize: "1rem", lineHeight: 1.6 }}>
            Contingent Leaders must finalize their 8–15 member theatre roster before the orientation deadline.
            Secure wristbands at the accreditation desk.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-primary btn-lg" style={{ gap: "0.5rem" }}>
              <Ticket size={18} />
              <span>Register Contingent</span>
            </Link>
            <Link href="/events" className="btn btn-secondary btn-lg" style={{ gap: "0.5rem" }}>
              <span>View Full Festival Schedule</span>
            </Link>
          </div>
        </section>
      </main>

      {/* LIGHTBOX MODAL */}
      {activePhotoIndex !== null && (
        <div
          className="scrim active"
          onClick={closeLightbox}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "1000px",
              width: "100%",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--line-strong)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-lg)",
              animation: "fadeIn 0.2s ease"
            }}
          >
            {/* Modal Top Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid var(--line)",
                background: "var(--bg-surface)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="mono" style={{ color: "#ff238f", fontSize: "0.85rem", fontWeight: 700 }}>
                  Archive Photo #{String(activePhotoIndex + 1).padStart(2, "0")} / {String(DRAMA_PHOTOS.length).padStart(2, "0")}
                </span>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                className="btn btn-ghost btn-sm"
                style={{ padding: "0.3rem" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image Display */}
            <div style={{ position: "relative", width: "100%", maxHeight: "65vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={DRAMA_PHOTOS[activePhotoIndex].url}
                alt={DRAMA_PHOTOS[activePhotoIndex].caption}
                style={{
                  maxWidth: "100%",
                  maxHeight: "65vh",
                  objectFit: "contain",
                  display: "block"
                }}
              />

              {/* Prev / Next Navigation Controls */}
              <button
                type="button"
                onClick={prevPhoto}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(9, 8, 14, 0.75)",
                  border: "1px solid var(--line-strong)",
                  color: "var(--bone)",
                  borderRadius: "50%",
                  width: "42px",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={nextPhoto}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(9, 8, 14, 0.75)",
                  border: "1px solid var(--line-strong)",
                  color: "var(--bone)",
                  borderRadius: "50%",
                  width: "42px",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Modal Caption Footer */}
            <div
              style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid var(--line)",
                background: "var(--bg-surface)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--bone)" }}>
                {DRAMA_PHOTOS[activePhotoIndex].caption}
              </p>
              <span className="mono" style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                Press ESC or click outside to close
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
