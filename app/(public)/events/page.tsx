"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UnifiedHeader } from "@/components/layout/unified-header";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Trophy,
  Filter,
  Users,
  Search,
  CheckCircle2,
  Layers,
  ChevronDown
} from "lucide-react";

interface EventItem {
  id: string;
  code: string;
  name: string;
  category: "Performing Arts" | "Informals & Sports" | "Fine Arts" | "Business & Management" | "Theatre & Drama" | "Literary & Quiz";
  venue: string;
  time: string;
  level: "L3" | "L2" | "L1";
  description: string;
  eventType: string;
  teamSize: string;
  status: "open" | "flagship";
  slug?: string;
}

const ALL_FESTIVAL_EVENTS: EventItem[] = [
  {
    id: "e-01",
    code: "E-101",
    name: "SEVEN TO SMOKE",
    category: "Performing Arts",
    venue: "Main Auditorium",
    time: "Day 1 · 11:00 IST",
    level: "L3",
    description: "The premier 1v1 cypher battle where dancers battle back-to-back until seven consecutive victories.",
    eventType: "Individual (Solo)",
    teamSize: "1 Dancer",
    status: "flagship"
  },
  {
    id: "e-02",
    code: "E-102",
    name: "TEQBALL THUNDER",
    category: "Informals & Sports",
    venue: "Open Atrium",
    time: "Day 1 · 11:00 IST",
    level: "L2",
    description: "Curved table-tennis soccer showdown requiring pinpoint ball mastery, agility, and split-second headers.",
    eventType: "Pairs (2 Contenders)",
    teamSize: "2 Players",
    status: "open"
  },
  {
    id: "e-03",
    code: "E-103",
    name: "DESI TO DRIP",
    category: "Performing Arts",
    venue: "Main Auditorium",
    time: "Day 1 · 14:00 IST",
    level: "L3",
    description: "High-fashion runway choreography merging indigenous textiles with futuristic streetwear aesthetics.",
    eventType: "Contingent Squad",
    teamSize: "8–10 Models",
    status: "flagship"
  },
  {
    id: "e-04",
    code: "E-104",
    name: "MR. & MS. ILLENIUM™",
    category: "Informals & Sports",
    venue: "Atrium Stage",
    time: "Day 1 · 14:00 IST",
    level: "L3",
    description: "The definitive personality and stage-presence pageant testing wit, talent, and crowd charisma.",
    eventType: "Pairs",
    teamSize: "2 Contenders",
    status: "flagship"
  },
  {
    id: "e-05",
    code: "E-105",
    name: "D.R.A.M.A (STREET PLAY)",
    category: "Theatre & Drama",
    venue: "Quad Stage (Open Air)",
    time: "Day 1 · 16:30 IST",
    level: "L3",
    description: "High-octane satire, choral movement, and commanding street theatre in front of the campus crowd.",
    eventType: "Contingent Squad",
    teamSize: "8–15 Performers",
    status: "flagship",
    slug: "drama"
  },
  {
    id: "e-06",
    code: "E-106",
    name: "MONOCHROMATIC MASTERY",
    category: "Fine Arts",
    venue: "Studio One",
    time: "Day 1 · 09:30 IST",
    level: "L1",
    description: "Live black, white, and grayscale canvas creation under strict 90-minute time limits.",
    eventType: "Individual (Solo)",
    teamSize: "1 Artist",
    status: "open"
  },
  {
    id: "e-07",
    code: "E-107",
    name: "ANI-MATE YOUR FATE",
    category: "Fine Arts",
    venue: "Studio One",
    time: "Day 1 · 11:00 IST",
    level: "L1",
    description: "Sequential storytelling and comic book visual narrative live contest.",
    eventType: "Pairs",
    teamSize: "2 Artists",
    status: "open"
  },
  {
    id: "e-08",
    code: "E-108",
    name: "SUSTAINACITY",
    category: "Business & Management",
    venue: "Quad Arena Room 2",
    time: "Day 1 · 14:00 IST",
    level: "L2",
    description: "Urban venture crisis simulation pitching circular economy systems to a corporate panel.",
    eventType: "Team",
    teamSize: "4 Analysts",
    status: "open"
  },
  {
    id: "e-09",
    code: "E-109",
    name: "MIRROR, MIRROR",
    category: "Fine Arts",
    venue: "Studio One",
    time: "Day 1 · 16:30 IST",
    level: "L2",
    description: "Dual-perspective portraiture and reflective canvas creation contest.",
    eventType: "Pairs",
    teamSize: "2 Artists",
    status: "open"
  },
  {
    id: "e-10",
    code: "E-110",
    name: "VINTAGE VOGUE",
    category: "Informals & Sports",
    venue: "Quad Arena",
    time: "Day 1 · 16:30 IST",
    level: "L2",
    description: "Retro lifestyle cosplay and vintage styling contest across bygone decades.",
    eventType: "Contingent",
    teamSize: "8–15 Stylists",
    status: "open"
  },
  {
    id: "e-11",
    code: "E-111",
    name: "HOMEROOM HARMONIES",
    category: "Performing Arts",
    venue: "Main Auditorium",
    time: "Day 1 · 18:30 IST",
    level: "L2",
    description: "A cappella choral arrangement and contemporary vocal counterpoint competition.",
    eventType: "Team",
    teamSize: "4–8 Vocalists",
    status: "open"
  },
  {
    id: "e-12",
    code: "E-112",
    name: "ADVERTAINMENT",
    category: "Business & Management",
    venue: "Quad Arena Room 1",
    time: "Day 2 · 10:00 IST",
    level: "L2",
    description: "Live satirical commercial creation and rapid brand repositioning battle.",
    eventType: "Team",
    teamSize: "3–5 Marketers",
    status: "open"
  },
  {
    id: "e-13",
    code: "E-113",
    name: "DESIGN & DECIBELS",
    category: "Fine Arts",
    venue: "Studio One",
    time: "Day 2 · 11:30 IST",
    level: "L2",
    description: "Live digital audio visualizer design synced with unpredictable live beat drops.",
    eventType: "Pairs",
    teamSize: "2 Creators",
    status: "open"
  },
  {
    id: "e-14",
    code: "E-114",
    name: "FILMY FATKA",
    category: "Literary & Quiz",
    venue: "Atrium Stage",
    time: "Day 2 · 11:30 IST",
    level: "L1",
    description: "Rapid Bollywood and World Cinema buzzer showdown with blind scene identification.",
    eventType: "Pairs",
    teamSize: "2 Cinephiles",
    status: "open"
  },
  {
    id: "e-15",
    code: "E-115",
    name: "J.A.M (JUST A MINUTE)",
    category: "Literary & Quiz",
    venue: "Studio One",
    time: "Day 2 · 13:30 IST",
    level: "L2",
    description: "High-pressure impromptu speaking testing hesitation, deviation, and grammatical slips.",
    eventType: "Individual",
    teamSize: "1 Speaker",
    status: "open"
  },
  {
    id: "e-16",
    code: "E-116",
    name: "LAST SHIP OUT",
    category: "Business & Management",
    venue: "Quad Arena Room 2",
    time: "Day 2 · 13:30 IST",
    level: "L3",
    description: "Geopolitical supply chain crisis management war-game.",
    eventType: "Team",
    teamSize: "4 Strategists",
    status: "flagship"
  },
  {
    id: "e-17",
    code: "E-117",
    name: "MASTER OF THE STREETS",
    category: "Performing Arts",
    venue: "Quad Stage (Open Air)",
    time: "Day 2 · 15:00 IST",
    level: "L3",
    description: "All-styles crew battle for street dance supremacy with open-air cypher bracket.",
    eventType: "Crew",
    teamSize: "5–8 Dancers",
    status: "flagship"
  },
  {
    id: "e-18",
    code: "E-118",
    name: "PORTFOLIO PIONEERS",
    category: "Business & Management",
    venue: "Quad Arena Room 1",
    time: "Day 2 · 15:00 IST",
    level: "L2",
    description: "Live venture capital simulated seed-round investment pitch matrix.",
    eventType: "Pairs",
    teamSize: "2 Founders",
    status: "open"
  },
  {
    id: "e-19",
    code: "E-119",
    name: "QUIZ AND LADDERS",
    category: "Literary & Quiz",
    venue: "Main Auditorium",
    time: "Day 2 · 15:30 IST",
    level: "L2",
    description: "General knowledge quiz with strategic ladder modifiers and risk-reward betting.",
    eventType: "Pairs",
    teamSize: "2 Quizzers",
    status: "open"
  },
  {
    id: "e-20",
    code: "E-120",
    name: "SPIN AND SWING",
    category: "Informals & Sports",
    venue: "Open Atrium",
    time: "Day 2 · 16:30 IST",
    level: "L1",
    description: "Precision table tennis and target swing accuracy sports tournament.",
    eventType: "Pairs",
    teamSize: "2 Players",
    status: "open"
  },
  {
    id: "e-21",
    code: "E-121",
    name: "TWIST AND TALES",
    category: "Literary & Quiz",
    venue: "Studio One",
    time: "Day 2 · 16:30 IST",
    level: "L1",
    description: "Creative micro-fiction battle with prompt twists injected every 15 minutes.",
    eventType: "Individual",
    teamSize: "1 Writer",
    status: "open"
  },
  {
    id: "e-22",
    code: "E-122",
    name: "WHOSE PLOT IS IT ANYWAY?",
    category: "Theatre & Drama",
    venue: "Main Auditorium",
    time: "Day 2 · 17:30 IST",
    level: "L3",
    description: "Improv theatrical comedy contest responding to live audience prompts without script.",
    eventType: "Team",
    teamSize: "4 Comedians",
    status: "flagship"
  }
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"directory" | "schedule">("directory");
  const [scheduleDay, setScheduleDay] = useState<"1" | "2">("1");

  const categories = [
    "All",
    "Performing Arts",
    "Theatre & Drama",
    "Fine Arts",
    "Informals & Sports",
    "Business & Management",
    "Literary & Quiz"
  ];

  const filteredEvents = ALL_FESTIVAL_EVENTS.filter((ev) => {
    const matchesCategory = selectedCategory === "All" || ev.category === selectedCategory;
    const matchesSearch =
      ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--bone)", display: "flex", flexDirection: "column" }}>
      <UnifiedHeader />

      <main style={{ flex: 1, maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem 6rem", width: "100%" }}>
        {/* Header Hero */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              background: "rgba(216, 255, 46, 0.1)",
              border: "1px solid rgba(216, 255, 46, 0.3)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--acid)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "0.85rem"
            }}
          >
            <Sparkles size={13} />
            ILLENIUM 2026 Programme &middot; 28 &amp; 29 November 2026
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
            Twenty <span style={{ color: "var(--acid)" }}>Events.</span> Five Venues.
          </h1>

          <p style={{ marginTop: "0.85rem", fontSize: "1.05rem", color: "var(--bone-dim)", maxWidth: "720px", lineHeight: 1.6 }}>
            Level three carries the most championship points and every level three event is open to contingents.
            Points go to the college tally, not the individual. Explore briefs, venues, schedules, and dedicated arenas.
          </p>

          {/* Primary View Switcher */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem" }}>
            <button
              type="button"
              onClick={() => setActiveTab("directory")}
              className={`btn ${activeTab === "directory" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.875rem" }}
            >
              <Layers size={15} />
              <span>Events Directory ({ALL_FESTIVAL_EVENTS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`btn ${activeTab === "schedule" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.875rem" }}
            >
              <Calendar size={15} />
              <span>5-Venue Master Timetable</span>
            </button>
          </div>
        </div>

        {/* Featured Banner: DRAMA Microsite Callout */}
        <div
          style={{
            padding: "1.5rem 2rem",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, rgba(216, 255, 46, 0.08) 0%, rgba(18, 16, 25, 0.95) 100%)",
            border: "1px solid rgba(216, 255, 46, 0.3)",
            marginBottom: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <span className="badge badge-acid" style={{ fontSize: "0.7rem" }}>Featured Competition Microsite</span>
              <span className="mono" style={{ fontSize: "0.75rem", color: "var(--acid)" }}>E-105 · Quad Stage</span>
            </div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0 }}>
              D.R.A.M.A (Street Play) Dedicated Arena
            </h3>
            <p style={{ margin: "0.35rem 0 0", color: "var(--bone-dim)", fontSize: "0.875rem", maxWidth: "680px" }}>
              Explore the dedicated event arena featuring competition briefing, acoustic guidelines,
              360° Quad Stage rules, and live performance archive.
            </p>
          </div>

          <Link
            href="/events/drama"
            className="btn btn-primary btn-md"
            style={{ gap: "0.5rem", fontWeight: 700 }}
          >
            <span>Open Drama Microsite</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {activeTab === "directory" ? (
          <>
            {/* Search & Filter Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem"
              }}
            >
              {/* Category Pills */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  overflowX: "auto",
                  paddingBottom: "0.25rem",
                  maxWidth: "100%"
                }}
              >
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: "0.4rem 0.85rem",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: isActive ? 600 : 500,
                        background: isActive ? "var(--acid)" : "var(--bg-surface)",
                        color: isActive ? "var(--ink)" : "var(--bone-dim)",
                        border: isActive ? "1px solid var(--acid)" : "1px solid var(--line)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Instant Search Bar */}
              <div style={{ position: "relative", minWidth: "260px", flex: "1 1 260px", maxWidth: "360px" }}>
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--dim)"
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search 22 events by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "36px", fontSize: "0.85rem" }}
                />
              </div>
            </div>

            {/* Events Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "1.5rem"
              }}
            >
              {filteredEvents.map((event) => {
                const isDrama = event.slug === "drama";

                return (
                  <article
                    key={event.id}
                    className="card card-interactive"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderColor: isDrama ? "rgba(216, 255, 46, 0.4)" : "var(--line)",
                      background: isDrama ? "rgba(24, 22, 34, 0.9)" : "var(--bg-card)"
                    }}
                  >
                    <div>
                      {/* Card Meta Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>
                            {event.category}
                          </span>
                          <span
                            className="badge"
                            style={{
                              fontSize: "0.65rem",
                              background: event.level === "L3" ? "rgba(216, 255, 46, 0.15)" : "rgba(255, 255, 255, 0.05)",
                              color: event.level === "L3" ? "var(--acid)" : "var(--bone-dim)",
                              border: `1px solid ${event.level === "L3" ? "rgba(216, 255, 46, 0.3)" : "var(--line)"}`
                            }}
                          >
                            {event.level} Championship
                          </span>
                        </div>
                        <span className="mono" style={{ fontSize: "0.75rem", color: isDrama ? "var(--acid)" : "var(--dim)", fontWeight: 600 }}>
                          {event.code}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
                        {event.name}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--bone-dim)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                        {event.description}
                      </p>

                      {/* Spec Pills */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: "var(--dim)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <MapPin size={13} style={{ color: "var(--bone-dim)" }} />
                          <span>{event.venue}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Clock size={13} style={{ color: "var(--bone-dim)" }} />
                          <span>{event.time}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Users size={13} style={{ color: "var(--bone-dim)" }} />
                          <span>{event.eventType} ({event.teamSize})</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "1rem",
                        borderTop: "1px solid var(--line)"
                      }}
                    >
                      {isDrama ? (
                        <Link
                          href="/events/drama"
                          className="btn btn-primary btn-sm"
                          style={{ width: "100%", justifyContent: "center", gap: "0.4rem" }}
                        >
                          <span>Open Drama Microsite</span>
                          <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <Link
                          href="/register?mode=join"
                          className="btn btn-secondary btn-sm"
                          style={{ width: "100%", justifyContent: "center", gap: "0.4rem" }}
                        >
                          <span>Register in 7-Step Wizard</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          /* 5-Venue Master Timetable Grid */
          <div className="card" style={{ padding: "1.75rem", background: "var(--bg-surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                  Master Venue Timetable &middot; Day {scheduleDay}
                </h2>
                <p style={{ margin: "0.25rem 0 0", color: "var(--bone-dim)", fontSize: "0.85rem" }}>
                  Five venues running in parallel. Anyone entered in overlapping events is flagged prior to roster sign-off.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setScheduleDay("1")}
                  className={`btn btn-sm ${scheduleDay === "1" ? "btn-primary" : "btn-secondary"}`}
                >
                  Day 1 (Saturday 28 Nov)
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleDay("2")}
                  className={`btn btn-sm ${scheduleDay === "2" ? "btn-primary" : "btn-secondary"}`}
                >
                  Day 2 (Sunday 29 Nov)
                </button>
              </div>
            </div>

            {scheduleDay === "1" ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "750px", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--line-strong)", textAlign: "left" }}>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--acid)", width: "90px" }}>TIME</th>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>AUDITORIUM</th>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>ATRIUM</th>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>STUDIO ONE</th>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>QUAD STAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>09:30</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Opening Ceremony</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>All Contingents Welcome</span>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Monochromatic Mastery</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Fine Arts &middot; Solo</span>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>11:00</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Seven To Smoke</strong>
                        <span style={{ color: "var(--acid)", fontSize: "0.75rem" }}>Performing Arts &middot; L3 Solo</span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Teqball Thunder</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Informals &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Ani-mate Your Fate</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Fine Arts &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>14:00</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Desi To Drip</strong>
                        <span style={{ color: "var(--acid)", fontSize: "0.75rem" }}>Performing &middot; L3 Squad</span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Mr. &amp; Ms. Illenium™</strong>
                        <span style={{ color: "var(--acid)", fontSize: "0.75rem" }}>Informals &middot; L3 Pairs</span>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Sustainacity</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Business &middot; Team of 4</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>16:30</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Mirror, Mirror</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Fine Arts &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>D.R.A.M.A (Street Play)</strong>
                        <span style={{ color: "var(--acid)", fontSize: "0.75rem" }}>Theatre &middot; L3 Squad (8–15)</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>18:30</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Homeroom Harmonies</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Performing &middot; 4 to 8 Vocalists</span>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Vintage Vogue &amp; Stalls</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Informals &middot; Open Ground</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "750px", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--line-strong)", textAlign: "left" }}>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--acid)", width: "90px" }}>TIME</th>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>AUDITORIUM</th>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>ATRIUM</th>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>STUDIO ONE</th>
                      <th style={{ padding: "0.75rem 1rem", color: "var(--bone)" }}>QUAD STAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>10:00</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Advertainment</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Business &middot; Team of 4</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>11:30</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Filmy Fatka</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Literary &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Design &amp; Decibels</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Fine Arts &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>13:30</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>J.A.M</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>Literary &middot; Solo</span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Last Ship Out</strong>
                        <span style={{ color: "var(--acid)", fontSize: "0.75rem" }}>Business &middot; L3 Team</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>15:00</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Master of the Streets</strong>
                        <span style={{ color: "var(--acid)", fontSize: "0.75rem" }}>Dance Battle &middot; L3 Crew</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="mono" style={{ padding: "1rem", color: "var(--dim)", fontWeight: 600 }}>17:30</td>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--bone)", display: "block" }}>Whose Plot Is It Anyway?</strong>
                        <span style={{ color: "var(--acid)", fontSize: "0.75rem" }}>Theatre &middot; L3 Final Stage</span>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1rem", color: "var(--dim)" }}>&mdash;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
