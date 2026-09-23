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
  ChevronDown,
  ChevronRight,
  ListFilter
} from "lucide-react";

interface EventItem {
  id: string;
  code: string;
  name: string;
  category: "Performing Arts" | "Informals & Sports" | "Fine Arts" | "Business & Management" | "Theatre & Drama" | "Literary & Quiz";
  venue: string;
  time: string;
  level: "L3" | "L2" | "L1";
  points: number;
  description: string;
  format: string;
  eligibility: string;
  rules: string[];
  teamSize: string;
  status: "open" | "flagship";
  slug?: string;
}

const ALL_FESTIVAL_EVENTS: EventItem[] = [
  {
    id: "e-01",
    code: "E-101",
    name: "ADVERTAINMENT",
    category: "Business & Management",
    venue: "Quad Arena Room 1",
    time: "Day 2 · 10:00 IST",
    level: "L2",
    points: 60,
    description: "Live satirical commercial creation and rapid brand repositioning battle under unexpected market curveballs.",
    format: "3-round pitch war: Jingle generation, crisis PR rebuttal, and 60-second broadcast.",
    eligibility: "Open to contingent teams and invited business squads.",
    rules: ["Props provided on spot", "No pre-recorded audio tracks", "3–5 members per contingent"],
    teamSize: "3–5 Marketers",
    status: "open"
  },
  {
    id: "e-02",
    code: "E-102",
    name: "ANI-MATE YOUR FATE",
    category: "Fine Arts",
    venue: "Studio One",
    time: "Day 1 · 11:00 IST",
    level: "L1",
    points: 40,
    description: "Sequential comic art narrative and visual storyboard contest responding to live genre prompts.",
    format: "90-minute live illustration session on supplied A2 Bristol paper.",
    eligibility: "Solo or pairs per college.",
    rules: ["All dry & wet media permitted", "No digital tracing devices", "Final strip must feature 4 panels minimum"],
    teamSize: "Pairs (2 Artists)",
    status: "open"
  },
  {
    id: "e-03",
    code: "E-103",
    name: "D.R.A.M.A (STREET PLAY)",
    category: "Theatre & Drama",
    venue: "Quad Stage (Open Air)",
    time: "Day 1 · 16:30 IST",
    level: "L3",
    points: 100,
    description: "High-octane satire, choral movement, and commanding street theatre in the 360-degree open quad arena.",
    format: "12-minute performance followed by acoustic judge debrief.",
    eligibility: "Official Contingent Entry only.",
    rules: ["Acoustic only (no microphones)", "Strict 12-minute bell warning", "Gulal and dry props permitted with cleanup crew"],
    teamSize: "8–15 Performers",
    status: "flagship",
    slug: "drama"
  },
  {
    id: "e-04",
    code: "E-104",
    name: "DESIGN & DECIBELS",
    category: "Fine Arts",
    venue: "Studio One",
    time: "Day 2 · 11:30 IST",
    level: "L2",
    points: 60,
    description: "Live digital audio visualizer design synced with dynamic live music drops.",
    format: "Real-time projection mapping & motion graphic battle.",
    eligibility: "Open to design school contingents & independents.",
    rules: ["TouchDesigner / After Effects / Blender permitted", "Live audio feed provided via XLR", "30-minute render sprint"],
    teamSize: "Pairs (2 Creators)",
    status: "open"
  },
  {
    id: "e-05",
    code: "E-105",
    name: "DESI TO DRIP",
    category: "Performing Arts",
    venue: "Main Auditorium",
    time: "Day 1 · 14:00 IST",
    level: "L3",
    points: 100,
    description: "High-fashion runway choreography merging indigenous textiles with futuristic streetwear aesthetics.",
    format: "8-minute sequence with runway walk, dynamic formations, and concept voiceover.",
    eligibility: "Contingent Level 3 flagship squad.",
    rules: ["Soundtrack submission 2 hours prior", "Garments must reflect dual thematic fusion", "Lighting cues pre-programmed"],
    teamSize: "8–10 Models",
    status: "flagship"
  },
  {
    id: "e-06",
    code: "E-106",
    name: "FILMY FATKA",
    category: "Literary & Quiz",
    venue: "Atrium Stage",
    time: "Day 2 · 11:30 IST",
    level: "L1",
    points: 40,
    description: "Rapid Bollywood and World Cinema buzzer showdown with blind audio cues and dialog reconstruction.",
    format: "Prelims written round followed by 6-team live stage buzzer finals.",
    eligibility: "All registered students.",
    rules: ["Negative marking on buzzer bounce", "No smartwatches / phones on stage", "Decision of quizmaster is final"],
    teamSize: "Pairs (2 Cinephiles)",
    status: "open"
  },
  {
    id: "e-07",
    code: "E-107",
    name: "HOMEROOM HARMONIES",
    category: "Performing Arts",
    venue: "Main Auditorium",
    time: "Day 1 · 18:30 IST",
    level: "L2",
    points: 60,
    description: "A cappella choral arrangement and contemporary vocal counterpoint competition.",
    format: "6-minute vocal medley with vocal percussion.",
    eligibility: "College choir & music groups.",
    rules: ["Zero instruments or pitch pipes on stage", "Beatbox permitted as vocal percussion", "Original arrangement bonus"],
    teamSize: "4–8 Vocalists",
    status: "open"
  },
  {
    id: "e-08",
    code: "E-108",
    name: "J.A.M (JUST A MINUTE)",
    category: "Literary & Quiz",
    venue: "Studio One",
    time: "Day 2 · 13:30 IST",
    level: "L2",
    points: 60,
    description: "High-pressure impromptu speaking testing hesitation, deviation, grammatical slips, and witty objections.",
    format: "Classic competitive collegiate JAM rounds with rolling mods.",
    eligibility: "Solo representation per college.",
    rules: ["Standard JAM rules apply", "Grammar slam at mod discretion", "Points for speaking on final second"],
    teamSize: "1 Speaker",
    status: "open"
  },
  {
    id: "e-09",
    code: "E-109",
    name: "LAST SHIP OUT",
    category: "Business & Management",
    venue: "Quad Arena Room 2",
    time: "Day 2 · 13:30 IST",
    level: "L3",
    points: 100,
    description: "Geopolitical supply chain crisis management simulation and cross-border trade war-game.",
    format: "4-hour live economic simulation with real-time newsflashes and currency devaluations.",
    eligibility: "Business & economics squads.",
    rules: ["Live spreadsheet scoring", "Strict trade embargo guidelines", "Collusion allowed during breakout sessions"],
    teamSize: "4 Strategists",
    status: "flagship"
  },
  {
    id: "e-10",
    code: "E-110",
    name: "MASTER OF THE STREETS",
    category: "Performing Arts",
    venue: "Quad Stage (Open Air)",
    time: "Day 2 · 15:00 IST",
    level: "L3",
    points: 100,
    description: "All-styles street dance crew battle for campus supremacy with open-air cypher bracket.",
    format: "Top 8 bracket battle: 2 rounds of 90 seconds per crew.",
    eligibility: "Contingent Crews.",
    rules: ["Unpredictable DJ track selections", "Routine routine + cypher battle mandatory", "No physical contact during rounds"],
    teamSize: "5–8 Dancers",
    status: "flagship"
  },
  {
    id: "e-11",
    code: "E-111",
    name: "MIRROR, MIRROR",
    category: "Fine Arts",
    venue: "Studio One",
    time: "Day 1 · 16:30 IST",
    level: "L2",
    points: 60,
    description: "Dual-perspective portraiture and reflective canvas creation contest.",
    format: "2 artists working simultaneously from opposite angles of a central live model.",
    eligibility: "Fine arts duos.",
    rules: ["Canvases must visually connect when placed side by side", "Acrylic & mixed media provided", "2 hours time limit"],
    teamSize: "Pairs (2 Artists)",
    status: "open"
  },
  {
    id: "e-12",
    code: "E-112",
    name: "MONOCHROMATIC MASTERY",
    category: "Fine Arts",
    venue: "Studio One",
    time: "Day 1 · 09:30 IST",
    level: "L1",
    points: 40,
    description: "Live black, white, and grayscale canvas creation under strict 90-minute time limits.",
    format: "Solo canvas painting using only charcoal, black ink, and white gouache.",
    eligibility: "Solo representation.",
    rules: ["Zero color pigments permitted", "Canvases mounted on campus easels", "Judging on depth, tone, and technique"],
    teamSize: "1 Artist",
    status: "open"
  },
  {
    id: "e-13",
    code: "E-113",
    name: "MR. & MS. ILLENIUM™",
    category: "Informals & Sports",
    venue: "Atrium Stage",
    time: "Day 1 · 14:00 IST",
    level: "L3",
    points: 100,
    description: "The definitive personality and stage-presence pageant testing wit, talent, eloquence, and crowd charisma.",
    format: "3 rounds: Introduction & Style, Rapid-Fire Wit, and Talent Spotlight.",
    eligibility: "1 male & 1 female contender per contingent.",
    rules: ["Formal & fusion eveningwear mandatory", "Talent round strictly 2.5 minutes", "Judged by industry celebrities"],
    teamSize: "Pairs (2 Contenders)",
    status: "flagship"
  },
  {
    id: "e-14",
    code: "E-114",
    name: "PORTFOLIO PIONEERS",
    category: "Business & Management",
    venue: "Quad Arena Room 1",
    time: "Day 2 · 15:00 IST",
    level: "L2",
    points: 60,
    description: "Live venture capital simulated seed-round investment pitch matrix.",
    format: "5-minute investor deck + 3-minute aggressive angel interrogation.",
    eligibility: "Founders & venture squads.",
    rules: ["Real-time valuation multiplier by judges", "Financial unit economics slides mandatory", "Slide limit: 8 slides"],
    teamSize: "Pairs (2 Founders)",
    status: "open"
  },
  {
    id: "e-15",
    code: "E-115",
    name: "QUIZ AND LADDERS",
    category: "Literary & Quiz",
    venue: "Main Auditorium",
    time: "Day 2 · 15:30 IST",
    level: "L2",
    points: 60,
    description: "General knowledge quiz with strategic board-game modifiers and risk-reward betting.",
    format: "Written preliminary round & 6-team board final.",
    eligibility: "Open teams of 2.",
    rules: ["Betting tokens multiplier before each question", "Snakes deduct points", "Quizmaster rules absolute"],
    teamSize: "Pairs (2 Quizzers)",
    status: "open"
  },
  {
    id: "e-16",
    code: "E-116",
    name: "SEVEN TO SMOKE",
    category: "Performing Arts",
    venue: "Main Auditorium",
    time: "Day 1 · 11:00 IST",
    level: "L3",
    points: 100,
    description: "The premier 1v1 cypher battle where dancers battle back-to-back until seven consecutive victories.",
    format: "Top 8 battle cypher, 20 minutes time ceiling or first to reach 7 smoke tokens.",
    eligibility: "Solo representative.",
    rules: ["All street dance styles eligible", "DJ roulette beats", "Judges vote with smoke sticks"],
    teamSize: "1 Dancer",
    status: "flagship"
  },
  {
    id: "e-17",
    code: "E-117",
    name: "SPIN AND SWING",
    category: "Informals & Sports",
    venue: "Open Atrium",
    time: "Day 2 · 16:30 IST",
    level: "L1",
    points: 40,
    description: "Precision table tennis and target swing accuracy sports tournament.",
    format: "Knockout rally brackets with obstacle boards.",
    eligibility: "Informal sports pairs.",
    rules: ["ITTF standard rackets", "Obstacle targets carry bonus multipliers", "11 points per set"],
    teamSize: "2 Players",
    status: "open"
  },
  {
    id: "e-18",
    code: "E-118",
    name: "SUSTAINACITY",
    category: "Business & Management",
    venue: "Quad Arena Room 2",
    time: "Day 1 · 14:00 IST",
    level: "L2",
    points: 60,
    description: "Urban venture crisis simulation pitching circular economy systems to a corporate panel.",
    format: "Design sprint proposing carbon-neutral redevelopment of Mumbai civic zones.",
    eligibility: "Teams of 4.",
    rules: ["Case study released 24 hours prior", "Prototypes / architectural renders encouraged", "7-minute pitch"],
    teamSize: "4 Analysts",
    status: "open"
  },
  {
    id: "e-19",
    code: "E-119",
    name: "TEQBALL THUNDER",
    category: "Informals & Sports",
    venue: "Open Atrium",
    time: "Day 1 · 11:00 IST",
    level: "L2",
    points: 60,
    description: "Curved table-tennis soccer showdown requiring pinpoint ball mastery, agility, and split-second headers.",
    format: "Pairs tournament: 3 touches maximum per side, no hands or repeat body parts.",
    eligibility: "Open sports pairs.",
    rules: ["Official Teqball curve table", "Best of 3 sets of 12 points", "Shoes with non-marking soles only"],
    teamSize: "2 Players",
    status: "open"
  },
  {
    id: "e-20",
    code: "E-120",
    name: "TWIST AND TALES",
    category: "Literary & Quiz",
    venue: "Studio One",
    time: "Day 2 · 16:30 IST",
    level: "L1",
    points: 40,
    description: "Creative micro-fiction battle with prompt twists injected every 15 minutes by the jury.",
    format: "60-minute live writing sprint with mandatory injected plot twist cards.",
    eligibility: "Solo writers.",
    rules: ["Word limit: 1200 words max", "All 3 twists must integrate logically", "Laptops or handwritten acceptable"],
    teamSize: "1 Writer",
    status: "open"
  },
  {
    id: "e-21",
    code: "E-121",
    name: "VINTAGE VOGUE",
    category: "Informals & Sports",
    venue: "Quad Arena",
    time: "Day 1 · 16:30 IST",
    level: "L2",
    points: 60,
    description: "Retro lifestyle cosplay and vintage styling contest across bygone cultural decades.",
    format: "Group costume presentation with 2-minute dialogue or musical homage.",
    eligibility: "Contingent group entry.",
    rules: ["Must specify chosen decade (60s, 70s, 80s, 90s, Y2K)", "Props inspected before entry", "Live commentary score"],
    teamSize: "8–15 Stylists",
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
    points: 100,
    description: "Improv theatrical comedy contest responding to live audience prompts without pre-written scripts.",
    format: "4 competitive rounds of unscripted theatre games, gibberish translation, and musical scene switches.",
    eligibility: "Contingent comedy troupe.",
    rules: ["Zero prepared material", "Freeze tag rules strictly enforced", "Host buzzer changes scenes instantly"],
    teamSize: "4 Comedians",
    status: "flagship"
  }
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openEventId, setOpenEventId] = useState<string | null>("e-03"); // Default open D.R.A.M.A
  const [activeView, setActiveView] = useState<"editorial" | "timetable">("editorial");
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

  const toggleEventAccordion = (id: string) => {
    setOpenEventId(openEventId === id ? null : id);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "#f2f0e9", display: "flex", flexDirection: "column" }}>
      <UnifiedHeader />

      <main style={{ flex: 1, maxWidth: "1180px", margin: "0 auto", padding: "3rem 1.5rem 6rem", width: "100%" }}>
        {/* Header Hero matching Anton HTML */}
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              background: "rgba(255, 35, 143, 0.12)",
              border: "1px solid rgba(255, 35, 143, 0.35)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#ff238f",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1rem"
            }}
          >
            <Sparkles size={13} />
            ILLENIUM™ 2026 &middot; 28 &amp; 29 NOVEMBER 2026 &middot; MUMBAI
          </div>

          <h1
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              textTransform: "uppercase",
              margin: 0,
              color: "#f2f0e9"
            }}
          >
            TWENTY<br />
            <span style={{ color: "#ff238f" }}>EVENTS</span>
          </h1>

          <p
            style={{
              marginTop: "1.25rem",
              fontSize: "1.1rem",
              color: "var(--bone-dim)",
              maxWidth: "760px",
              lineHeight: 1.6
            }}
          >
            Five categories. Level three carries the most championship points and every level three event is open to contingents.
            The points go to the college, not the person. Click any event to expand its official brief, rules, and eligibility.
          </p>

          {/* View Mode Toggle */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("editorial")}
              className="btn"
              style={{
                background: activeView === "editorial" ? "#ff238f" : "rgba(255,255,255,0.06)",
                color: activeView === "editorial" ? "#07070a" : "#f2f0e9",
                border: `1px solid ${activeView === "editorial" ? "#ff238f" : "rgba(255,255,255,0.15)"}`,
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "0.55rem 1.25rem",
                borderRadius: "8px"
              }}
            >
              <ListFilter size={15} />
              <span>Anton Editorial List ({ALL_FESTIVAL_EVENTS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("timetable")}
              className="btn"
              style={{
                background: activeView === "timetable" ? "#ff238f" : "rgba(255,255,255,0.06)",
                color: activeView === "timetable" ? "#07070a" : "#f2f0e9",
                border: `1px solid ${activeView === "timetable" ? "#ff238f" : "rgba(255,255,255,0.15)"}`,
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "0.55rem 1.25rem",
                borderRadius: "8px"
              }}
            >
              <Calendar size={15} />
              <span>5-Venue Master Timetable</span>
            </button>
          </div>
        </div>

        {activeView === "editorial" ? (
          <>
            {/* Filter Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                paddingBottom: "1.25rem"
              }}
            >
              {/* Category Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", overflowX: "auto", maxWidth: "100%", paddingBottom: "0.25rem" }}>
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
                        fontWeight: isActive ? 700 : 500,
                        background: isActive ? "#ff238f" : "rgba(255,255,255,0.05)",
                        color: isActive ? "#07070a" : "var(--bone-dim)",
                        border: `1px solid ${isActive ? "#ff238f" : "rgba(255,255,255,0.1)"}`,
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

              {/* Search Bar */}
              <div style={{ position: "relative", minWidth: "240px", flex: "1 1 240px", maxWidth: "340px" }}>
                <Search
                  size={14}
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
                  placeholder="Filter by event name or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "36px", fontSize: "0.85rem", background: "rgba(0,0,0,0.4)" }}
                />
              </div>
            </div>

            {/* Anton Editorial Event Accordion List */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}>
              {filteredEvents.map((event, index) => {
                const isOpen = openEventId === event.id;
                const isDrama = event.slug === "drama";

                return (
                  <div
                    key={event.id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.14)",
                      padding: "1.25rem 0",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {/* Accordion Trigger Row */}
                    <div
                      onClick={() => toggleEventAccordion(event.id)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: "1.5rem",
                        cursor: "pointer",
                        color: isOpen ? "#ff238f" : "#f2f0e9"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                          <span className="mono" style={{ fontSize: "0.75rem", color: "var(--dim)", letterSpacing: "0.05em" }}>
                            {String(index + 1).padStart(2, "0")} / EVENT &middot; {event.code}
                          </span>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              padding: "0.1rem 0.4rem",
                              borderRadius: "4px",
                              background: event.level === "L3" ? "rgba(255,35,143,0.15)" : "rgba(255,255,255,0.06)",
                              color: event.level === "L3" ? "#ff238f" : "var(--bone-dim)",
                              border: `1px solid ${event.level === "L3" ? "rgba(255,35,143,0.3)" : "rgba(255,255,255,0.1)"}`
                            }}
                          >
                            {event.level} &middot; {event.points} PTS
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                            {event.category}
                          </span>
                        </div>

                        <h2
                          style={{
                            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                            fontWeight: 900,
                            lineHeight: 1,
                            textTransform: "uppercase",
                            letterSpacing: "-0.01em",
                            margin: 0,
                            transition: "color 0.15s ease"
                          }}
                        >
                          {event.name}
                        </h2>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1.75rem", fontWeight: 300, transition: "transform 0.2s ease", transform: isOpen ? "rotate(90deg)" : "none", color: isOpen ? "#ff238f" : "var(--dim)" }}>
                          {isOpen ? "↓" : "↗"}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Content Panel */}
                    {isOpen && (
                      <div
                        style={{
                          marginTop: "1.25rem",
                          padding: "1.5rem",
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, rgba(255,35,143,0.06) 0%, rgba(13,12,17,0.95) 100%)",
                          border: "1px solid rgba(255,35,143,0.25)"
                        }}
                      >
                        <p style={{ fontSize: "1rem", color: "#f2f0e9", lineHeight: 1.6, margin: "0 0 1.25rem", maxWidth: "800px" }}>
                          {event.description}
                        </p>

                        {/* Event Meta Specifications */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "1rem",
                            background: "rgba(0,0,0,0.3)",
                            padding: "1rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            marginBottom: "1.25rem"
                          }}
                        >
                          <div>
                            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--dim)", fontWeight: 700 }}>VENUE</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#f2f0e9", fontWeight: 600, fontSize: "0.9rem", marginTop: "0.2rem" }}>
                              <MapPin size={13} style={{ color: "#ff238f" }} />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--dim)", fontWeight: 700 }}>TIMING</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#f2f0e9", fontWeight: 600, fontSize: "0.9rem", marginTop: "0.2rem" }}>
                              <Clock size={13} style={{ color: "var(--acid)" }} />
                              <span>{event.time}</span>
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--dim)", fontWeight: 700 }}>SQUAD SIZE</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#f2f0e9", fontWeight: 600, fontSize: "0.9rem", marginTop: "0.2rem" }}>
                              <Users size={13} style={{ color: "var(--cyan)" }} />
                              <span>{event.teamSize}</span>
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--dim)", fontWeight: 700 }}>FORMAT</span>
                            <div style={{ color: "#f2f0e9", fontWeight: 600, fontSize: "0.85rem", marginTop: "0.2rem" }}>
                              {event.format}
                            </div>
                          </div>
                        </div>

                        {/* Rules Pills */}
                        <div style={{ marginBottom: "1.5rem" }}>
                          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--dim)", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
                            KEY RULES &amp; GUIDELINES
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            {event.rules.map((rule, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "0.3rem 0.65rem",
                                  borderRadius: "4px",
                                  background: "rgba(255,255,255,0.05)",
                                  border: "1px solid rgba(255,255,255,0.12)",
                                  color: "var(--bone-dim)"
                                }}
                              >
                                &bull; {rule}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                          {isDrama ? (
                            <Link
                              href="/events/drama"
                              className="btn btn-primary btn-sm"
                              style={{ background: "#ff238f", borderColor: "#ff238f", color: "#07070a", fontWeight: 700, gap: "0.4rem" }}
                            >
                              <span>Enter D.R.A.M.A Dedicated Arena</span>
                              <ArrowRight size={14} />
                            </Link>
                          ) : (
                            <Link
                              href="/register?mode=join"
                              className="btn btn-primary btn-sm"
                              style={{ background: "#ff238f", borderColor: "#ff238f", color: "#07070a", fontWeight: 700, gap: "0.4rem" }}
                            >
                              <span>Register for Event in 7-Step Wizard</span>
                              <ArrowUpRight size={14} />
                            </Link>
                          )}
                          <Link
                            href="/register?mode=on-the-spot"
                            className="btn btn-secondary btn-sm"
                            style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}
                          >
                            <span>Independent Entry</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* 5-Venue Master Timetable Grid matching Anton HTML */
          <div className="card" style={{ padding: "2rem", background: "var(--bg-surface)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, textTransform: "uppercase", color: "#f2f0e9" }}>
                  DAY {scheduleDay === "1" ? "ONE" : "TWO"} &middot; 5-VENUE MASTER TIMETABLE
                </h2>
                <p style={{ margin: "0.25rem 0 0", color: "var(--bone-dim)", fontSize: "0.9rem" }}>
                  Five venues running in parallel. Anyone entered in two overlapping events is flagged before the timetable is published.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setScheduleDay("1")}
                  className="btn btn-sm"
                  style={{
                    background: scheduleDay === "1" ? "#ff238f" : "rgba(255,255,255,0.06)",
                    color: scheduleDay === "1" ? "#07070a" : "#f2f0e9",
                    border: `1px solid ${scheduleDay === "1" ? "#ff238f" : "rgba(255,255,255,0.15)"}`,
                    fontWeight: 700
                  }}
                >
                  DAY ONE (28 NOV)
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleDay("2")}
                  className="btn btn-sm"
                  style={{
                    background: scheduleDay === "2" ? "#ff238f" : "rgba(255,255,255,0.06)",
                    color: scheduleDay === "2" ? "#07070a" : "#f2f0e9",
                    border: `1px solid ${scheduleDay === "2" ? "#ff238f" : "rgba(255,255,255,0.15)"}`,
                    fontWeight: 700
                  }}
                >
                  DAY TWO (29 NOV)
                </button>
              </div>
            </div>

            {scheduleDay === "1" ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "780px", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", textAlign: "left" }}>
                      <th style={{ padding: "0.85rem 1rem", color: "#ff238f", width: "90px", fontWeight: 800 }}>TIME</th>
                      <th style={{ padding: "0.85rem 1rem", color: "#f2f0e9", fontWeight: 800 }}>AUDITORIUM</th>
                      <th style={{ padding: "0.85rem 1rem", color: "#f2f0e9", fontWeight: 800 }}>ATRIUM</th>
                      <th style={{ padding: "0.85rem 1rem", color: "#f2f0e9", fontWeight: 800 }}>STUDIO ONE</th>
                      <th style={{ padding: "0.85rem 1rem", color: "#f2f0e9", fontWeight: 800 }}>QUAD STAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>09:30</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Opening Ceremony</strong>
                        <span style={{ color: "var(--dim)", fontSize: "0.75rem" }}>All contingents</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Monochromatic Mastery</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Fine Arts &middot; Solo</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>11:00</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#ff238f", display: "block", textTransform: "uppercase" }}>Seven To Smoke</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Performing Arts &middot; Solo (L3)</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Teqball Thunder</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Informals &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Ani-mate Your Fate</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Fine Arts &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>14:00</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#ff238f", display: "block", textTransform: "uppercase" }}>Desi To Drip</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Performing &middot; 8 to 10 (L3)</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#ff238f", display: "block", textTransform: "uppercase" }}>Mr. &amp; Ms. Illenium™</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Informals &middot; Pairs (L3)</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Sustainacity</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Business &middot; Team of 4</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>16:30</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Mirror, Mirror</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Fine Arts &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#ff238f", display: "block", textTransform: "uppercase" }}>D.R.A.M.A</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Performing &middot; 8 to 15 (L3)</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>18:30</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Homeroom Harmonies</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Performing &middot; 4 to 8</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Vintage Vogue &amp; Stalls</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Informals &middot; Open Ground</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "780px", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", textAlign: "left" }}>
                      <th style={{ padding: "0.85rem 1rem", color: "#ff238f", width: "90px", fontWeight: 800 }}>TIME</th>
                      <th style={{ padding: "0.85rem 1rem", color: "#f2f0e9", fontWeight: 800 }}>AUDITORIUM</th>
                      <th style={{ padding: "0.85rem 1rem", color: "#f2f0e9", fontWeight: 800 }}>ATRIUM</th>
                      <th style={{ padding: "0.85rem 1rem", color: "#f2f0e9", fontWeight: 800 }}>STUDIO ONE</th>
                      <th style={{ padding: "0.85rem 1rem", color: "#f2f0e9", fontWeight: 800 }}>QUAD STAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>10:00</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Advertainment</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Business &middot; Team of 4</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>11:30</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Filmy Fatka</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Literary &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>Design &amp; Decibels</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Fine Arts &middot; Pairs</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>13:30</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#f2f0e9", display: "block", textTransform: "uppercase" }}>J.A.M</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Literary &middot; Solo</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#ff238f", display: "block", textTransform: "uppercase" }}>Last Ship Out</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Business &middot; L3 Team</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>15:00</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#ff238f", display: "block", textTransform: "uppercase" }}>Master of the Streets</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Performing Arts &middot; L3 Crew</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <td className="mono" style={{ padding: "1.1rem 1rem", color: "var(--dim)", fontWeight: 700 }}>17:30</td>
                      <td style={{ padding: "1.1rem 1rem" }}>
                        <strong style={{ color: "#ff238f", display: "block", textTransform: "uppercase" }}>Whose Plot Is It Anyway?</strong>
                        <span style={{ color: "var(--bone-dim)", fontSize: "0.75rem" }}>Theatre &middot; L3 Final Stage</span>
                      </td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
                      <td style={{ padding: "1.1rem 1rem", color: "var(--dim)" }}>&mdash;</td>
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
