import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import Charity from "@/lib/models/charity";
import Draw from "@/lib/models/draw";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Target, TrendingUp, Trophy, ArrowUpRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectToDatabase();
  
  // Security Check
  const adminUser = await User.findOne({ clerkId: userId });
  if (!adminUser || adminUser.role !== "admin") redirect("/dashboard");

  // Perform Server-Side Aggregations
  const totalUsers = await User.countDocuments();
  const activeSubs = await User.countDocuments({ subscriptionStatus: "active" });

  const charityAgg = await Charity.aggregate([
    { $group: { _id: null, total: { $sum: "$totalContributions" } } }
  ]);
  const totalCharityContributions = charityAgg[0]?.total || 0;

  const drawAgg = await Draw.aggregate([
    { $group: { _id: null, total: { $sum: "$prizePool" } } }
  ]);
  const totalPrizePool = drawAgg[0]?.total || 0;

  const activeDraws = await Draw.countDocuments({ status: "active" });
  const pendingDraws = await Draw.countDocuments({ status: "pending" });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-gold-glow" />
          Platform Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          High-level analytics and health metrics for the GolfElite ecosystem.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Players</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-glow flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                {activeSubs}
              </span>
              Active Subs
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Charity Raised</CardTitle>
            <Heart className="h-4 w-4 text-emerald-glow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-glow">${totalCharityContributions.toLocaleString()}</div>
            <p className="text-xs mt-1 text-emerald-glow/70">
              Distributed to Partners
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cumulative Prize Pool</CardTitle>
            <Target className="h-4 w-4 text-gold-glow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold-glow">${totalPrizePool.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Historical + Active combined
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draw Flow Status</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDraws}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-gold-glow flex items-center font-semibold">
                {pendingDraws}
              </span>
              Pending Simulations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Checks Placeholder */}
      <Card className="border-border/50 bg-secondary/10">
        <CardHeader>
          <CardTitle className="text-lg">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Database Connection</span>
              <span className="text-emerald-glow flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-glow animate-pulse"></span>
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Admin Overrides Triggered</span>
              <span className="text-foreground">0 (Last 24h)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
