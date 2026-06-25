export interface WeekPlan {
  week: number;
  focus: string;
  tasks: string[];
}

export interface CoachingPlan {
  goal: string;
  weeks: WeekPlan[];
}
