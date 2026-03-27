"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Ticket,
  Clock,
  Trophy,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

export default function DrawsPage() {
  const [activeDraw, setActiveDraw] = useState<any>(null);
  const [pastDraws, setPastDraws] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/draws");
      if (res.ok) {
        const data = await res.json();
        setActiveDraw(data.activeDraw);
        setPastDraws(data.pastDraws || []);
        setTickets(data.tickets || []);
        setScores(data.scores || []);
        setIsSubscribed(data.isSubscribed || false);
      } else {
        toast.error("Failed to load draws");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Derive user draw numbers from scores (basic logic)
  // For the actual app, these would come from populated tickets.
  // Here we'll fallback to visually using stableford points as 'numbers' if no tickets exist.
  let currentMonthNumbers = scores.slice(0, 5).map(s => s.stablefordPoints);
  while (currentMonthNumbers.length < 5) {
      currentMonthNumbers.push("?");
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getMonthName = (monthNum: number) => {
      return monthNames[monthNum - 1] || "Unknown";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Ticket className="h-6 w-6 text-gold-glow" />
          Monthly Draws
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your Stableford scores formulate your ticket numbers for each month&apos;s draw.
        </p>
      </div>

      {/* Upcoming Draw */}
      {activeDraw && (
        <Card className="border-primary/20 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-gold-glow via-primary to-emerald-glow" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-glow" />
                {getMonthName(activeDraw.month)} {activeDraw.year} Draw
              </CardTitle>
              <Badge className="bg-gold-glow/10 text-gold-glow border-gold-glow/20">
                Upcoming
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Draw Date", value: `1 ${getMonthName((activeDraw.month % 12) + 1)}` },
                { label: "Prize Pool", value: `$${(activeDraw.prizePool + activeDraw.jackpotCarryover).toLocaleString()}` },
                { label: "Participants", value: activeDraw.totalParticipants.toString() },
                { label: "Your Entries", value: isSubscribed ? "10 + Scores" : "Scores Only" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="font-heading text-lg font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium mb-3">
                Your draw numbers (from your latest 5 scores):
              </p>
              <div className="flex flex-wrap gap-3">
                {currentMonthNumbers.map((n, i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-heading font-bold shadow-md ${
                        n === "?" ? "bg-muted/20 border-2 border-dashed border-border/50 text-muted-foreground/30" : "bg-linear-to-br from-primary to-emerald-glow text-primary-foreground"
                    }`}
                  >
                    {n}
                  </div>
                ))}
              </div>
              {scores.length < 5 && (
                  <p className="text-xs text-muted-foreground mt-3">
                      ⚠️ You need {5 - scores.length} more scores to complete your main ticket for this month.
                  </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Draws */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          Past Draws
        </h2>
        {pastDraws.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-border/50 bg-card/50">
                <p className="text-muted-foreground">No past draws available yet.</p>
            </div>
        ) : (
          <div className="space-y-4">
            {pastDraws.map((draw) => {
              // Mocking user winning logic based on past draws array formatting expected by UI
              const userNumbers = draw.userNumbers || [0, 0, 0, 0, 0];
              const matches = draw.numbers.filter((n: number) => userNumbers.includes(n)).length;

              return (
                <Card key={draw._id} className="border-border/50 bg-card/80">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-semibold text-sm">
                          {getMonthName(draw.month)} {draw.year}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            matches >= 3
                              ? "bg-primary/10 text-primary border-primary/20"
                              : ""
                          }`}
                        >
                          {matches >= 3
                            ? `🎉 ${matches}-Match Winner!`
                            : `${matches} Match${matches !== 1 ? "es" : ""}`}
                        </Badge>
                      </div>
                      {(draw.prize || 0) > 0 && (
                        <span className="font-heading font-bold text-primary">
                          +${draw.prize}
                        </span>
                      )}
                    </div>

                    {/* Draw Numbers vs User Numbers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Winning Numbers
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {draw.numbers.map((n: number, idx: number) => {
                            const matched = userNumbers.includes(n);
                            return (
                              <div
                                key={idx}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-heading font-bold text-sm ${
                                  matched
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-secondary text-muted-foreground"
                                }`}
                              >
                                {n}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Your Numbers
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {userNumbers.map((n: number, idx: number) => {
                            const matched = draw.numbers.includes(n);
                            return (
                              <div
                                key={idx}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-heading font-bold text-sm ${
                                  n === 0 ? "bg-muted/10 text-transparent" :
                                  matched
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-secondary text-muted-foreground"
                                }`}
                              >
                                {n > 0 ? n : "?"}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Prize Tiers */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold-glow" />
            Prize Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { match: "5 Match", share: "40%", note: "Jackpot — rolls over" },
              { match: "4 Match", share: "35%", note: "Split among winners" },
              { match: "3 Match", share: "25%", note: "Split among winners" },
            ].map((t) => (
              <div
                key={t.match}
                className="text-center p-4 rounded-xl bg-secondary/50"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {t.match}
                </p>
                <p className="font-heading text-2xl font-bold text-primary">
                  {t.share}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
