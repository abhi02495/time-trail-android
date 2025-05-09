
export interface Activity {
  id: string;
  name: string;
  color: string;
  icon?: string;
  streaks: Record<string, boolean>;
  created_at: string;
}

export type TimeView = 'week' | 'month' | 'year';

export interface DateRange {
  start: Date;
  end: Date;
}
