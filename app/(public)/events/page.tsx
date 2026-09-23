"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicNav } from "@/components/layout/public-nav";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Trophy,
  Filter,
  Flame,
  Users
} from "lucide-react";

interface EventItem {
  id: string;
  code: string;
  name: string;
  category: string;
  venue: string;
  time: string;
  description: string;
  eventType: string;
  teamSize: string;
  status: string;
  slug?: string;
  isFlagship?: boolean;
}

const ALL_EVENTS: EventItem[] = [
  {
    id: "e-05",
    code: "E-105",
    name: "D.R.A.M.A (Street Play)",
    category: "Theatre & Drama",
    venue: "Quad Stage (Open Air)",
    time: "Day 1 · 16:30 IST",
    description: "High-octane satire, choral movement, and commanding street theatre in front of the campus crowd.",
    eventType: "Contingent",
    teamSize: "8–15 Performers",
    status: "open",
    slug: "drama",
    isFlagship: true
  },
  {
    id: "e-01",
    code: "E-101",
    name: "Seven To Smoke",
    category: "Performing Arts",
    venue: "Main Auditorium",
    time: "Day 1 · 11:00 IST",
    description: "The ultimate 1v1 cypher battle where dancers battle back-to-back until seven consecutive victories.",
    eventType: "Individual",
    teamSize: "1 Dancer",
    status: "open",
    isFlagship: true
  },
  {
    id: "e-02",
    code: "E-102",
    name: "Teqball Thunder",
    category: "Informals & Sports",
    venue: "Open Atrium",
    time: "Day 1 · 11:00 IST",
    description: "Fast-paced curved table-tennis soccer tournament requiring pinpoint ball mastery and reflexes.",
    eventType: "Team",
    teamSize: "Pairs (2 Players)",
    status: "open"
  },
  {
    id: "e-03",
    code: "E-103",
    name: "Desi To Drip",
    category: "Fashion & Performing",
    venue: "Main Auditorium",
    time: "Day 1 · 14:00 IST",
    description: "High-fashion runway choreography merging indigenous textiles with futuristic streetwear aesthetics.",
    eventType: "Contingent",
    teamSize: "8–10 Models",
    status: "open",
    isFlagship: true
  },
  {
    id: "e-04",
    code: "E-104",
    name: "Mr. & Ms. Illenium™",
    category: "Flagship Informals",
    venue: "Atrium Stage",
    time: "Day 1 · 14:00 IST",
    description: "The definitive personality and stage-presence pageant testing wit, talent, and crowd charisma.",
    eventType: "Pairs",
    teamSize: "Pairs (2 Contenders)",
    status: "open"
  },
  {
    id: "e-06",
    code: "E-106",
    name: "Monochromatic Mastery",
    category: "Fine Arts",
    venue: "Studio One",
    time: "Day 1 · 09:30 IST",
    description: "Live black, white, and grayscale canvas creation under strict 90-minute time limits.",
    eventType: "Individual",
    teamSize: "Solo (1 Artist)",
    status: "open"
  }
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Theatre & Drama", "Performing Arts", "Fashion & Performing", "Informals & Sports", "Fine Arts"];

  const filteredEvents = ALL_EVENTS.filter((ev) =>
    selectedCategory === "All" ? true : ev.category.includes(selectedCategory)
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--bone)", display: "flex", flexDirection: "column" }}>
      {/* Universal Public Navigation */}
      <PublicNav />

      {/* Main Programme Section */}
      <main style={{ flex: 1, maxWidth: "1240px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem", width: "100%" }}>
        {/* Header Hero */}
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
              marginBottom: "0.75rem"
            }}
          >
            <Sparkles size={13} />
            ILLENIUM 2026 Programme
          </div>

          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Choose your <span style={{ color: "var(--acid)" }}>moment.</span>
          </h1>

          <p style={{ marginTop: "0.75rem", fontSize: "1.1rem", color: "var(--bone-dim)", maxWidth: "620px", lineHeight: 1.6 }}>
            Browse open verticals, inspect scoring criteria, and explore dedicated competition microsites.
            Contingent championship points are credited to participating colleges.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
            marginBottom: "2rem"
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
                  padding: "0.45rem 0.9rem",
                  borderRadius: "999px",
                  fontSize: "0.825rem",
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

        {/* Featured Banner: DRAMA Microsite Callout */}
        <div
          style={{
            padding: "1.75rem 2rem",
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
            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>
              D.R.A.M.A (Street Play) Dedicated Arena
            </h3>
            <p style={{ margin: "0.35rem 0 0", color: "var(--bone-dim)", fontSize: "0.9rem", maxWidth: "650px" }}>
              Explore the dedicated event microsite featuring full competition briefing, acoustic guidelines,
              360° Quad Stage rules, and live production archive gallery.
            </p>
          </div>

          <Link
            href="/events/drama"
            className="btn btn-primary btn-md"
            style={{ gap: "0.5rem", fontWeight: 700 }}
          >
            <span>Explore Drama Page</span>
            <ArrowRight size={16} />
          </Link>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>
                      {event.category}
                    </span>
                    <span className="mono" style={{ fontSize: "0.75rem", color: isDrama ? "var(--acid)" : "var(--dim)", fontWeight: 600 }}>
                      {event.code}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    {event.name}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--bone-dim)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
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
                      href="/register"
                      className="btn btn-secondary btn-sm"
                      style={{ width: "100%", justifyContent: "center", gap: "0.4rem" }}
                    >
                      <span>Register for Event</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
