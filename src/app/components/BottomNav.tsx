import { useNavigate, useLocation } from "react-router";
import { Home, Upload, User, Trophy } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Upload, label: "Activity", path: "/activity" },
    { icon: Trophy, label: "Achievements", path: "/achievements" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent blur-xl" />
      
      <div className="relative mx-4 mb-4 bg-gradient-to-b from-purple-950/90 to-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)]">
        <div className="flex justify-around items-center px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 relative group"
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl blur" />
                )}
                <div className={`relative ${isActive ? "text-cyan-400" : "text-purple-300/50"} group-hover:text-purple-300 transition-colors`}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <div className="absolute inset-0 animate-ping">
                      <Icon className="w-6 h-6 text-cyan-400/50" />
                    </div>
                  )}
                </div>
                <span className={`text-xs ${isActive ? "text-cyan-400 font-medium" : "text-purple-300/50"} transition-colors`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
