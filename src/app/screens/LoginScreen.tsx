import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Zap } from "lucide-react";
import { loadCurrentUser, signIn, signUp } from "../../lib/auth";

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const checkUser = async () => {
    const user = await loadCurrentUser();

    if (user) {
      navigate("/home");
    }
  };

  checkUser();
}, [navigate]);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);

    if (!email || !password || (mode === "signup" && !gamertag)) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mode === "signup") {
      const result = await signUp(email, password, gamertag);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage("Account created. Redirecting to your new profile...");
      navigate("/home");
      return;
    }

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      return;
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] via-[#1a0a2e] to-[#0a0118] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            <Zap className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            LIFE RPG
          </h1>
          <p className="text-purple-300/60">Log in to start a fresh adventure.</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-30" />
          <div className="relative bg-gradient-to-b from-purple-950/50 to-black/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
                <p className="text-purple-300/60 text-sm">{mode === "login" ? "Sign in to access your progress" : "Start fresh with a new account"}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError(null);
                  setMessage(null);
                }}
                className="text-sm text-cyan-400 hover:text-cyan-200"
              >
                {mode === "login" ? "Create new account" : "Back to login"}
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-purple-200 mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="player@liferpg.com"
                  className="bg-black/40 border-purple-500/30 text-white placeholder:text-purple-300/30 focus:border-purple-500 focus:ring-purple-500/50 h-12"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-purple-200 mb-2 block">
                  Password
                </Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="bg-black/40 border-purple-500/30 text-white placeholder:text-purple-300/30 focus:border-purple-500 focus:ring-purple-500/50 h-12"
                />
              </div>

              {mode === "signup" && (
                <div>
                  <Label htmlFor="gamertag" className="text-purple-200 mb-2 block">
                    Gamertag
                  </Label>
                  <Input
                    id="gamertag"
                    value={gamertag}
                    onChange={(event) => setGamertag(event.target.value)}
                    type="text"
                    placeholder="Your new hero name"
                    className="bg-black/40 border-purple-500/30 text-white placeholder:text-purple-300/30 focus:border-purple-500 focus:ring-purple-500/50 h-12"
                  />
                </div>
              )}

              {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
              {message && <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}

              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {mode === "login" ? "Login" : "Create Account"}
                </span>
              </Button>

              {mode === "login" ? (
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="w-full h-12 rounded-2xl border border-purple-500/30 text-purple-200 hover:bg-purple-500/10 hover:border-purple-500/50"
                >
                  New here? Create an account
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-cyan-400">Login Required</div>
            <div className="text-xs text-purple-300/50">Your progress is saved securely in your account.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
