"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Same photos used in the original Wall
const PHOTOS = [
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1548625149-720754960685?auto=format&fit=crop&w=800&q=80",
];

export default function IlleniumWallHome() {
  const [open, setOpen] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  // Exact JS logic from index.html
  useEffect(() => {
    const stage = stageRef.current;
    const wall = wallRef.current;
    if (!stage || !wall) return;

    // Build tiles exactly as original
    wall.innerHTML = "";
    const tileW = 280, tileH = 200, gutter = 18, cols = 9, rows = 7;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.style.width = `${tileW}px`;
        tile.style.height = `${tileH}px`;
        tile.style.left = `${c * (tileW + gutter)}px`;
        tile.style.top = `${r * (tileH + gutter)}px`;

        const img = document.createElement("img");
        img.src = PHOTOS[(r * cols + c) % PHOTOS.length];
        img.alt = `Illenium archive ${r * cols + c + 1}`;
        img.loading = "lazy";

        const num = document.createElement("span");
        num.className = "n";
        num.textContent = String((r * cols + c + 1) % 100).padStart(2, "0");

        tile.appendChild(img);
        tile.appendChild(num);
        wall.appendChild(tile);
      }
    }

    // Centre the wall
    const totalW = cols * tileW + (cols - 1) * gutter;
    const totalH = rows * tileH + (rows - 1) * gutter;
    let cx = (window.innerWidth - totalW) / 2;
    let cy = (window.innerHeight - totalH) / 2;

    wall.style.transform = `translate3d(${cx}px,${cy}px,0)`;

    // Drag logic — exactly as original
    let dragging = false;
    let ox = 0, oy = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      ox = e.clientX - cx;
      oy = e.clientY - cy;
      stage.classList.add("drag");
      stage.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      cx = e.clientX - ox;
      cy = e.clientY - oy;
      wall.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    };
    const up = () => {
      dragging = false;
      stage.classList.remove("drag");
    };

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);

    return () => {
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
    };
  }, []);

  function close() { setOpen(null); }
  const scrimOn = open !== null;

  return (
    <>
      {/* Stage */}
      <div id="stage" ref={stageRef}>
        <div id="wall" ref={wallRef} />
      </div>

      {/* Fog */}
      <div id="fog" />

      {/* Mark */}
      <div id="mark">
        <div className="anton w">ILLENIUM<sup className="tmk">™</sup></div>
        <div className="s">CREATE A LEGACY</div>
      </div>

      {/* HUD top-left */}
      <div className="hud tl">
        <div className="m">28 &amp; 29 November 2026</div>
        <div className="d">Atlas SkillTech University, Kurla West, Mumbai.<br />Mumbai's premier intercollegiate festival.</div>
      </div>

      {/* HUD top-right */}
      <div className="hud tr">
        <button type="button" onClick={() => setOpen("events")}>Events</button>
        <button type="button" onClick={() => setOpen("schedule")}>Schedule</button>
        <button type="button" onClick={() => setOpen("legacy")}>Legacy</button>
        <button type="button" onClick={() => setOpen("info")}>Info</button>
        <button type="button" className="go" onClick={() => setOpen("register")}>Register</button>
        <Link href="/auth/login" style={{ color: "var(--mag)", fontWeight: 700 }}>Portal</Link>
      </div>

      {/* HUD bottom */}
      <div className="hud bl">Every photograph here is from a previous edition.</div>
      <div className="hud br"><span>Drag to move</span><kbd>&#8596;</kbd></div>

      {/* Scrim */}
      <div id="scrim" className={scrimOn ? "on" : ""} onClick={close} />

      {/* PANEL: Events */}
      <section className={`panel${open === "events" ? " on" : ""}`} aria-hidden={open !== "events"}>
        <button type="button" className="x" onClick={close}>Close</button>
        <h2>Twenty<br />events</h2>
        <p className="lede">Five categories. Level three carries the most championship points and every level three event is open to contingents. The points go to the college, not the person.</p>
        <div className="run">
          <Link href="/events" className="L3">Seven To Smoke <span className="s">·</span> Performing Arts</Link><br />
          <Link href="/events" className="L2">Teqball Thunder <span className="s">·</span> Informals</Link><br />
          <Link href="/events" className="L3">Desi To Drip <span className="s">·</span> Fashion &amp; Dance</Link><br />
          <Link href="/events" className="L3">Mr. &amp; Ms. Illenium<sup className="tmks">™</sup> <span className="s">·</span> Flagship</Link><br />
          <Link href="/events" className="L2">D.R.A.M.A <span className="s">·</span> Street Play</Link><br />
          <Link href="/events" className="L1">Homeroom Harmonies <span className="s">·</span> Performing</Link><br />
          <Link href="/events" className="L1">Monochromatic Mastery <span className="s">·</span> Fine Arts</Link><br />
          <Link href="/events" className="L1">Sustainacity <span className="s">·</span> Business</Link>
        </div>
      </section>

      {/* PANEL: Schedule */}
      <section className={`panel${open === "schedule" ? " on" : ""}`} aria-hidden={open !== "schedule"}>
        <button type="button" className="x" onClick={close}>Close</button>
        <h2>Day one</h2>
        <p className="lede">Five venues running in parallel. Anyone entered in two overlapping events is flagged before the timetable is published.</p>
        <div className="tt">
          <table>
            <thead>
              <tr><th>Time</th><th>Auditorium</th><th>Atrium</th><th>Studio One</th><th>Quad</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>09:30</td>
                <td><b>Opening Ceremony</b><i>All contingents</i></td>
                <td className="nil" />
                <td><b>Monochromatic Mastery</b><i>Fine Arts · solo</i></td>
                <td className="nil" />
              </tr>
              <tr>
                <td>11:00</td>
                <td><b>Seven To Smoke</b><i>Performing · solo</i></td>
                <td><b>Teqball Thunder</b><i>Informals · pairs</i></td>
                <td><b>Ani-mate Your Fate</b><i>Fine Arts · pairs</i></td>
                <td className="nil" />
              </tr>
              <tr>
                <td>14:00</td>
                <td><b>Desi To Drip</b><i>Performing · 8 to 10</i></td>
                <td><b>Mr. &amp; Ms. Illenium<sup className="tmks">™</sup></b><i>Informals · pairs</i></td>
                <td className="nil" />
                <td><b>Sustainacity</b><i>Business · team of 4</i></td>
              </tr>
              <tr>
                <td>16:30</td>
                <td><b>D.R.A.M.A</b><i>Performing · 8 to 15</i></td>
                <td className="nil" />
                <td><b>Mirror, Mirror</b><i>Fine Arts · pairs</i></td>
                <td><b>Vintage Vogue</b><i>Informals · 8 to 15</i></td>
              </tr>
              <tr>
                <td>18:30</td>
                <td><b>Homeroom Harmonies</b><i>Performing · 4 to 8</i></td>
                <td className="nil" />
                <td className="nil" />
                <td><b>Stalls &amp; Informals</b><i>Open ground</i></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* PANEL: Legacy */}
      <section className={`panel${open === "legacy" ? " on" : ""}`} aria-hidden={open !== "legacy"}>
        <button type="button" className="x" onClick={close}>Close</button>
        <h2>The mark<br />has already<br />been made</h2>
        <p className="lede">ILLENIUM<sup className="tmks">™</sup> is one of the only intercollegiate fests in India whose legacy has been trademarked. Film, music and industry names have opened and closed it, and it has been judged by people working in the fields they judge.</p>
        <div className="mosaic">
          <figure className="m-a"><img src={PHOTOS[0]} alt="Illenium crowd" /></figure>
          <figure className="m-b"><img src={PHOTOS[1]} alt="Illenium stage" /></figure>
          <figure className="m-c"><img src={PHOTOS[2]} alt="Illenium performance" /></figure>
          <figure className="m-d"><img src={PHOTOS[3]} alt="Illenium moment" /></figure>
          <figure className="m-d"><img src={PHOTOS[4]} alt="Illenium energy" /></figure>
        </div>
        <p className="mcap">Photographed by the Photography &amp; Videography department across previous editions.</p>
      </section>

      {/* PANEL: Info */}
      <section className={`panel${open === "info" ? " on" : ""}`} aria-hidden={open !== "info"}>
        <button type="button" className="x" onClick={close}>Close</button>
        <h2>Where,<br />when, who</h2>
        <div className="cols">
          <div>
            <b>Where</b>Atlas SkillTech University<br />Equinox Business Park<br />Ambedkar Nagar, Kurla West<br />Mumbai 400070<br />Nearest station: Kurla
          </div>
          <div>
            <b>When</b>Saturday 28 November 2026<br />Sunday 29 November 2026<br />Contingent leaders' meet precedes the fest
          </div>
          <div>
            <b>Contact</b>
            <a className="lnk" href="mailto:events.illenium@atlasskilltech.university">events.illenium@atlasskilltech.university</a><br />
            <a className="lnk" href="https://wa.me/919820773181">Outreach on WhatsApp</a><br />
            <a className="lnk" href="https://instagram.com/illeniumfest">Instagram</a> &middot; <a className="lnk" href="https://youtube.com/@illeniumbyisme5340">YouTube</a>
          </div>
          <div>
            <b>Conduct</b>Rules and regulations<br />Code of conduct<br />Terms · Privacy<br />Cancellations and refunds
          </div>
          <div>
            <b>Run by</b>The Executive Committee<br />Three hundred students across fourteen departments
          </div>
        </div>
        <p className="credit">ILLENIUM™ is a registered mark of Atlas SkillTech University.</p>
      </section>

      {/* PANEL: Register */}
      <section className={`panel${open === "register" ? " on" : ""}`} aria-hidden={open !== "register"}>
        <button type="button" className="x" onClick={close}>Close</button>
        <h2>Bring your<br />college</h2>
        <p className="lede">One student claims the college and becomes its contingent leader. They add the roster, enter the events, and collect a sealed envelope of credentials at the contingent leaders' meet. Everything after that runs through them.</p>
        <div className="run" style={{ lineHeight: 1.1 }}>
          <Link href="/register" className="L3">Register your contingent</Link><br />
          <Link href="/register" className="L2">Become a campus ambassador</Link><br />
          <Link href="/register" className="L1">Enter as an independent</Link>
        </div>
        <p className="mcap" style={{ marginTop: 26 }}>Registration opens with the brochure.</p>
      </section>
    </>
  );
}
