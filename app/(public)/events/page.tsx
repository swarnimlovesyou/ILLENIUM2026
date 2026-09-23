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
  Search,
  Users,
  ListFilter
} from "lucide-react";

interface EventItem {
  id: string;
  code: string;
  name: string;
  category: "PERFORMING ARTS" | "INFORMALS" | "FINE ARTS" | "BUSINESS" | "THEATRE & DRAMA" | "LITERARY & QUIZ";
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
    category: "BUSINESS",
    venue: "Quad Arena Room 1",
    time: "Day 2 · 10:00",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Live satirical commercial creation and rapid brand repositioning battle under unexpected market curveballs.",
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
    category: "FINE ARTS",
    venue: "Studio One",
    time: "Day 1 · 11:00",
    level: "L1",
    points: 40,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Sequential comic art narrative and visual storyboard contest responding to live genre prompts.",
    format: "90-minute live illustration session on supplied A2 Bristol paper.",
    eligibility: "Solo or pairs per college.",
    rules: ["All dry & wet media permitted", "No digital tracing devices", "Final strip must feature 4 panels minimum"],
    teamSize: "Pairs (2 Artists)",
    status: "open"
  },
  {
    id: "e-03",
    code: "E-103",
    name: "D.R.A.M.A",
    category: "THEATRE & DRAMA",
    venue: "Auditorium",
    time: "Day 1 · 16:30",
    level: "L3",
    points: 100,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. High-octane satire, choral movement, and commanding street theatre in front of the festival crowd.",
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
    category: "FINE ARTS",
    venue: "Studio One",
    time: "Day 2 · 11:30",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Live digital audio visualizer design synced with dynamic live beat drops.",
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
    category: "PERFORMING ARTS",
    venue: "Auditorium",
    time: "Day 1 · 14:00",
    level: "L3",
    points: 100,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. High-fashion runway choreography merging indigenous textiles with futuristic streetwear aesthetics.",
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
    category: "LITERARY & QUIZ",
    venue: "Atrium",
    time: "Day 2 · 11:30",
    level: "L1",
    points: 40,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Rapid Bollywood and World Cinema buzzer showdown with blind audio cues.",
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
    category: "PERFORMING ARTS",
    venue: "Auditorium",
    time: "Day 1 · 18:30",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. A cappella choral arrangement and contemporary vocal counterpoint competition.",
    format: "6-minute vocal medley with vocal percussion.",
    eligibility: "College choir & music groups.",
    rules: ["Zero instruments or pitch pipes on stage", "Beatbox permitted as vocal percussion", "Original arrangement bonus"],
    teamSize: "4–8 Vocalists",
    status: "open"
  },
  {
    id: "e-08",
    code: "E-108",
    name: "J.A.M",
    category: "LITERARY & QUIZ",
    venue: "Studio One",
    time: "Day 2 · 13:30",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. High-pressure impromptu speaking testing hesitation, deviation, and grammatical slips.",
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
    category: "BUSINESS",
    venue: "Quad",
    time: "Day 2 · 13:30",
    level: "L3",
    points: 100,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Geopolitical supply chain crisis management simulation.",
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
    category: "PERFORMING ARTS",
    venue: "Quad",
    time: "Day 2 · 15:00",
    level: "L3",
    points: 100,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. All-styles street dance crew battle for campus supremacy with open-air cypher bracket.",
    format: "Top 8 bracket battle: 2 rounds of 90 seconds per crew.",
    eligibility: "Contingent Crews.",
    rules: ["Unpredictable DJ track selections", "Routine + cypher battle mandatory", "No physical contact during rounds"],
    teamSize: "5–8 Dancers",
    status: "flagship"
  },
  {
    id: "e-11",
    code: "E-111",
    name: "MIRROR, MIRROR",
    category: "FINE ARTS",
    venue: "Studio One",
    time: "Day 1 · 16:30",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Dual-perspective portraiture and reflective canvas creation contest.",
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
    category: "FINE ARTS",
    venue: "Studio One",
    time: "Day 1 · 09:30",
    level: "L1",
    points: 40,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Live black, white, and grayscale canvas creation under strict 90-minute time limits.",
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
    category: "INFORMALS",
    venue: "Atrium",
    time: "Day 1 · 14:00",
    level: "L3",
    points: 100,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. The definitive personality and stage-presence pageant testing wit, talent, and crowd charisma.",
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
    category: "BUSINESS",
    venue: "Quad",
    time: "Day 2 · 15:00",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Live venture capital simulated seed-round investment pitch matrix.",
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
    category: "LITERARY & QUIZ",
    venue: "Auditorium",
    time: "Day 2 · 15:30",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. General knowledge quiz with strategic board-game modifiers and risk-reward betting.",
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
    category: "PERFORMING ARTS",
    venue: "Auditorium",
    time: "Day 1 · 11:00",
    level: "L3",
    points: 100,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. The premier 1v1 cypher battle where dancers battle back-to-back until seven consecutive victories.",
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
    category: "INFORMALS",
    venue: "Atrium",
    time: "Day 2 · 16:30",
    level: "L1",
    points: 40,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Precision table tennis and target swing accuracy sports tournament.",
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
    category: "BUSINESS",
    venue: "Quad",
    time: "Day 1 · 14:00",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Urban venture crisis simulation pitching circular economy systems to a corporate panel.",
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
    category: "INFORMALS",
    venue: "Atrium",
    time: "Day 1 · 11:00",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Curved table-tennis soccer showdown requiring pinpoint ball mastery, agility, and split-second headers.",
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
    category: "LITERARY & QUIZ",
    venue: "Studio One",
    time: "Day 2 · 16:30",
    level: "L1",
    points: 40,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Creative micro-fiction battle with prompt twists injected every 15 minutes by the jury.",
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
    category: "INFORMALS",
    venue: "Quad",
    time: "Day 1 · 16:30",
    level: "L2",
    points: 60,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Retro lifestyle cosplay and vintage styling contest across bygone cultural decades.",
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
    category: "THEATRE & DRAMA",
    venue: "Auditorium",
    time: "Day 2 · 17:30",
    level: "L3",
    points: 100,
    description: "The event page should carry the official brief, format, eligibility, reporting time, venue, submission requirements and rules. Improv theatrical comedy contest responding to live audience prompts without pre-written scripts.",
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
  const [openEventId, setOpenEventId] = useState<string | null>("e-01"); // Default open first event matching image 2
  const [activeTab, setActiveTab] = useState<"directory" | "timetable">("directory");
  const [scheduleDay, setScheduleDay] = useState<"1" | "2">("1");

  const categories = [
    "All",
    "PERFORMING ARTS",
    "THEATRE & DRAMA",
    "FINE ARTS",
    "INFORMALS",
    "BUSINESS",
    "LITERARY & QUIZ"
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
          {/* Header Top Meta */}
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
              / EVENTS / TWENTY EVENTS
            </div>
            <div style={{ fontFamily: '"Anton", Impact, sans-serif', textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.06em", color: "#8d8a82" }}>
              ILLENIUM™ 2026 &middot; MUMBAI
            </div>
          </div>

          {/* Heading exactly matching Anton HTML */}
          <h1
            style={{
              fontFamily: '"Anton", Impact, sans-serif',
              fontSize: "clamp(3.5rem, 8vw, 6.8rem)",
              lineHeight: 0.88,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              margin: "0 0 1rem",
              color: "#070707"
            }}
          >
            TWENTY<br />
            <span style={{ color: "#ff238f" }}>EVENTS</span>
          </h1>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.5, color: "#4c4a45", maxWidth: "720px", margin: "0 0 2rem" }}>
            Five categories. Level three carries the most championship points and every level three event is open to contingents. The points go to the college, not the person.
          </p>

          {/* View Mode Toggle */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveTab("directory")}
              style={{
                border: "none",
                background: activeTab === "directory" ? "#070707" : "transparent",
                color: activeTab === "directory" ? "#ffffff" : "#070707",
                borderBottom: activeTab === "directory" ? "2px solid #070707" : "1.5px solid #aaa",
                padding: "10px 18px",
                fontFamily: '"Anton", Impact, sans-serif',
                fontSize: "0.95rem",
                textTransform: "uppercase",
                cursor: "pointer"
              }}
            >
              EVENT LIST ({ALL_FESTIVAL_EVENTS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("timetable")}
              style={{
                border: "none",
                background: activeTab === "timetable" ? "#070707" : "transparent",
                color: activeTab === "timetable" ? "#ffffff" : "#070707",
                borderBottom: activeTab === "timetable" ? "2px solid #070707" : "1.5px solid #aaa",
                padding: "10px 18px",
                fontFamily: '"Anton", Impact, sans-serif',
                fontSize: "0.95rem",
                textTransform: "uppercase",
                cursor: "pointer"
              }}
            >
              5-VENUE SCHEDULE TIMETABLE
            </button>
          </div>

          {activeTab === "directory" ? (
            <>
              {/* Category Filter Pills & Search */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "2rem",
                  borderBottom: "1px solid rgba(7,7,7,0.18)",
                  paddingBottom: "1.25rem"
                }}
              >
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
                          fontSize: "0.75rem",
                          fontFamily: "Arial, sans-serif",
                          fontWeight: isActive ? 700 : 500,
                          textTransform: "uppercase",
                          background: isActive ? "#070707" : "transparent",
                          color: isActive ? "#ffffff" : "#4c4a45",
                          border: `1px solid ${isActive ? "#070707" : "#aaa"}`,
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

                <div style={{ position: "relative", minWidth: "220px", flex: "1 1 220px", maxWidth: "300px" }}>
                  <Search
                    size={14}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#666"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "100%", height: "42px", border: "1.5px solid #161616", background: "transparent", paddingLeft: "34px", outline: "none", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              {/* Anton Editorial Event List matching Screenshot 2 */}
              <div style={{ borderTop: "1px solid rgba(7,7,7,0.18)" }}>
                {filteredEvents.map((event, index) => {
                  const isOpen = openEventId === event.id;
                  const isDrama = event.slug === "drama";

                  return (
                    <div
                      key={event.id}
                      style={{
                        borderBottom: "1px solid rgba(7,7,7,0.18)",
                        padding: "16px 0",
                        transition: "all 0.14s ease"
                      }}
                    >
                      {/* Top Header Row */}
                      <div
                        onClick={() => toggleEventAccordion(event.id)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: "20px",
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <span style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#777", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                            {String(index + 1).padStart(2, "0")} / EVENT
                          </span>
                          <div
                            style={{
                              fontFamily: '"Anton", Impact, sans-serif',
                              fontSize: "clamp(28px, 4.5vw, 42px)",
                              lineHeight: 0.98,
                              textTransform: "uppercase",
                              color: isOpen ? "#ff238f" : "#070707",
                              transition: "color 0.14s ease"
                            }}
                          >
                            {event.name}
                          </div>
                        </div>

                        <span style={{ fontSize: "28px", color: isOpen ? "#ff238f" : "#070707", transition: "transform 0.2s ease", transform: isOpen ? "rotate(90deg)" : "none" }}>
                          {isOpen ? "↓" : "↗"}
                        </span>
                      </div>

                      {/* Expandable Details Accordion */}
                      {isOpen && (
                        <div style={{ marginTop: "12px", paddingTop: "6px" }}>
                          <p style={{ fontSize: "13.5px", color: "#4b4946", lineHeight: 1.5, margin: "0 0 16px", maxWidth: "750px" }}>
                            {event.description}
                          </p>

                          {/* Fact Pill Tags exactly matching Screenshot 2 */}
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
                            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "10.5px", textTransform: "uppercase", border: "1px solid #aaa", padding: "6px 10px", color: "#4a4845" }}>
                              DETAILS: {event.time} &middot; {event.venue}
                            </span>
                            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "10.5px", textTransform: "uppercase", border: "1px solid #aaa", padding: "6px 10px", color: "#4a4845" }}>
                              ELIGIBILITY: {event.teamSize}
                            </span>
                            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "10.5px", textTransform: "uppercase", border: "1px solid #aaa", padding: "6px 10px", color: "#4a4845" }}>
                              SCHEDULE: DAY {event.time.includes("Day 2") ? "2" : "1"}
                            </span>
                            <span style={{ fontFamily: "Arial, sans-serif", fontSize: "10.5px", textTransform: "uppercase", border: "1px solid #aaa", padding: "6px 10px", color: "#4a4845" }}>
                              RULES: {event.level} ({event.points} PTS)
                            </span>
                          </div>

                          {/* Action Link */}
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            {isDrama ? (
                              <Link
                                href="/events/drama"
                                style={{
                                  background: "#070707",
                                  color: "#ffffff",
                                  padding: "12px 18px",
                                  fontFamily: '"Anton", Impact, sans-serif',
                                  fontSize: "0.95rem",
                                  textTransform: "uppercase",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.4rem"
                                }}
                              >
                                <span>OPEN D.R.A.M.A MICROSITE</span>
                                <ArrowRight size={14} />
                              </Link>
                            ) : (
                              <Link
                                href="/register?mode=join"
                                style={{
                                  background: "#070707",
                                  color: "#ffffff",
                                  padding: "12px 18px",
                                  fontFamily: '"Anton", Impact, sans-serif',
                                  fontSize: "0.95rem",
                                  textTransform: "uppercase",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.4rem"
                                }}
                              >
                                <span>REGISTER FOR EVENT</span>
                                <ArrowUpRight size={14} />
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Timetable */
            <div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setScheduleDay("1")}
                  style={{
                    border: "1px solid #999",
                    background: scheduleDay === "1" ? "#111" : "transparent",
                    color: scheduleDay === "1" ? "#fff" : "#111",
                    padding: "10px 16px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: "pointer"
                  }}
                >
                  DAY ONE
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleDay("2")}
                  style={{
                    border: "1px solid #999",
                    background: scheduleDay === "2" ? "#111" : "transparent",
                    color: scheduleDay === "2" ? "#fff" : "#111",
                    padding: "10px 16px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: "pointer"
                  }}
                >
                  DAY TWO
                </button>
              </div>

              {scheduleDay === "1" ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "1px solid rgba(7,7,7,0.18)", minWidth: "750px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)", textAlign: "left", fontFamily: '"Anton", Impact, sans-serif', fontSize: "14px", textTransform: "uppercase" }}>
                        <th style={{ padding: "12px 10px", width: "80px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>TIME</th>
                        <th style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>AUDITORIUM</th>
                        <th style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>ATRIUM</th>
                        <th style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>STUDIO ONE</th>
                        <th style={{ padding: "12px 10px" }}>QUAD</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "12px", fontFamily: "Arial, sans-serif" }}>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>09:30</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Opening Ceremony</strong>
                          All contingents
                        </td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Monochromatic Mastery</strong>
                          Fine Arts &middot; solo
                        </td>
                        <td style={{ padding: "12px 10px", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>11:00</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase", color: "#ff238f" }}>Seven To Smoke</strong>
                          Performing &middot; solo
                        </td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Teqball Thunder</strong>
                          Informals &middot; pairs
                        </td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Ani-mate Your Fate</strong>
                          Fine Arts &middot; pairs
                        </td>
                        <td style={{ padding: "12px 10px", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>14:00</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase", color: "#ff238f" }}>Desi To Drip</strong>
                          Performing &middot; 8 to 10
                        </td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase", color: "#ff238f" }}>Mr. &amp; Ms. ILLENIUM™</strong>
                          Informals &middot; pairs
                        </td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Sustainacity</strong>
                          Business &middot; team of 4
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>16:30</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase", color: "#ff238f" }}>D.R.A.M.A</strong>
                          Performing &middot; 8 to 15
                        </td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Mirror, Mirror</strong>
                          Fine Arts &middot; pairs
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Vintage Vogue</strong>
                          Informals &middot; 8 to 15
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>18:30</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Homeroom Harmonies</strong>
                          Performing &middot; 4 to 8
                        </td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Stalls &amp; Informals</strong>
                          Open ground
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "1px solid rgba(7,7,7,0.18)", minWidth: "750px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)", textAlign: "left", fontFamily: '"Anton", Impact, sans-serif', fontSize: "14px", textTransform: "uppercase" }}>
                        <th style={{ padding: "12px 10px", width: "80px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>TIME</th>
                        <th style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>AUDITORIUM</th>
                        <th style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>ATRIUM</th>
                        <th style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>STUDIO ONE</th>
                        <th style={{ padding: "12px 10px" }}>QUAD</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "12px", fontFamily: "Arial, sans-serif" }}>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>10:00</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Advertainment</strong>
                          Business &middot; team of 4
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>11:30</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Filmy Fatka</strong>
                          Literary &middot; pairs
                        </td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>Design &amp; Decibels</strong>
                          Fine Arts &middot; pairs
                        </td>
                        <td style={{ padding: "12px 10px", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>13:30</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase" }}>J.A.M</strong>
                          Literary &middot; solo
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase", color: "#ff238f" }}>Last Ship Out</strong>
                          Business &middot; L3 team
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>15:00</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase", color: "#ff238f" }}>Master of the Streets</strong>
                          Performing &middot; L3 crew
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(7,7,7,0.18)" }}>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", fontWeight: 700 }}>17:30</td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)" }}>
                          <strong style={{ display: "block", fontFamily: '"Anton", Impact, sans-serif', fontSize: "15px", textTransform: "uppercase", color: "#ff238f" }}>Whose Plot Is It Anyway?</strong>
                          Theatre &middot; L3 final stage
                        </td>
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", borderRight: "1px solid rgba(7,7,7,0.18)", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                        <td style={{ padding: "12px 10px", background: "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,.04) 5px,rgba(0,0,0,.04) 6px)" }} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
