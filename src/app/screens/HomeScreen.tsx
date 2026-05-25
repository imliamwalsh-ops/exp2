import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Zap, TrendingUp, Award, Target, Flame, Star, Dumbbell, Heart, BookOpen } from "lucide-react";
import { getAchievementsForProfile, loadCurrentUser } from "../../lib/auth";
import type { UserProfile } from "../../lib/types";

export function HomeScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
  const fetchUser = async () => {
    const user = await loadCurrentUser();

    if (!user) {
      setProfile(null);
      return;
    }

    setProfile(user);
  };

  fetchUser();
}, []);
  const achievements = profile
  ? getAchievementsForProfile(profile)
      .sort(
        (a, b) =>
          Number(b.unlocked) - Number(a.unlocked) ||
          b.progress - a.progress
      )
      .slice(0, 4)
      .map((item) => {
        if (item.key === "fire-starter") {
          return {
            ...item,
            icon: Flame,
            color: "from-orange-500 to-red-500",
          };
        }

        if (item.key === "iron-will") {
          return {
            ...item,
            icon: Dumbbell,
            color: "from-purple-500 to-pink-500",
          };
        }

        if (item.key === "rising-star") {
          return {
            ...item,
            icon: Star,
            color: "from-yellow-500 to-orange-500",
          };
        }

        if (item.key === "big-heart") {
          return {
            ...item,
            icon: Heart,
            color: "from-pink-500 to-rose-500",
          };
        }

        return {
          ...item,
          icon: BookOpen,
          color: "from-purple-500 to-cyan-500",
        };
      })
  : [];

  if (!profile) {
  return (
    <div className="min-h-screen bg-[#0a0118] flex items-center justify-center text-white">
      No profile loaded.
    </div>
  );
}

const xpProgress = Math.floor(
  (profile.currentLevelXP /
    Math.max(1, profile.xpToNextLevel)) *
    100
);

const recentXP = Array.isArray(profile.activities)
  ? profile.activities.slice(0, 4).map((activity) => ({
      activity: activity.activityName,
      xp: activity.xpEarned,
      type: activity.activityType,
      time: new Date(activity.timestamp).toLocaleString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    }))
  : [];

const activeMissions = [
    {
      title: "Complete 5 Strength Logs",
      progress: profile.activitiesByType.strength || 0,
      total: 5,
      xp: 500,
    },
    {
      title: "Earn 1000 XP",
      progress: profile.totalXP,
      total: 1000,
      xp: 500,
    },
    {
      title: "Build a 7 Day Streak",
      progress: profile.streak,
      total: 7,
      xp: 400,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] via-[#1a0a2e] to-[#0a0118] pb-28">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50" />
      <div className="fixed top-20 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
      <div className="fixed bottom-40 left-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 px-4 pt-6 space-y-6">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-30" />
          <div className="relative bg-gradient-to-br from-purple-950/80 to-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                    <Zap className="w-8 h-8 text-white" fill="white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-black rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">{profile.gamertag}</h2>
                    <Flame className="w-5 h-5 text-orange-500" fill="orange" />
                  </div>
                  <p className="text-purple-300/70">@{profile.gamertag.toLowerCase().replace(/\s+/g, "_")}</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0 px-3 py-1">
                LVL {profile.level}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">XP Progress</span>
                <span className="text-cyan-400 font-bold">{profile.currentLevelXP} / {profile.xpToNextLevel} XP</span>
              </div>
              <div className="relative">
                <Progress value={xpProgress} className="h-3 bg-purple-950/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-cyan-600/50 rounded-full blur-sm" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex-1 bg-black/30 rounded-xl p-3 border border-purple-500/20">
                <div className="text-cyan-400 text-xl font-bold">{profile.streak}</div>
                <div className="text-purple-300/60 text-xs">Streak Days</div>
              </div>
              <div className="flex-1 bg-black/30 rounded-xl p-3 border border-purple-500/20">
                <div className="text-purple-400 text-xl font-bold">{profile.totalXP}</div>
                <div className="text-purple-300/60 text-xs">Total XP</div>
              </div>
              <div className="flex-1 bg-black/30 rounded-xl p-3 border border-purple-500/20">
                <div className="text-pink-400 text-xl font-bold">{profile.achievements.unlocked.length}</div>
                <div className="text-purple-300/60 text-xs">Achievements</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          </div>
          <div className="space-y-2">
            {recentXP.length === 0 ? (
              <div className="bg-gradient-to-r from-purple-950/40 to-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-purple-300">
                No activity yet. Submit a mission to start earning XP.
              </div>
            ) : (
              recentXP.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-950/40 to-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/30 to-cyan-600/30 flex items-center justify-center border border-purple-500/30">
                        <Zap className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{item.activity}</div>
                        <div className="text-purple-300/50 text-xs">{item.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">+{item.xp} XP</div>
                      <Badge className="bg-purple-600/30 text-purple-300 text-xs border-purple-500/30 mt-1">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Latest Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="relative group">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${achievement.color} rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity`} />
                  <div className="relative bg-gradient-to-br from-purple-950/60 to-black/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white text-sm font-medium">{achievement.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-pink-400" />
            <h3 className="text-lg font-bold text-white">Active Missions</h3>
          </div>
          <div className="space-y-3">
            {activeMissions.map((mission, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-950/40 to-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-medium">{mission.title}</div>
                  <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0">
                    +{mission.xp} XP
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300/70">{mission.progress} / {mission.total} Complete</span>
                    <span className="text-cyan-400 font-bold">{Math.min(100, Math.round((mission.progress / mission.total) * 100))}%</span>
                  </div>
                  <Progress value={Math.min(100, (mission.progress / mission.total) * 100)} className="h-2 bg-purple-950/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
