export type LifeStats = {
  strength: number;
  cardio: number;
  kindness: number;
};

export type Activity = {
  id: string;
  activityType: string;
  activityName: string;
  intensity: number;
  duration: number;
  xpEarned: number;
  timestamp: string;
};

export type AchievementDefinition = {
  key: string;
  name: string;
  desc: string;
  rarity: string;
  total: number;
  category: string;
};

export type AchievementState = {
  unlocked: string[];
  progress: Record<string, number>;
};

export type UserProfile = {
  id: string;
  email: string;
  password: string;
  gamertag: string;
  createdAt: string;
  lastLoginAt: string;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  xpToNextLevel: number;
  stats: LifeStats;
  streak: number;
  totalActivities: number;
  activitiesByType: Record<string, number>;
  achievements: AchievementState;
  activities: Activity[];
};
