export type OutreachTone = "professional" | "conversational" | "in-depth";

export interface ConversationStarter {
  id: string;
  topic: string;
  starterText: string;
}

export interface AlumniProfile {
  id: string;
  name: string;
  initials: string;
  university: string;
  degree: string;
  graduationYear: number;
  currentRole: string;
  company: string;
  location: string;
  industry: string;
  fieldCategory: string;
  avatarColor: string;
  matchPercentage: number;
  skills: string[];
  relevanceExplanation: string;
  careerPath: string[];
  isAvailableForMentorship: boolean;
  conversationStarters: ConversationStarter[];
  personalizationRationale: string;
  outreachDrafts: Record<OutreachTone, { subject: string; body: string }>;
}

export interface CareerFieldCategory {
  name: string;
  iconName?: string;
  fields: string[];
}
