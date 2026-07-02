export interface FoodLog {
  id: string;
  timestamp: number;
  day: number;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  compliant: boolean;
  complianceMessage: string;
  detectedAvoidedItems: string[];
  enzymeDosageRecommendation: string;
  metabolicTip: string;
  imageUrl?: string; // Base64 or local blob URL
}

export interface EnzymeSlot {
  time: string;
  taken: boolean;
}

export interface DailyProgress {
  day: number;
  waterIntake: number; // in ml
  enzymeSlots: EnzymeSlot[]; // List of time slots for that specific day
}

export interface ProgramPhase {
  name: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  enzymeDosage: string;
  enzymeSchedule: string[];
  waterTarget: string;
}

export interface ProgramMetadata {
  phases: ProgramPhase[];
  avoidList: string[];
  notRecommendedFor: string[];
}

export interface ChatMessage {
  sender: "user" | "coach" | "system";
  text: string;
  timestamp: number;
}
