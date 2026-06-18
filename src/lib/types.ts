export interface TimelineEvent {
  year: string;
  description: string;
}

export interface EmotionPoint {
  year: string;
  value: number; // 0-100
}

export interface Storyline {
  id: number;
  title: string;
  summary: string;
  events: TimelineEvent[];
  emotionCurve: EmotionPoint[];
  snapshot: string;
}

export interface GenerationResult {
  storylines: Storyline[];
}

export interface ApiResponse {
  success: boolean;
  data?: GenerationResult;
  error?: string;
}
