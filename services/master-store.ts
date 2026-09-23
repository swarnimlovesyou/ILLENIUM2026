export type UserRole =
  | 'cp'
  | 'vcp'
  | 'hod'
  | 'ahod'
  | 'oc'
  | 'cl'
  | 'acl'
  | 'participant'
  | 'npa'
  | 'prnc'
  | 'otse'
  | 'audience'
  | 'judge'
  | 'scoring_admin';

export type AccredCategory = 'cc' | 'prnc' | 'otse' | 'audience';
export type EventType = 'individual' | 'team' | 'contingent' | 'mixed';
export type EventStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'locked';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'requires_review';
export type WristbandStatus = 'active' | 'replaced' | 'revoked';
export type CheckInType = 'campus_entry' | 'event_entry' | 'goodie_distribution' | 'prize_distribution';
export type ScoreStatus = 'draft' | 'submitted' | 'locked' | 'corrected';
export type BidOutcome = 'pending' | 'correct' | 'no_bid' | 'incorrect';
export type AdjustmentType = 'penalty' | 'bonus' | 'correction';

export type Profile = {
  id: string;
  illeniumId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  category: AccredCategory;
  department?: string;
  collegeName: string;
  collegeRollNumber?: string;
  photoUrl?: string;
  verificationStatus: VerificationStatus;
};

export type Contingent = {
  id: string;
  code: string;
  name: string;
  collegeName: string;
  clProfileId?: string;
  aclProfileId?: string;
};

export type ScoringCriterion = {
  id: string;
  eventId: string;
  name: string;
  maxScore: number;
  weight: number;
  description?: string;
};

export type EventRecord = {
  id: string;
  code: string;
  name: string;
  category: string;
  venue: string;
  eventType: EventType;
  minTeamSize: number;
  maxTeamSize: number;
  startTime: string;
  reportingTime: string;
  status: EventStatus;
  biddingEnabled: boolean;
  bidPositivePts: number;
  bidNegativePts: number;
  bidDeadline: string;
};

export type WristbandRecord = {
  id: string;
  profileId: string;
  day: 1 | 2;
  tokenHash: string;
  status: WristbandStatus;
  issuedAt: string;
  issuedBy?: string;
};

export type CheckInRecord = {
  id: string;
  participantId: string;
  fullName: string;
  illeniumId: string;
  eventId?: string;
  eventName?: string;
  venueName?: string;
  checkInType: CheckInType;
  scannedBy: string;
  scannedAt: string;
  attendanceStatus: string;
};

export type JudgeScoreRecord = {
  id: string;
  eventId: string;
  judgeProfileId: string;
  participantId?: string;
  teamId?: string;
  criterionId: string;
  rawScore: number;
  maxScore: number;
  weight: number;
  calculatedScore: number;
  status: ScoreStatus;
  version: number;
  submittedAt: string;
};

export type ScoreCorrectionRecord = {
  id: string;
  judgeScoreId: string;
  requestedBy: string;
  oldRawScore: number;
  newRawScore: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  createdAt: string;
};

export type BidRecord = {
  id: string;
  eventId: string;
  contingentId?: string;
  profileId?: string;
  predictedRank: number;
  submittedAt: string;
  outcome: BidOutcome;
  pointsAwarded: number;
};

export type OCAdjustmentRecord = {
  id: string;
  eventId?: string;
  contingentId?: string;
  profileId?: string;
  type: AdjustmentType;
  pointsDelta: number;
  reason: string;
  authorizedBy: string;
  createdAt: string;
};

export type EventResultRecord = {
  id: string;
  eventId: string;
  participantId?: string;
  teamId?: string;
  contingentId: string;
  contingentCode: string;
  contingentName: string;
  totalRawScore: number;
  calculatedEventScore: number;
  rank: number;
  eventPoints: number;
  bidPoints: number;
  ocAdjustmentPoints: number;
  finalPoints: number;
  isLocked: boolean;
};

export type LeaderboardEntry = {
  contingentId: string;
  contingentCode: string;
  contingentName: string;
  collegeName: string;
  totalEventPoints: number;
  totalBiddingPoints: number;
  totalAdjustments: number;
  cumulativePoints: number;
  rank: number;
};

export type AuditLogRecord = {
  id: string;
  actorProfileId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  createdAt: string;
};

// Seed Profiles
const defaultProfiles: Profile[] = [
  {
    id: "p-cp",
    illeniumId: "ILL-26-CP001",
    fullName: "Swarnim Jambhrunkar",
    email: "cp@example.com",
    role: "cp",
    category: "cc",
    department: "Executive Committee",
    collegeName: "Atlas SkillTech University",
    verificationStatus: "verified"
  },
  {
    id: "p-cl-parth",
    illeniumId: "ILL-26-000001",
    fullName: "Parth Parmar",
    email: "parth@example.com",
    role: "cl",
    category: "cc",
    collegeName: "Atlas SkillTech University",
    collegeRollNumber: "ATLAS-2026-001",
    verificationStatus: "verified"
  },
  {
    id: "p-acl-riya",
    illeniumId: "ILL-26-000002",
    fullName: "Riya Sharma",
    email: "acl@example.com",
    role: "acl",
    category: "cc",
    collegeName: "Atlas SkillTech University",
    collegeRollNumber: "ATLAS-2026-002",
    verificationStatus: "verified"
  },
  {
    id: "p-oc-dev",
    illeniumId: "ILL-26-OC001",
    fullName: "Dev Patel",
    email: "oc@example.com",
    role: "oc",
    category: "cc",
    department: "Security & Operations",
    collegeName: "Atlas SkillTech University",
    verificationStatus: "verified"
  },
  {
    id: "p-judge-sen",
    illeniumId: "ILL-26-J001",
    fullName: "Vikramaditya Sen",
    email: "judge@example.com",
    role: "judge",
    category: "cc",
    department: "Performing Arts Judge",
    collegeName: "Industry Professional",
    verificationStatus: "verified"
  },
  {
    id: "p-scoring-iyer",
    illeniumId: "ILL-26-SA001",
    fullName: "Maya Iyer",
    email: "scoring@example.com",
    role: "scoring_admin",
    category: "cc",
    department: "Master Scoring & Tabulation",
    collegeName: "Atlas SkillTech University",
    verificationStatus: "verified"
  }
];

// Seed Contingents
const defaultContingents: Contingent[] = [
  {
    id: "c-cc01",
    code: "CC-01",
    name: "Atlas Titans",
    collegeName: "Atlas SkillTech University",
    clProfileId: "p-cl-parth",
    aclProfileId: "p-acl-riya"
  },
  {
    id: "c-cc02",
    code: "CC-02",
    name: "Xavier Spartans",
    collegeName: "St. Xavier's College",
  },
  {
    id: "c-cc03",
    code: "CC-03",
    name: "NMIMS Mavericks",
    collegeName: "NMIMS Mumbai",
  },
  {
    id: "c-cc04",
    code: "CC-04",
    name: "HR Strikers",
    collegeName: "HR College of Commerce",
  }
];

// Seed Events
const defaultEvents: EventRecord[] = [
  {
    id: "e-01",
    code: "E-101",
    name: "Seven To Smoke",
    category: "Performing Arts",
    venue: "Main Auditorium",
    eventType: "individual",
    minTeamSize: 1,
    maxTeamSize: 1,
    startTime: "2026-11-28T11:00:00.000Z",
    reportingTime: "2026-11-28T10:30:00.000Z",
    status: "open",
    biddingEnabled: true,
    bidPositivePts: 10,
    bidNegativePts: -5,
    bidDeadline: "2026-11-28T10:00:00.000Z"
  },
  {
    id: "e-02",
    code: "E-102",
    name: "Teqball Thunder",
    category: "Informals",
    venue: "Open Atrium",
    eventType: "team",
    minTeamSize: 2,
    maxTeamSize: 2,
    startTime: "2026-11-28T11:00:00.000Z",
    reportingTime: "2026-11-28T10:30:00.000Z",
    status: "open",
    biddingEnabled: true,
    bidPositivePts: 10,
    bidNegativePts: -5,
    bidDeadline: "2026-11-28T10:00:00.000Z"
  },
  {
    id: "e-03",
    code: "E-103",
    name: "Desi To Drip",
    category: "Fashion & Performing",
    venue: "Main Auditorium",
    eventType: "contingent",
    minTeamSize: 8,
    maxTeamSize: 10,
    startTime: "2026-11-28T14:00:00.000Z",
    reportingTime: "2026-11-28T13:30:00.000Z",
    status: "open",
    biddingEnabled: true,
    bidPositivePts: 15,
    bidNegativePts: -8,
    bidDeadline: "2026-11-28T13:00:00.000Z"
  },
  {
    id: "e-04",
    code: "E-104",
    name: "Mr. & Ms. Illenium™",
    category: "Flagship Informals",
    venue: "Atrium Stage",
    eventType: "individual",
    minTeamSize: 1,
    maxTeamSize: 2,
    startTime: "2026-11-28T14:00:00.000Z",
    reportingTime: "2026-11-28T13:30:00.000Z",
    status: "open",
    biddingEnabled: true,
    bidPositivePts: 20,
    bidNegativePts: -10,
    bidDeadline: "2026-11-28T13:00:00.000Z"
  },
  {
    id: "e-05",
    code: "E-105",
    name: "D.R.A.M.A (Street Play)",
    category: "Theatre & Drama",
    venue: "Quad Stage",
    eventType: "contingent",
    minTeamSize: 8,
    maxTeamSize: 15,
    startTime: "2026-11-28T16:30:00.000Z",
    reportingTime: "2026-11-28T16:00:00.000Z",
    status: "open",
    biddingEnabled: true,
    bidPositivePts: 15,
    bidNegativePts: -8,
    bidDeadline: "2026-11-28T15:30:00.000Z"
  }
];

// Seed Criteria
const defaultCriteria: ScoringCriterion[] = [
  { id: "sc-01-1", eventId: "e-01", name: "Technique & Form", maxScore: 100, weight: 1.0, description: "Precision and skill execution" },
  { id: "sc-01-2", eventId: "e-01", name: "Musicality & Rhythm", maxScore: 100, weight: 1.0, description: "Flow with beats" },
  { id: "sc-01-3", eventId: "e-01", name: "Stage Impact", maxScore: 100, weight: 1.0, description: "Crowd response and presence" },
  { id: "sc-03-1", eventId: "e-03", name: "Theme & Styling", maxScore: 100, weight: 1.0, description: "Garment design & aesthetics" },
  { id: "sc-03-2", eventId: "e-03", name: "Choreography", maxScore: 100, weight: 1.0, description: "Group coordination and movement" },
  { id: "sc-03-3", eventId: "e-03", name: "Over-all Showmanship", maxScore: 100, weight: 1.0, description: "Professional delivery" }
];

// In-Memory Global Store Holder
const storeHolder = globalThis as unknown as {
  __ILLENIUM_PROFILES__?: Profile[];
  __ILLENIUM_CONTINGENTS__?: Contingent[];
  __ILLENIUM_EVENTS__?: EventRecord[];
  __ILLENIUM_CRITERIA__?: ScoringCriterion[];
  __ILLENIUM_WRISTBANDS__?: WristbandRecord[];
  __ILLENIUM_CHECKINS__?: CheckInRecord[];
  __ILLENIUM_SCORES__?: JudgeScoreRecord[];
  __ILLENIUM_CORRECTIONS__?: ScoreCorrectionRecord[];
  __ILLENIUM_BIDS__?: BidRecord[];
  __ILLENIUM_ADJUSTMENTS__?: OCAdjustmentRecord[];
  __ILLENIUM_AUDIT__?: AuditLogRecord[];
};

if (!storeHolder.__ILLENIUM_PROFILES__) storeHolder.__ILLENIUM_PROFILES__ = [...defaultProfiles];
if (!storeHolder.__ILLENIUM_CONTINGENTS__) storeHolder.__ILLENIUM_CONTINGENTS__ = [...defaultContingents];
if (!storeHolder.__ILLENIUM_EVENTS__) storeHolder.__ILLENIUM_EVENTS__ = [...defaultEvents];
if (!storeHolder.__ILLENIUM_CRITERIA__) storeHolder.__ILLENIUM_CRITERIA__ = [...defaultCriteria];
if (!storeHolder.__ILLENIUM_WRISTBANDS__) storeHolder.__ILLENIUM_WRISTBANDS__ = [];
if (!storeHolder.__ILLENIUM_CHECKINS__) storeHolder.__ILLENIUM_CHECKINS__ = [];
if (!storeHolder.__ILLENIUM_SCORES__) storeHolder.__ILLENIUM_SCORES__ = [];
if (!storeHolder.__ILLENIUM_CORRECTIONS__) storeHolder.__ILLENIUM_CORRECTIONS__ = [];
if (!storeHolder.__ILLENIUM_BIDS__) storeHolder.__ILLENIUM_BIDS__ = [];
if (!storeHolder.__ILLENIUM_ADJUSTMENTS__) storeHolder.__ILLENIUM_ADJUSTMENTS__ = [];
if (!storeHolder.__ILLENIUM_AUDIT__) storeHolder.__ILLENIUM_AUDIT__ = [];

export const masterStore = {
  // Profiles
  getProfiles: () => storeHolder.__ILLENIUM_PROFILES__ || [],
  getProfileById: (id: string) => (storeHolder.__ILLENIUM_PROFILES__ || []).find((p) => p.id === id || p.illeniumId === id),
  getProfileByEmail: (email: string) => (storeHolder.__ILLENIUM_PROFILES__ || []).find((p) => p.email.toLowerCase() === email.toLowerCase()),
  addProfile: (profile: Profile) => {
    storeHolder.__ILLENIUM_PROFILES__?.unshift(profile);
    masterStore.logAudit("SYSTEM", "profile.created", "profile", profile.id, `Created profile for ${profile.fullName}`);
    return profile;
  },

  // Contingents
  getContingents: () => storeHolder.__ILLENIUM_CONTINGENTS__ || [],
  getContingentByCode: (code: string) => (storeHolder.__ILLENIUM_CONTINGENTS__ || []).find((c) => c.code === code || c.id === code),

  // Events & Criteria
  getEvents: () => storeHolder.__ILLENIUM_EVENTS__ || [],
  getEventById: (id: string) => (storeHolder.__ILLENIUM_EVENTS__ || []).find((e) => e.id === id || e.code === id),
  getCriteriaByEvent: (eventId: string) => (storeHolder.__ILLENIUM_CRITERIA__ || []).filter((c) => c.eventId === eventId),

  // Wristbands (Day 1 / Day 2 Mapped Tokens)
  getWristbands: () => storeHolder.__ILLENIUM_WRISTBANDS__ || [],
  issueWristband: (profileId: string, day: 1 | 2, tokenHash: string, issuedBy: string): WristbandRecord => {
    // Revoke any previous active wristband for same person and day
    const list = storeHolder.__ILLENIUM_WRISTBANDS__ || [];
    list.forEach((w) => {
      if (w.profileId === profileId && w.day === day && w.status === 'active') {
        w.status = 'replaced';
      }
    });

    const newWristband: WristbandRecord = {
      id: `wb-${Date.now()}`,
      profileId,
      day,
      tokenHash,
      status: 'active',
      issuedAt: new Date().toISOString(),
      issuedBy
    };
    list.unshift(newWristband);
    masterStore.logAudit(issuedBy, "wristband.issued", "wristband", newWristband.id, `Mapped Day ${day} wristband to ${profileId}`);
    return newWristband;
  },

  // Check-ins
  getCheckIns: () => storeHolder.__ILLENIUM_CHECKINS__ || [],
  addCheckIn: (checkIn: Omit<CheckInRecord, 'id' | 'scannedAt'>): { ok: boolean; message: string; record?: CheckInRecord } => {
    const list = storeHolder.__ILLENIUM_CHECKINS__ || [];
    const exists = list.some(
      (c) => c.participantId === checkIn.participantId && c.checkInType === checkIn.checkInType && (c.eventId === checkIn.eventId || (!c.eventId && !checkIn.eventId))
    );

    if (exists) {
      return { ok: false, message: "Already checked in at this checkpoint." };
    }

    const record: CheckInRecord = {
      ...checkIn,
      id: `chk-${Date.now()}`,
      scannedAt: new Date().toISOString()
    };
    list.unshift(record);
    masterStore.logAudit(checkIn.scannedBy, "checkin.created", "check_in", record.id, `Check-in recorded for ${checkIn.fullName}`);
    return { ok: true, message: "Check-in accepted.", record };
  },

  // Judge Scores
  getScores: () => storeHolder.__ILLENIUM_SCORES__ || [],
  submitJudgeScore: (score: Omit<JudgeScoreRecord, 'id' | 'submittedAt'>): JudgeScoreRecord => {
    const list = storeHolder.__ILLENIUM_SCORES__ || [];
    const record: JudgeScoreRecord = {
      ...score,
      id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      submittedAt: new Date().toISOString()
    };
    list.unshift(record);
    masterStore.logAudit(score.judgeProfileId, "score.submitted", "judge_score", record.id, `Judge score ${score.rawScore} submitted`);
    return record;
  },

  // Bids
  getBids: () => storeHolder.__ILLENIUM_BIDS__ || [],
  placeBid: (bid: Omit<BidRecord, 'id' | 'submittedAt' | 'outcome' | 'pointsAwarded'>): BidRecord => {
    const list = storeHolder.__ILLENIUM_BIDS__ || [];
    const record: BidRecord = {
      ...bid,
      id: `bid-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      outcome: 'pending',
      pointsAwarded: 0
    };
    list.unshift(record);
    masterStore.logAudit(bid.profileId || "CL", "bid.placed", "bid", record.id, `Rank prediction ${bid.predictedRank} submitted`);
    return record;
  },

  // OC Adjustments
  getAdjustments: () => storeHolder.__ILLENIUM_ADJUSTMENTS__ || [],
  addAdjustment: (adj: Omit<OCAdjustmentRecord, 'id' | 'createdAt'>): OCAdjustmentRecord => {
    const list = storeHolder.__ILLENIUM_ADJUSTMENTS__ || [];
    const record: OCAdjustmentRecord = {
      ...adj,
      id: `adj-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(record);
    masterStore.logAudit(adj.authorizedBy, "adjustment.created", "oc_adjustment", record.id, `Adjustment ${adj.pointsDelta} pts: ${adj.reason}`);
    return record;
  },

  // Composite Leaderboard Calculation Pipeline
  getLeaderboard: (): LeaderboardEntry[] => {
    const contingents = masterStore.getContingents();
    const adjustments = masterStore.getAdjustments();
    const bids = masterStore.getBids();
    const scores = masterStore.getScores();

    return contingents.map((cont, index) => {
      // Sum OC Adjustments
      const contAdjs = adjustments.filter((a) => a.contingentId === cont.id);
      const adjPoints = contAdjs.reduce((sum, a) => sum + a.pointsDelta, 0);

      // Sum Bidding Points
      const contBids = bids.filter((b) => b.contingentId === cont.id);
      const bidPoints = contBids.reduce((sum, b) => sum + b.pointsAwarded, 0);

      // Base event points mock calculation
      const baseEventPoints = (contingents.length - index) * 50 + (scores.length > 0 ? 30 : 0);

      const cumulative = baseEventPoints + bidPoints + adjPoints;

      return {
        contingentId: cont.id,
        contingentCode: cont.code,
        contingentName: cont.name,
        collegeName: cont.collegeName,
        totalEventPoints: baseEventPoints,
        totalBiddingPoints: bidPoints,
        totalAdjustments: adjPoints,
        cumulativePoints: Math.max(0, cumulative),
        rank: index + 1
      };
    }).sort((a, b) => b.cumulativePoints - a.cumulativePoints).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  },

  // Audit Logs
  getAuditLogs: () => storeHolder.__ILLENIUM_AUDIT__ || [],
  logAudit: (actorId: string, action: string, entityType: string, entityId?: string, details: string = "") => {
    const actor = masterStore.getProfileById(actorId);
    const log: AuditLogRecord = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      actorProfileId: actorId,
      actorName: actor?.fullName || "System Admin",
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString()
    };
    storeHolder.__ILLENIUM_AUDIT__?.unshift(log);
  }
};
