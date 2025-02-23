export interface User {
  id: number;
  email: string;
  created_at: Date;
  last_opened?: Date | null;
  current_streak: number;
  is_admin: number;
}

export interface Streak {
  id: number;
  user_id: number;
  newsletter_id: string;
  date: Date;
  utm_parameters: Record<string, any>;
}

export interface Newsletter {
  id: string;
  title: string;
  published_at: Date;
  status: string;
  total_opens: number;
}
