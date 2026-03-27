"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield, User, Trophy, Loader2, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlayerContinue = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/onboard", { method: "POST" });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        toast.error("Failed to complete setup.");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 5) {
      toast.error("Please enter a valid 5-digit PIN.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: pin }),
      });

      if (res.ok) {
        toast.success("Admin Verified. Welcome.");
        router.push("/admin");
      } else {
        const data = await res.json();
        toast.error(data.error || "Invalid Admin Token");
        setPin("");
      }
    } catch {
      toast.error("An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-emerald-glow/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Account Setup
          </h1>
          <p className="text-muted-foreground mt-2">
            How would you like to use GolfElite today?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            className={`border cursor-pointer transition-all duration-300 hover:shadow-lg ${
              !showAdminPin ? "border-primary/50 bg-primary/5" : "border-border/50 bg-card/80 hover:border-primary/30"
            }`}
            onClick={() => setShowAdminPin(false)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Player</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter scores, manage charity, and win draws.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border cursor-pointer transition-all duration-300 hover:shadow-lg ${
              showAdminPin ? "border-gold-glow/50 bg-gold-glow/5" : "border-border/50 bg-card/80 hover:border-gold-glow/30"
            }`}
            onClick={() => setShowAdminPin(true)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-gold-glow/10">
                <Shield className="h-6 w-6 text-gold-glow" />
              </div>
              <div>
                <CardTitle className="text-lg">Administrator</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage draws, oversee players, and analytics.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          {!showAdminPin ? (
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handlePlayerContinue}
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Card className="border-gold-glow/30 shadow-lg glow-gold">
              <CardContent className="p-6">
                <form onSubmit={handleAdminVerify} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Admin Security Token
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter 5-digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="h-12 text-center tracking-[0.5em] text-lg font-bold"
                      maxLength={5}
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gold-glow hover:bg-gold-glow/90 text-gold-glow-foreground font-bold"
                    disabled={loading || pin.length < 5}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Verify & Access"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
