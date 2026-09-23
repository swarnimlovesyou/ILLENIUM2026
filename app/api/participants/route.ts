import { NextResponse } from "next/server";
import { masterStore, Profile, AccredCategory, UserRole } from "@/services/master-store";

export async function POST(request: Request) {
  try {
    const json = await request.json() as {
      fullName?: string;
      email?: string;
      phone?: string;
      collegeName?: string;
      collegeRollNumber?: string;
      role?: string;
      category?: string;
    };

    if (!json.fullName || !json.email) {
      return NextResponse.json({ message: "fullName and email are required." }, { status: 400 });
    }

    // Check for duplicates
    const existing = masterStore.getProfileByEmail(json.email);
    if (existing) {
      return NextResponse.json({ message: "A profile with this email already exists.", participantId: existing.id }, { status: 409 });
    }

    const count = masterStore.getProfiles().filter((p) => p.illeniumId.startsWith("ILL-26-")).length + 1;
    const illeniumId = `ILL-26-${String(count).padStart(6, "0")}`;

    const profile: Profile = {
      id: `p-${Date.now()}`,
      illeniumId,
      fullName: json.fullName,
      email: json.email,
      phone: json.phone,
      role: (json.role ?? "participant") as UserRole,
      category: (json.category ?? "cc") as AccredCategory,
      collegeName: json.collegeName ?? "Atlas SkillTech University",
      collegeRollNumber: json.collegeRollNumber,
      verificationStatus: "pending",
    };

    masterStore.addProfile(profile);

    return NextResponse.json({
      participantId: profile.id,
      illeniumId: profile.illeniumId,
      registeredEmail: profile.email,
    }, { status: 201 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error during registration.";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(masterStore.getProfiles());
}
