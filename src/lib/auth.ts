import { supabase } from "./supabase";
import {
  type Activity,
  type AchievementDefinition,
  type UserProfile,
} from "./types";

export const achievementDefinitions: AchievementDefinition[] = [
  {
    key: "fire-starter",
    name: "Fire Starter",
    desc: "7 Day Streak",
    rarity: "common",
    total: 7,
    category: "Streaks",
  },
  {
    key: "achiever",
    name: "Achiever",
    desc: "100 Activities",
    rarity: "epic",
    total: 100,
    category: "Milestones",
  },
  {
    key: "rising-star",
    name: "Rising Star",
    desc: "Reach Level 40",
    rarity: "rare",
    total: 40,
    category: "Progress",
  },
  {
    key: "iron-will",
    name: "Iron Will",
    desc: "Strength 85+",
    rarity: "epic",
    total: 85,
    category: "Fitness",
  },
  {
    key: "big-heart",
    name: "Big Heart",
    desc: "Kindness 100",
    rarity: "legendary",
    total: 100,
    category: "Kindness",
  },
  {
    key: "dedicated",
    name: "Dedicated",
    desc: "Stay consistent for days",
    rarity: "legendary",
    total: 30,
    category: "Consistency",
  },
  {
    key: "scholar",
    name: "Scholar",
    desc: "Complete 50 learning activities",
    rarity: "rare",
    total: 50,
    category: "Learning",
  },
];

const defaultAchievements = {
  unlocked: [] as string[],
  progress: {} as Record<string, number>,
};

const getLevelProgress = (totalXP: number) => {
  let level = 1;
  let xpLeft = totalXP;

  while (xpLeft >= 1000 * level) {
    xpLeft -= 1000 * level;
    level += 1;
  }

  const xpToNextLevel = 1000 * level;

  return {
    level,
    currentLevelXP: xpLeft,
    xpToNextLevel,
    progress: Math.floor((xpLeft / xpToNextLevel) * 100),
  };
};

const buildFreshProfile = (
  id: string,
  email: string,
  gamertag: string
): UserProfile => {
  const now = new Date().toISOString();

  return {
    id,
    email,
    password: "",
    gamertag,

    createdAt: now,
    lastLoginAt: now,

    level: 1,
    totalXP: 0,
    currentLevelXP: 0,
    xpToNextLevel: 1000,

    stats: {
      strength: 0,
      cardio: 0,
      kindness: 0,
    },

    streak: 0,
    totalActivities: 0,

    activitiesByType: {},

    achievements: {
      unlocked: [],
      progress: {},
    },

    activities: [],
  };
};

const calculateXP = (
  activityType: string,
  intensity: number,
  duration: number
): number => {
  const baseXP: Record<string, number> = {
    strength: 22,
    cardio: 20,
    kindness: 18,
    mindfulness: 15,
    learning: 17,
    creativity: 16,
    social: 14,
    work: 15,
  };

  const base = baseXP[activityType] ?? 14;

  const intensityFactor = Math.max(
    0.2,
    Math.min(intensity / 50, 2)
  );

  const durationMultiplier = Math.max(
    0.5,
    Math.min(duration / 30, 3)
  );

  return Math.max(
    1,
    Math.round(base * intensityFactor * durationMultiplier)
  );
};

const ensureAchievements = (profile: UserProfile) => {
  if (!profile.achievements) {
    profile.achievements = {
      unlocked: [],
      progress: {},
    };
  }

  if (!Array.isArray(profile.achievements.unlocked)) {
    profile.achievements.unlocked = [];
  }

  if (!profile.achievements.progress) {
    profile.achievements.progress = {};
  }
};

const applyAchievementUpdates = (
  profile: UserProfile
) => {
  ensureAchievements(profile);

  const unlocked = new Set(
    profile.achievements.unlocked
  );

  if (profile.streak >= 7) {
    unlocked.add("fire-starter");
  }

  if (profile.totalActivities >= 100) {
    unlocked.add("achiever");
  }

  if (profile.level >= 40) {
    unlocked.add("rising-star");
  }

  if (profile.stats.strength >= 85) {
    unlocked.add("iron-will");
  }

  if (profile.stats.kindness >= 100) {
    unlocked.add("big-heart");
  }

  if (
    (profile.activitiesByType["learning"] || 0) >= 50
  ) {
    unlocked.add("scholar");
  }

  profile.achievements.unlocked =
    Array.from(unlocked);

  profile.achievements.progress = {
    "big-heart": Math.min(
      profile.stats.kindness,
      100
    ),

    dedicated: profile.streak,

    scholar:
      profile.activitiesByType["learning"] || 0,

    achiever: profile.totalActivities,

    "fire-starter": profile.streak,

    "rising-star": profile.level,

    "iron-will": profile.stats.strength,
  };
};

const mapProfile = (data: any): UserProfile => {
  const achievements = data?.achievements;

  return {
    id: data.id,
    email: data.email,
    password: "",
    gamertag: data.gamertag,

    createdAt: data.created_at,
    lastLoginAt: data.last_login_at,

    level: data.level ?? 1,
    totalXP: data.total_xp ?? 0,
    currentLevelXP:
      data.current_level_xp ?? 0,
    xpToNextLevel:
      data.xp_to_next_level ?? 1000,

    stats: {
      strength: data.strength ?? 0,
      cardio: data.cardio ?? 0,
      kindness: data.kindness ?? 0,
    },

    streak: data.streak ?? 0,

    totalActivities:
      data.total_activities ?? 0,

    activitiesByType:
      data.activities_by_type ?? {},

    achievements: {
      unlocked:
        Array.isArray(
          achievements?.unlocked
        )
          ? achievements.unlocked
          : [],

      progress:
        achievements?.progress ?? {},
    },

    activities: Array.isArray(data.activities)
  ? data.activities
  : [],
  };
};

export const signUp = async (
  email: string,
  password: string,
  gamertag: string
) => {
  const normalizedEmail =
    email.trim().toLowerCase();

  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });

  if (authError || !authData.user) {
    return {
      error:
        authError?.message ||
        "Unable to create account.",
    };
  }

  const profile = buildFreshProfile(
    authData.user.id,
    normalizedEmail,
    gamertag.trim()
  );

  const { error: profileError } =
    await supabase.from("profiles").insert({
      id: profile.id,
      email: profile.email,
      gamertag: profile.gamertag,

      created_at: profile.createdAt,
      last_login_at: profile.lastLoginAt,

      level: profile.level,
      total_xp: profile.totalXP,
      current_level_xp:
        profile.currentLevelXP,
      xp_to_next_level:
        profile.xpToNextLevel,

      strength: profile.stats.strength,
      cardio: profile.stats.cardio,
      kindness: profile.stats.kindness,

      streak: profile.streak,

      total_activities:
        profile.totalActivities,

      activities_by_type:
        profile.activitiesByType,

      achievements: {
        unlocked: [],
        progress: {},
      },
    });

  if (profileError) {
    return {
      error: profileError.message,
    };
  }

  return { profile };
};

export const signIn = async (
  email: string,
  password: string
) => {
  const normalizedEmail =
    email.trim().toLowerCase();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

  if (authError || !authData.user) {
    return {
      error:
        authError?.message ||
        "Invalid email or password.",
    };
  }

  const { data: profileData, error } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

  if (error || !profileData) {
    return {
      error: "Profile not found.",
    };
  }

  const profile = mapProfile(profileData);

  return { profile };
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser =
  async (): Promise<UserProfile | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      return null;
    }

    return mapProfile(data);
  };

export const recordActivity = async (
  activityType: string,
  activityName: string,
  intensity: number,
  duration: number
) => {
  const profile = await getCurrentUser();

  if (!profile) {
    return {
      error:
        "You must be logged in to submit activity.",
    };
  }

  ensureAchievements(profile);

  const xpEarned = calculateXP(
    activityType,
    intensity,
    duration
  );

  profile.totalXP += xpEarned;
  profile.totalActivities += 1;

  const statMap: Record<
    string,
    keyof UserProfile["stats"]
  > = {
    strength: "strength",
    cardio: "cardio",
    kindness: "kindness",
  };

  const statKey = statMap[activityType];

  if (statKey) {
    profile.stats[statKey] = Math.min(
      100,
      profile.stats[statKey] +
        Math.round(intensity / 15)
    );
  }

  profile.activitiesByType[activityType] =
    (profile.activitiesByType[
      activityType
    ] || 0) + 1;

  const levelInfo = getLevelProgress(
    profile.totalXP
  );

  profile.level = levelInfo.level;

  profile.currentLevelXP =
    levelInfo.currentLevelXP;

  profile.xpToNextLevel =
    levelInfo.xpToNextLevel;

  const activity: Activity = {
    id: crypto.randomUUID(),

    activityType,
    activityName,

    intensity,
    duration,

    xpEarned,

    timestamp: new Date().toISOString(),
  };

  applyAchievementUpdates(profile);

  await supabase.from("activities").insert({
    user_id: profile.id,

    activity_type: activityType,
    activity_name: activityName,

    intensity,
    duration,

    xp_earned: xpEarned,
  });

  await supabase
    .from("profiles")
    .update({
      last_login_at:
        new Date().toISOString(),

      level: profile.level,
      total_xp: profile.totalXP,

      current_level_xp:
        profile.currentLevelXP,

      xp_to_next_level:
        profile.xpToNextLevel,

      strength: profile.stats.strength,
      cardio: profile.stats.cardio,
      kindness: profile.stats.kindness,

      streak: profile.streak,

      total_activities:
        profile.totalActivities,

      activities_by_type:
        profile.activitiesByType,

      achievements:
        profile.achievements,
    })
    .eq("id", profile.id);

  return {
    profile,
    activity,
    xpEarned,
  };
};

export const estimateActivityXP = (
  activityType: string,
  intensity: number,
  duration: number
) => {
  return calculateXP(
    activityType,
    intensity,
    duration
  );
};

export const loadCurrentUser =
  async (): Promise<UserProfile | null> => {
    return await getCurrentUser();
  };

export const getAchievementsForProfile = (
  profile: UserProfile
) => {
  const achievements =
    profile.achievements ??
    defaultAchievements;

  const unlocked = Array.isArray(
    achievements.unlocked
  )
    ? achievements.unlocked
    : [];

  const progress =
    achievements.progress ?? {};

  return achievementDefinitions.map(
    (achievement) => ({
      ...achievement,

      unlocked: unlocked.includes(
        achievement.key
      ),

      progress: Math.min(
        progress[achievement.key] ?? 0,
        achievement.total
      ),
    })
  );
};