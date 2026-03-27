"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Target,
  Heart,
  Trophy,
  Ticket,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  CalendarDays,
} from "lucide-react";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const impersonatedUserId = searchParams.get("userId");

  // Mock data — will connect to API later
  const user = {
    firstName: "Player",
    subscriptionStatus: "active" as const,
    subscriptionPlan: "monthly" as const,
    subscriptionExpiry: new Date("2026-04-26"),
    scores: [
      { value: 34, date: "2026-03-20" },
      { value: 28, date: "2026-03-10" },
      { value: 38, date: "2026-02-25" },
      { value: 31, date: "2026-02-14" },
      { value: 42, date: "2026-01-30" },
    ],
    charityName: "Golf for Good Foundation",
    charityPercentage: 15,
    totalWinnings: 250,
    totalDonated: 45.5,
  };

  const nextDraw = new Date("2026-04-01");
  const daysUntilDraw = Math.max(
    0,
    Math.ceil(
      (nextDraw.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {impersonatedUserId ? "Viewing Player Portfolio (Admin Mode)" : "Here's your performance and impact overview."}
          </p>
          {impersonatedUserId && (
            <Badge variant="destructive" className="mt-2 text-xs">Admin Viewing: {impersonatedUserId}</Badge>
          )}
        </div>
        <Badge
          variant="secondary"
          className={`self-start ${
            user.subscriptionStatus === "active"
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          {user.subscriptionStatus === "active" ? "Active" : "Inactive"} —{" "}
          {user.subscriptionPlan} plan
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Latest Score",
            value: user.scores[0]?.value ?? "—",
            icon: Target,
            href: "/dashboard/scores",
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            label: "Next Draw",
            value: `${daysUntilDraw}d`,
            icon: Ticket,
            href: "/dashboard/draws",
            color: "text-gold-glow",
            bgColor: "bg-gold-glow/10",
          },
          {
            label: "Total Won",
            value: `$${user.totalWinnings}`,
            icon: Trophy,
            href: "/dashboard/winnings",
            color: "text-emerald-glow",
            bgColor: "bg-emerald-glow/10",
          },
          {
            label: "Donated",
            value: `$${user.totalDonated}`,
            icon: Heart,
            href: "/dashboard/charity",
            color: "text-purple-glow",
            bgColor: "bg-purple-glow/10",
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-border/50 bg-card/80 hover:shadow-md transition-all duration-300 cursor-pointer group h-full">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                </div>
                <p className="font-heading text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scores */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Your Scores
            </CardTitle>
            <Link href="/dashboard/scores">
              <Button variant="ghost" size="sm" className="text-xs">
                Manage <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.scores.map((score, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-heading font-bold text-primary">
                    {score.value}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {score.value >= 36
                        ? "Excellent"
                        : score.value >= 30
                        ? "Great"
                        : score.value >= 24
                        ? "Good"
                        : "Keep Going"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(score.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <TrendingUp
                  className={`h-4 w-4 ${
                    i === 0 && score.value > (user.scores[1]?.value ?? 0)
                      ? "text-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              </div>
            ))}
            {user.scores.length < 5 && (
              <div className="text-center py-3">
                <p className="text-xs text-muted-foreground mb-2">
                  {5 - user.scores.length} more score
                  {5 - user.scores.length > 1 ? "s" : ""} to complete your set
                </p>
                <Progress
                  value={(user.scores.length / 5) * 100}
                  className="h-1.5"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charity & Draw */}
        <div className="space-y-6">
          {/* Charity Card */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Heart className="h-4 w-4 text-emerald-glow" />
                Your Charity
              </CardTitle>
              <Link href="/dashboard/charity">
                <Button variant="ghost" size="sm" className="text-xs">
                  Change <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-linear-to-br from-primary/5 to-emerald-glow/5 border border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.charityName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.charityPercentage}% of subscription
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total donated</span>
                  <span className="font-heading font-bold text-primary">
                    ${user.totalDonated}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Draw Countdown */}
          <Card className="border-border/50 bg-card/80 overflow-hidden">
            <div className="h-1 bg-linear-to-r from-gold-glow via-primary to-emerald-glow" />
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gold-glow/10">
                  <Clock className="h-5 w-5 text-gold-glow" />
                </div>
                <div>
                  <p className="font-heading font-semibold">Next Draw</p>
                  <p className="text-xs text-muted-foreground">
                    April 2026 Draw
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { value: daysUntilDraw, label: "Days" },
                  { value: "5", label: "Your Numbers" },
                  { value: "$1.2K", label: "Prize Pool" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-lg bg-secondary/50"
                  >
                    <p className="font-heading text-xl font-bold">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
