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

export type DailyQuest = {
  id: string;

  title: string;
  description: string;

  xpReward: number;

  completed: boolean;

  activityType: string;
  target: number;
  progress: number;
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

export interface DailyQuest {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
}

export interface UserProfile {
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

  stats: {
    strength: number;
    cardio: number;
    kindness: number;
  };

  streak: number;

  totalActivities: number;

  activitiesByType: Record<string, number>;

  achievements: {
    unlocked: string[];
    progress: Record<string, number>;
  };

  // ADD THESE
  dailyQuests: DailyQuest[];

  completedQuests: string[];

  bonusXP: number;

  activities: Activity[];
}
