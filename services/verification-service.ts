import { masterStore } from "@/services/master-store";

export type ScanResult = {
  status: "valid" | "pending" | "invalid" | "already_checked_in" | "checked_in";
  participant?: {
    id: string;
    illenium_id: string;
    full_name: string;
    college: string;
    photo_url?: string | null;
  };
  checkedInAt?: string;
  message?: string;
};

export async function verifyQrToken(token: string, eventId?: string): Promise<ScanResult> {
  const clean = token.trim();

  // Look up by ILLENIUM ID or internal profile ID
  const profile = masterStore.getProfileById(clean);

  if (!profile) {
    return { status: "invalid", message: "The QR or ID could not be verified." };
  }

  const safe = {
    id: profile.id,
    illenium_id: profile.illeniumId,
    full_name: profile.fullName,
    college: profile.collegeName,
    photo_url: profile.photoUrl ?? null,
  };

  if (profile.verificationStatus !== "verified") {
    return {
      status: "pending",
      participant: safe,
      message: "Verification required before entry.",
    };
  }

  // Check for duplicate check-in at same type + event
  if (eventId) {
    const existing = masterStore.getCheckIns().find(
      (c) =>
        c.participantId === profile.id &&
        c.checkInType === "event_entry" &&
        c.eventId === eventId
    );
    if (existing) {
      return {
        status: "already_checked_in",
        participant: safe,
        checkedInAt: existing.scannedAt,
        message: "Participant already checked in to this event.",
      };
    }
  }

  return { status: "valid", participant: safe, message: "Participant verified." };
}
