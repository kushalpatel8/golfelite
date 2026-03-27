"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Upload,
  Clock,
  CheckCircle2,
  DollarSign,
  CalendarDays,
} from "lucide-react";

const winnings = [
  {
    id: "1",
    drawMonth: "January 2026",
    matchType: 3,
    prizeAmount: 85,
    verificationStatus: "approved",
    paymentStatus: "paid",
    paidAt: "2026-01-15",
  },
  {
    id: "2",
    drawMonth: "October 2025",
    matchType: 3,
    prizeAmount: 65,
    verificationStatus: "approved",
    paymentStatus: "paid",
    paidAt: "2025-10-10",
  },
  {
    id: "3",
    drawMonth: "August 2025",
    matchType: 4,
    prizeAmount: 100,
    verificationStatus: "approved",
    paymentStatus: "paid",
    paidAt: "2025-08-12",
  },
];

export default function WinningsPage() {
  const totalWon = winnings.reduce((s, w) => s + w.prizeAmount, 0);
  const totalPaid = winnings
    .filter((w) => w.paymentStatus === "paid")
    .reduce((s, w) => s + w.prizeAmount, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-gold-glow" />
          Winnings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your prizes and payment status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="font-heading text-2xl font-bold text-primary">
              ${totalWon}
            </p>
            <p className="text-xs text-muted-foreground">Total Won</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-glow mx-auto mb-1" />
            <p className="font-heading text-2xl font-bold text-emerald-glow">
              ${totalPaid}
            </p>
            <p className="text-xs text-muted-foreground">Paid Out</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4 text-center">
            <Trophy className="h-4 w-4 text-gold-glow mx-auto mb-1" />
            <p className="font-heading text-2xl font-bold">
              {winnings.length}
            </p>
            <p className="text-xs text-muted-foreground">Wins</p>
          </CardContent>
        </Card>
      </div>

      {/* Winnings List */}
      <div className="space-y-3">
        {winnings.map((win) => (
          <Card key={win.id} className="border-border/50 bg-card/80">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-glow/20 to-primary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-gold-glow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{win.drawMonth}</p>
                    <Badge variant="secondary" className="text-xs">
                      {win.matchType}-Match
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <CalendarDays className="h-3 w-3" />
                    Paid{" "}
                    {new Date(win.paidAt!).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-heading text-lg font-bold text-primary">
                  +${win.prizeAmount}
                </span>
                {win.paymentStatus === "paid" ? (
                  <Badge className="bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Paid
                  </Badge>
                ) : (
                  <Badge className="bg-gold-glow/10 text-gold-glow border-gold-glow/20 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {winnings.length === 0 && (
          <Card className="border-dashed border-2 border-border/50">
            <CardContent className="p-8 text-center">
              <Trophy className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-semibold mb-1">
                No Winnings Yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Keep entering your scores — your numbers could match in the next
                draw!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Proof Upload Info */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
            Winner Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you win, you&apos;ll need to upload a screenshot of your scores from
            the golf platform for verification. The admin team will review and
            approve your submission.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { step: "1", label: "Win a Draw", icon: Trophy },
              { step: "2", label: "Upload Proof", icon: Upload },
              { step: "3", label: "Get Paid", icon: DollarSign },
            ].map((s) => (
              <div key={s.step} className="p-3 rounded-lg bg-secondary/50">
                <s.icon className="h-4 w-4 mx-auto text-primary mb-1" />
                <p className="text-xs font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
