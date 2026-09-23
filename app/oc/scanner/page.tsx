"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { RoleShell } from "@/components/layout/role-shell";
import {
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Building2,
  User,
  ShieldCheck,
  Zap,
  RotateCcw
} from "lucide-react";

type Result = {
  status: string;
  message?: string;
  participant?: { full_name: string; illenium_id: string; college: string };
  checkedInAt?: string;
};

function ScannerContent() {
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [mode, setMode] = useState<"event_entry" | "campus_entry">(
    searchParams.get("mode") === "campus_entry" ? "campus_entry" : "event_entry"
  );
  const [eventId] = useState(searchParams.get("event") ?? "");
  const [manual, setManual] = useState("");
  const [activeToken, setActiveToken] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  async function verify(token: string) {
    const clean = token.trim();
    if (!clean) return setError("Enter an ILLENIUM ID or scan a QR code first.");
    setError("");
    setActiveToken(clean);
    setScanning(false);
    try {
      const response = await fetch("/api/verification", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: clean, eventId: eventId || undefined })
      });
      setResult((await response.json()) as Result);
    } catch {
      setError("Network or verification request failed.");
    }
  }

  async function start() {
    setError("");
    setResult(null);
    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;
      setScanning(true);
      await reader.decodeFromConstraints(
        { video: { facingMode: { ideal: "environment" } } },
        videoRef.current!,
        async (decoded) => {
          if (decoded) await verify(decoded.getText());
        }
      );
    } catch {
      setScanning(false);
      setError("Camera access is blocked or unavailable. Enter ID manually below.");
    }
  }

  function stop() {
    setScanning(false);
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    readerRef.current = null;
  }

  useEffect(() => () => stop(), []);

  async function checkIn() {
    if (!result?.participant) return;
    try {
      const response = await fetch("/api/check-ins", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token: activeToken || manual,
          checkInType: mode,
          eventId: eventId || undefined
        })
      });
      const body = (await response.json()) as { message?: string; ok?: boolean };
      setResult({
        ...result,
        status: body.ok
          ? "checked_in"
          : body.message === "Already checked in."
          ? "already_checked_in"
          : "invalid",
        message: body.message ?? (body.ok ? "Check-in saved successfully." : "Check-in failed.")
      });
    } catch {
      setError("Failed to record check-in.");
    }
  }

  const valid = result?.status === "valid";

  return (
    <RoleShell role="oc">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "rgba(0, 229, 255, 0.1)",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--cyan)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "0.5rem"
              }}
            >
              <QrCode size={13} />
              Gate & Access Scanner
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>High-Speed Verification Scanner</h1>
            <p style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
              {mode === "event_entry"
                ? "Event entry gate: Scan participant wristband or QR to validate registration."
                : "Main campus gate: Validate physical wristband activation and entry authorization."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", background: "var(--bg-surface)", padding: "0.35rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}>
            <button
              onClick={() => setMode("event_entry")}
              className={`btn btn-sm ${mode === "event_entry" ? "btn-primary" : "btn-ghost"}`}
            >
              Event Entry
            </button>
            <button
              onClick={() => setMode("campus_entry")}
              className={`btn btn-sm ${mode === "campus_entry" ? "btn-primary" : "btn-ghost"}`}
            >
              Campus Main Gate
            </button>
          </div>
        </div>

        {/* Scanner & Manual Fallback Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem"
          }}
        >
          {/* Camera Viewport Panel */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card-header" style={{ marginBottom: 0 }}>
              <h3 className="card-title">
                <Camera size={18} style={{ color: "var(--cyan)" }} />
                Camera Feed
              </h3>
              <span className={`badge ${scanning ? "badge-acid" : "badge-neutral"}`}>
                {scanning ? "Live Feed Active" : "Camera Idle"}
              </span>
            </div>

            <div
              style={{
                position: "relative",
                width: "100%",
                height: "280px",
                background: "#000",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--line)"
              }}
            >
              <video
                ref={videoRef}
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {/* Aiming Reticle */}
              <div
                style={{
                  position: "absolute",
                  width: "180px",
                  height: "180px",
                  border: "2px dashed var(--acid)",
                  borderRadius: "12px",
                  pointerEvents: "none",
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)"
                }}
              />

              {!scanning && (
                <div
                  style={{
                    position: "absolute",
                    textAlign: "center",
                    padding: "1rem",
                    color: "var(--bone-dim)",
                    fontSize: "0.85rem"
                  }}
                >
                  <Camera size={32} style={{ margin: "0 auto 0.5rem", opacity: 0.5 }} />
                  Click "Start Camera" to scan QR code
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={start}
                className="btn btn-primary"
                style={{ flex: 1, gap: "0.4rem" }}
              >
                <Camera size={15} />
                <span>{scanning ? "Restart Camera" : "Start Camera"}</span>
              </button>
              {scanning && (
                <button
                  onClick={stop}
                  className="btn btn-secondary"
                  style={{ gap: "0.4rem" }}
                >
                  <RotateCcw size={15} />
                  <span>Stop</span>
                </button>
              )}
            </div>

            {error && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255, 45, 111, 0.1)",
                  border: "1px solid rgba(255, 45, 111, 0.3)",
                  color: "var(--mag)",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Manual Entry & Verification Result Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Manual Lookup */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Search size={18} style={{ color: "var(--acid)" }} />
                  Manual ID or Token Verification
                </h3>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  className="form-control mono"
                  placeholder="e.g. ILL-26-000123"
                  value={manual}
                  onChange={(e) => setManual(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") verify(manual);
                  }}
                />
                <button
                  onClick={() => verify(manual)}
                  className="btn btn-secondary"
                  style={{ gap: "0.4rem" }}
                >
                  <Search size={14} />
                  <span>Verify</span>
                </button>
              </div>
            </div>

            {/* Scan Result Card */}
            {result && (
              <div
                className="card"
                style={{
                  borderColor:
                    valid || result.status === "checked_in"
                      ? "rgba(216, 255, 46, 0.4)"
                      : result.status === "already_checked_in"
                      ? "rgba(245, 158, 11, 0.4)"
                      : "rgba(255, 45, 111, 0.4)",
                  background:
                    valid || result.status === "checked_in"
                      ? "rgba(216, 255, 46, 0.05)"
                      : result.status === "already_checked_in"
                      ? "rgba(245, 158, 11, 0.05)"
                      : "rgba(255, 45, 111, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span
                    className={`badge ${
                      valid || result.status === "checked_in"
                        ? "badge-acid"
                        : result.status === "already_checked_in"
                        ? "badge-gold"
                        : "badge-crimson"
                    }`}
                  >
                    {result.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--dim)" }}>
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                {result.participant && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--bone)" }}>
                      {result.participant.full_name}
                    </div>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.85rem", color: "var(--bone-dim)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <User size={13} style={{ color: "var(--acid)" }} />
                        <span className="mono">{result.participant.illenium_id}</span>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Building2 size={13} style={{ color: "var(--bone-dim)" }} />
                        <span>{result.participant.college}</span>
                      </span>
                    </div>

                    {valid && (
                      <button
                        onClick={checkIn}
                        className="btn btn-primary"
                        style={{ marginTop: "1rem", width: "100%", gap: "0.5rem" }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Confirm & Record Entry</span>
                      </button>
                    )}
                  </div>
                )}

                {result.message && (
                  <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--bone-dim)" }}>
                    {result.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleShell>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="workspace-content">Loading scanner...</div>}>
      <ScannerContent />
    </Suspense>
  );
}
