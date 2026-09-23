"use server";
import { masterStore } from "@/services/master-store";

export async function approveParticipant(formData: FormData) {
  const profileId = String(formData.get("participantId"));
  const profiles = masterStore.getProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (profile) {
    profile.verificationStatus = "verified";
    masterStore.logAudit("p-cp", "profile.verified", "profile", profile.id, `Approved identity for ${profile.fullName}`);
  }
}

export async function rejectParticipant(formData: FormData) {
  const profileId = String(formData.get("participantId"));
  const profiles = masterStore.getProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (profile) {
    profile.verificationStatus = "rejected";
    masterStore.logAudit("p-cp", "profile.rejected", "profile", profile.id, `Rejected identity for ${profile.fullName}`);
  }
}
