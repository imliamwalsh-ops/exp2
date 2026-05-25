import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Award,
  Flame,
  Star,
  Trophy,
  Heart,
  Dumbbell,
  Calendar,
  Lock,
  ChevronLeft,
  Book,
} from "lucide-react";

import {
  getAchievementsForProfile,
  loadCurrentUser,
  achievementDefinitions,
} from "../../lib/auth";

import type { UserProfile } from "../../lib/types";

const iconMap: Record<string, any> = {
  "fire-starter": Flame,
  achiever: Trophy,
  "rising-star": Star,
  "iron-will": Dumbbell,
  "big-heart": Heart,
  dedicated: Calendar,
  scholar: Book,
};

export function AchievementsScreen() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
  const loadUser = async () => {
    const user = await loadCurrentUser();
    setProfile(user);
  };

  loadUser();
}, []);


  const achievements = useMemo(() => {
    if (!profile) return [];
    return getAchievementsForProfile(profile);
  }, [profile]);

  if (!profile) {
  return (
    <div className="min-h-screen bg-[#0a0118] flex items-center justify-center text-white">
      Loading profile...
    </div>
  );
}
  const completionPercent = Math.round(
    (profile.achievements.unlocked.length /
      achievementDefinitions.length) *
      100
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-500 to-orange-600";

      case "epic":
        return "from-purple-500 to-pink-600";

      case "rare":
        return "from-cyan-500 to-blue-600";

      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] via-[#1a0a2e] to-[#0a0118] pb-28">
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-purple-500/20 px-4 py-4 bg-[#0a0118]/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Achievements
              </h1>

              <p className="text-purple-300/60 text-sm">
                {profile.achievements.unlocked.length} unlocked
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pt-6">
          <div className="bg-purple-950/40 border border-purple-500/20 rounded-2xl p-5">
            <div className="flex justify-between mb-3">
              <span className="text-white font-semibold">
                Completion
              </span>

              <span className="text-cyan-400 font-bold">
                {completionPercent}%
              </span>
            </div>

            <div className="h-3 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-cyan-600"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="px-4 pt-6 space-y-4">
          {achievements.map((achievement: any) => {
            const Icon =
              iconMap[achievement.icon] || Award;

            const isLocked = !achievement.unlocked;

            return (
              <div
                key={achievement.id}
                className={`rounded-2xl border p-4 ${
                  isLocked
                    ? "bg-gray-900/40 border-gray-700/30"
                    : "bg-purple-950/40 border-purple-500/20"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${getRarityColor(
                      achievement.rarity
                    )}`}
                  >
                    {isLocked ? (
                      <Lock className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className="w-6 h-6 text-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`font-bold ${
                          isLocked
                            ? "text-gray-500"
                            : "text-white"
                        }`}
                      >
                        {achievement.name}
                      </h3>

                      <Badge>
                        {achievement.rarity}
                      </Badge>
                    </div>

                    <p className="text-sm text-purple-300/70 mb-3">
                      {achievement.description}
                    </p>

                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-cyan-600"
                        style={{
                          width: `${
                            (achievement.progress /
                              achievement.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 text-xs text-cyan-400">
                      {achievement.progress} /{" "}
                      {achievement.total}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 pt-8">
          <div className="bg-purple-950/40 border border-purple-500/20 rounded-2xl p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-3 text-purple-400" />

            <h3 className="text-white font-bold mb-2">
              Keep Grinding!
            </h3>

            <p className="text-purple-300/70 text-sm mb-4">
              Complete more activities to unlock every
              achievement.
            </p>

            <Button
              onClick={() => navigate("/activity")}
              className="bg-gradient-to-r from-purple-600 to-cyan-600"
            >
              Log Activity
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}