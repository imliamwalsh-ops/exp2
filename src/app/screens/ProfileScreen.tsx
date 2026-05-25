import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { BottomNav } from "../components/BottomNav";

import {
  getAchievementsForProfile,
  loadCurrentUser,
  logout,
} from "../../lib/auth";

import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

import {
  User,
  TrendingUp,
  Award,
  Zap,
  Dumbbell,
  Heart,
  Sparkles,
  Crown,
  Flame,
  Star,
  Gamepad2,
  Music,
  Palette,
  Camera,
  Settings,
  LogOut,
} from "lucide-react";

import type { UserProfile } from "../../lib/types";

export function ProfileScreen() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const navigate = useNavigate();

 useEffect(() => {
  const loadUser = async () => {
    const user = await loadCurrentUser();
    setProfile(user);
  };

  loadUser();
}, []);
  const achievements = useMemo(() => {
    if (!profile) return [];
    return getAchievementsForProfile(profile).map((achievement) => {
      let icon = Flame;
      if (achievement.key === "rising-star") icon = Star;
      if (achievement.key === "iron-will") icon = Dumbbell;
      if (achievement.key === "fire-starter") icon = Flame;
      if (achievement.key === "big-heart") icon = Heart;
      if (achievement.key === "scholar") icon = Crown;
      return { ...achievement, icon };
    });
  }, [profile]);

  const stats = useMemo(() => {
    if (!profile) return [];
    return [
      { name: "Strength", value: profile.stats.strength, icon: Dumbbell, color: "from-purple-600 to-pink-600" },
      { name: "Cardio", value: profile.stats.cardio, icon: Heart, color: "from-red-600 to-orange-600" },
      { name: "Kindness", value: profile.stats.kindness, icon: Sparkles, color: "from-blue-600 to-cyan-600" },
    ];
  }, [profile]);

  const hobbies = [
    { icon: Gamepad2, label: "Gaming" },
    { icon: Music, label: "Music" },
    { icon: Palette, label: "Art" },
    { icon: Camera, label: "Photography" },
  ];

  if (!profile) {
  return (
    <div className="min-h-screen bg-[#0a0118] flex items-center justify-center text-white">
      Loading profile...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] via-[#1a0a2e] to-[#0a0118] pb-28">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50" />
      <div className="fixed top-20 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
      <div className="fixed bottom-40 left-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10">
        <div className="relative px-4 pt-6 pb-20">
          <button
  onClick={async () => {
    await logout();
    navigate("/login");
  }}
  className="absolute top-6 right-4 w-10 h-10 rounded-xl bg-purple-950/40 backdrop-blur-sm border border-purple-500/20 flex items-center justify-center text-purple-300 hover:text-purple-200 hover:border-purple-500/40 transition-colors"
>
  <LogOut className="w-5 h-5" />
</button>

          <div className="relative mt-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-30" />
            <div className="relative bg-gradient-to-br from-purple-950/80 to-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center gap-1 shadow-lg">
                    <Zap className="w-3 h-3 text-white" fill="white" />
                    <span className="text-white text-xs font-bold">{profile.level}</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-1">{profile.gamertag}</h1>
                <p className="text-purple-300/70 mb-3">@{profile.gamertag.toLowerCase().replace(/\s+/g, "_")}</p>
                <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0 px-4 py-1 mb-4">
                  Level {profile.level} Adventurer
                </Badge>

                <p className="text-purple-200/80 text-sm max-w-xs">
                  {`${profile.gamertag} started fresh and earns every reward by submitting real life progress.`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/30 rounded-xl p-3 border border-purple-500/20 text-center">
                  <div className="text-cyan-400 text-xl font-bold">{profile.streak}</div>
                  <div className="text-purple-300/60 text-xs">Streak</div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-purple-500/20 text-center">
                  <div className="text-purple-400 text-xl font-bold">{profile.totalXP}</div>
                  <div className="text-purple-300/60 text-xs">Total XP</div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-purple-500/20 text-center">
                  <div className="text-pink-400 text-xl font-bold">{profile.achievements.unlocked.length}</div>
                  <div className="text-purple-300/60 text-xs">Unlocked</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Character Stats</h2>
            </div>
            <div className="space-y-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-gradient-to-r from-purple-950/40 to-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white font-medium">{stat.name}</span>
                          <span className="text-cyan-400 font-bold">{stat.value}/100</span>
                        </div>
                        <div className="relative">
                          <Progress value={stat.value} className="h-2 bg-purple-950/50" />
                          <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-full blur-sm opacity-50`} style={{ width: `${stat.value}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Achievements</h2>
              <Badge className="bg-purple-600/30 text-purple-300 border-purple-500/30 ml-auto">
                {profile.achievements.unlocked.length} / {achievements.length}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-purple-950/60 to-black/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-3 text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-white text-xs font-medium mb-1">{achievement.name}</div>
                      <div className="text-purple-300/50 text-[10px]">{achievement.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              variant="outline"
              className="w-full mt-3 bg-transparent border-purple-500/30 text-purple-200 hover:bg-purple-500/10 hover:border-purple-500/50"
            >
              View All Achievements
            </Button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-bold text-white">Hobbies & Interests</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, index) => {
                const Icon = hobby.icon;
                return (
                  <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-purple-950/40 to-black/40 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-200 text-sm">{hobby.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-4">
            <Button variant="outline" className="bg-transparent border-purple-500/30 text-purple-200 hover:bg-purple-500/10 hover:border-purple-500/50">
              Share Profile
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
