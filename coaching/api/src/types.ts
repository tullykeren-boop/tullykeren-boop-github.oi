export interface WeekPlan {
  week: number;
  focus: string;
  tasks: string[];
}

export interface CoachingPlan {
  goal: string;
  weeks: WeekPlan[];
}

export interface GenerateRequest {
  goal: string;
}

export interface GenerateResponse {
  plan: CoachingPlan;
}

export interface ErrorResponse {
  error: string;
}
