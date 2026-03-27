"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Gift, CheckCircle, XCircle, CreditCard, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const res = await fetch("/api/admin/winners");
      const data = await res.json();
      if (res.ok) setWinners(data.winners || []);
    } catch {
      toast.error("Failed to load winners");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "verify" | "reject" | "mark_paid", notes?: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/winners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, notes }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Action: ${action.replace("_", " ")} successful`);
        fetchWinners();
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-[50vh] items-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-glow" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Gift className="h-8 w-8 text-gold-glow" />
            Winners Management
          </h1>
          <p className="text-muted-foreground mt-1">Verify submitted numbers and process winner payouts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {winners.map((winner) => {
          const isPending = winner.verificationStatus === "pending";
          const isVerified = winner.verificationStatus === "approved";
          const isPaid = winner.paymentStatus === "paid";

          return (
            <Card key={winner._id} className="border-border/50 bg-card/80 flex flex-col">
              <CardHeader className="pb-3 border-b border-border/50 bg-secondary/10">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {winner.userId?.firstName} {winner.userId?.lastName}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">{winner.userId?.email}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-emerald-glow tracking-tight">${winner.prizeAmount}</p>
                    <p className="text-xs text-muted-foreground">{winner.matchType} Match</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 py-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Verification</span>
                  {isPending ? (
                    <Badge variant="outline" className="opacity-70"><Clock className="h-3 w-3 mr-1"/> Pending</Badge>
                  ) : isVerified ? (
                    <Badge className="bg-emerald-glow/20 text-emerald-glow hover:bg-emerald-glow/30"><CheckCircle className="h-3 w-3 mr-1"/> Approved</Badge>
                  ) : (
                    <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1"/> Rejected</Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payout</span>
                  {isPaid ? (
                    <Badge className="bg-gold-glow/20 text-gold-glow hover:bg-gold-glow/30"><CreditCard className="h-3 w-3 mr-1"/> Transferred</Badge>
                  ) : (
                    <Badge variant="outline" className="opacity-70">Awaiting Auth</Badge>
                  )}
                </div>

                <div className="pt-2">
                  <span className="text-xs text-muted-foreground mb-1 block">Matched Winning Numbers:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {winner.matchedNumbers?.map((n: number) => (
                      <div key={n} className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/30">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-border/50 p-4 flex flex-col gap-3">
                {/* Actions */}
                {isPending && (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-emerald-glow border-emerald-glow/50 hover:bg-emerald-glow/10"
                      disabled={actionLoading === winner._id}
                      onClick={() => handleAction(winner._id, "verify")}
                    >
                      {actionLoading === winner._id ? <Loader2 className="h-3 w-3 animate-spin"/> : "Verify Match"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive border-destructive/50 hover:bg-destructive/10"
                      disabled={actionLoading === winner._id}
                      onClick={() => handleAction(winner._id, "reject")}
                    >
                      Reject Fraud
                    </Button>
                  </div>
                )}
                {isVerified && !isPaid && (
                  <div className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-gold-glow text-gold-glow-foreground hover:bg-gold-glow/90 font-bold"
                      disabled={actionLoading === winner._id}
                      onClick={() => handleAction(winner._id, "mark_paid")}
                    >
                      {actionLoading === winner._id ? <Loader2 className="h-4 w-4 animate-spin"/> : <><CreditCard className="h-4 w-4 mr-2" /> Mark Payout Complete</>}
                    </Button>
                  </div>
                )}
                {isPaid && (
                  <p className="text-xs text-center text-muted-foreground w-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Cycle Complete
                  </p>
                )}
              </CardFooter>
            </Card>
          );
        })}
        {winners.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg bg-secondary/10">
            No winners recorded in the system yet.
          </div>
        )}
      </div>
    </div>
  );
}
