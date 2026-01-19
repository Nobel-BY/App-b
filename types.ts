
export interface WorkoutSet {
  weight: number;
  reps: number;
}

export interface WorkoutExercise {
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutRecord {
  startTime: string;
  duration: number; // minutes
  bodyParts: string[];
  intensity: number; // 1-5
  warmup: string;
  exercises: WorkoutExercise[];
}

export interface DiaryEntry {
  id: string;
  timestamp: number;
  content: string;
  rating: number; // 1-5 stars
  weather?: string; // Custom text
  tags?: string[];
  workout?: WorkoutRecord; // Optional workout module
}

export interface HealthMetrics {
  height: number; // cm
  weight: number; // kg
  bodyFatPercentage?: number; // %
  muscleMass?: number; // kg
  visceralFatLevel?: number; // level 1-59 usually
  lastUpdated: number;
  gender?: 'male' | 'female';
}

export interface HealthAdvice {
  bmi: number;
  status: string;
  advice: string;
}

export enum AppTab {
  DIARY = 'DIARY',
  HEALTH = 'HEALTH'
}
