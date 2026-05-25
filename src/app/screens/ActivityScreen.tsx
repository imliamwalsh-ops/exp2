import { useEffect, useState } from "react";import { useNavigate, Navigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Zap, Dumbbell, Heart, BookOpen, Briefcase, Users, Plus, Trophy } from "lucide-react";
import { loadCurrentUser, recordActivity, estimateActivityXP } from "../../lib/auth";
import type { UserProfile } from "../../lib/types";

export function ActivityScreen() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("strength");
  const [intensity, setIntensity] = useState([50]);
  const [duration, setDuration] = useState("30");
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadUser = async () => {
    const user = await loadCurrentUser();

    setProfile(user);
    setLoading(false);
  };

  loadUser();
}, []);


if (loading) {
  return (
    <div className="min-h-screen bg-[#0a0118] flex items-center justify-center text-white">
      Loading...
    </div>
  );
}

if (!profile) {
  return <Navigate to="/" replace />;
}

  const activityTypes = [
    { id: "strength", icon: Dumbbell, label: "Strength", color: "from-purple-600 to-pink-600" },
    { id: "cardio", icon: Heart, label: "Cardio", color: "from-red-600 to-orange-600" },
    { id: "mindfulness", icon: BookOpen, label: "Mindfulness", color: "from-blue-600 to-cyan-600" },
    { id: "work", icon: Briefcase, label: "Work", color: "from-green-600 to-emerald-600" },
    { id: "social", icon: Users, label: "Social", color: "from-pink-600 to-rose-600" },
    { id: "creativity", icon: Plus, label: "Creative", color: "from-yellow-600 to-amber-600" },
  ];

  const selectedActivity = activityTypes.find((a) => a.id === selectedType);
  const estimatedXP = estimateActivityXP(selectedType, intensity[0], Number(duration));

  const handleGainXP = async () => {
  setError(null);

  if (!selectedType || !duration || Number(duration) <= 0) {
    setError("Please choose a valid duration and activity type.");
    return;
  }

  const result = await recordActivity(
    selectedType,
    selectedActivity?.label ?? "Activity",
    intensity[0],
    Number(duration)
  );

  if (result.error) {
    setError(result.error);
    return;
  }

  navigate("/home");
};


  const selectedColor = selectedActivity?.color ?? "from-purple-600 to-cyan-600";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] via-[#1a0a2e] to-[#0a0118] pb-28">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50" />
      <div className="fixed top-20 left-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" />

      <div className="relative z-10 px-4 pt-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-[0_0_30px_rgba(139,92,246,0.5)] mb-2">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Log Activity
          </h1>
          <p className="text-purple-300/60">Submit real activity and earn XP instantly.</p>
        </div>

        <div>
          <Label className="text-purple-200 mb-3 block">Activity Type</Label>
          <div className="grid grid-cols-3 gap-3">
            {activityTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className="relative group"
                >
                  {isSelected && <div className={`absolute -inset-0.5 bg-gradient-to-r ${type.color} rounded-xl blur opacity-50`} />}
                  <div
                    className={`relative ${isSelected ? "bg-gradient-to-br from-purple-950/80 to-black/80 border-purple-400/50" : "bg-gradient-to-br from-purple-950/40 to-black/40 border-purple-500/20"} backdrop-blur-sm border rounded-xl p-4 transition-all duration-300`}
                  >
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className={`text-xs font-medium ${isSelected ? "text-white" : "text-purple-300/70"}`}>
                      {type.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-2xl blur" />
          <div className="relative bg-gradient-to-br from-purple-950/60 to-black/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-purple-200">Intensity Level</Label>
                <div className="text-cyan-400 font-bold text-lg">{intensity[0]}%</div>
              </div>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-purple-600 [&_[role=slider]]:to-cyan-600 [&_[role=slider]]:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              />
              <div className="flex justify-between text-xs text-purple-300/50 mt-2">
                <span>Light</span>
                <span>Moderate</span>
                <span>Intense</span>
              </div>
            </div>

            <div>
              <Label htmlFor="duration" className="text-purple-200 mb-2 block">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                className="bg-black/40 border-purple-500/30 text-white placeholder:text-purple-300/30 focus:border-purple-500 focus:ring-purple-500/50 h-12"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600/30 to-orange-600/30 rounded-2xl blur animate-pulse" />
          <div className="relative bg-gradient-to-br from-yellow-950/40 to-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 text-center">
            <div className="text-yellow-300/70 text-sm mb-2">Estimated XP Gain</div>
            <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              +{estimatedXP}
            </div>
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Zap className="w-4 h-4" fill="currentColor" />
              <span className="text-sm">Experience Points</span>
            </div>
          </div>
        </div>

        {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        <Button
          onClick={handleGainXP}
          className="w-full h-14 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 text-lg"
        >
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5" fill="white" />
            Gain {estimatedXP} XP
          </span>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gradient-to-br from-purple-950/40 to-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-left hover:border-purple-500/40 transition-colors">
            <div className="text-purple-400 text-sm mb-1">Quick Log</div>
            <div className="text-white font-medium">Morning Routine</div>
          </button>
          <button className="bg-gradient-to-br from-purple-950/40 to-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-left hover:border-purple-500/40 transition-colors">
            <div className="text-purple-400 text-sm mb-1">Quick Log</div>
            <div className="text-white font-medium">Evening Workout</div>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
