import { NextResponse } from "next/server";
import { masterStore, CheckInType } from "@/services/master-store";
import { verifyQrToken } from "@/services/verification-service";

export async function POST(request: Request) {
  try {
    const json = await request.json() as {
      token?: string;
      checkInType?: string;
      eventId?: string;
    };

    const token = json.token?.trim();
    if (!token) {
      return NextResponse.json({ ok: false, message: "Token required." }, { status: 400 });
    }

    const checkInType = (json.checkInType ?? "campus_entry") as CheckInType;
    const eventId = json.eventId;

    // Verify first
    const verification = await verifyQrToken(token, eventId);

    if (!verification.participant || verification.status === "invalid") {
      return NextResponse.json({ ok: false, message: verification.message ?? "Invalid token." }, { status: 400 });
    }

    if (verification.status === "already_checked_in") {
      return NextResponse.json({
        ok: false,
        message: "Already checked in.",
        checkedInAt: verification.checkedInAt,
      }, { status: 409 });
    }

    const profile = masterStore.getProfileById(verification.participant.id);
    if (!profile) {
      return NextResponse.json({ ok: false, message: "Profile not found." }, { status: 404 });
    }

    const event = eventId ? masterStore.getEventById(eventId) : undefined;

    const result = masterStore.addCheckIn({
      participantId: profile.id,
      fullName: profile.fullName,
      illeniumId: profile.illeniumId,
      eventId: event?.id,
      eventName: event?.name,
      venueName: event?.venue,
      checkInType,
      scannedBy: "p-oc-dev",
      attendanceStatus: "accepted",
    });

    return NextResponse.json({
      ok: result.ok,
      message: result.message,
    }, { status: result.ok ? 200 : 409 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Check-in could not be recorded.";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

export async function GET() {
  const checkIns = masterStore.getCheckIns();
  return NextResponse.json(checkIns);
}
