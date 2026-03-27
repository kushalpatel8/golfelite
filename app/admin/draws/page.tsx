"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Settings, Trophy, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [algorithm, setAlgorithm] = useState("standard");

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const res = await fetch("/api/admin/draws");
      const data = await res.json();
      if (res.ok) setDraws(data.draws || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const simulateDraw = async () => {
    try {
      setSimulating(true);
      const res = await fetch("/api/admin/draws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "simulate", algorithm }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Draw Simulated Successfully");
        fetchDraws();
      } else {
        toast.error(data.error || "Simulation failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSimulating(false);
    }
  };

  const publishDraw = async (drawId: string) => {
    try {
      const res = await fetch("/api/admin/draws", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: drawId, action: "publish" }),
      });
      if (res.ok) {
        toast.success("Draw Published! Players notified.");
        fetchDraws();
      }
    } catch (err) {
      toast.error("Failed to publish draw");
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
            <Trophy className="h-8 w-8 text-gold-glow" />
            Draw Management
          </h1>
          <p className="text-muted-foreground mt-1">Configure logic, simulate, and publish results.</p>
        </div>
        <Button onClick={simulateDraw} disabled={simulating} className="bg-gold-glow hover:bg-gold-glow/90 text-gold-glow-foreground">
          {simulating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Run Simulation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logic Configuration (Visual only for now, extends easily) */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              Draw Logic Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className={`p-4 rounded-lg border flex justify-between items-center cursor-pointer transition-all ${
                algorithm === "standard" 
                ? "bg-secondary/30 border-primary shadow-sm" 
                : "bg-muted/10 border-border/50 hover:bg-muted/30"
              }`}
              onClick={() => setAlgorithm("standard")}
            >
              <div>
                <p className="font-medium flex items-center gap-2">Standard True Random <span className="text-xs font-normal text-muted-foreground">(1-50)</span></p>
                <p className="text-xs text-muted-foreground mt-1">Equal probability for all numbers.</p>
              </div>
              {algorithm === "standard" && (
                <Badge variant="outline" className="bg-emerald-glow/10 text-emerald-glow border-emerald-glow/50">
                  Active
                </Badge>
              )}
            </div>
            <div 
              className={`p-4 rounded-lg border flex justify-between items-center cursor-pointer transition-all ${
                algorithm === "weighted" 
                ? "bg-secondary/30 border-primary shadow-sm" 
                : "bg-muted/10 border-border/50 hover:bg-muted/30"
              }`}
              onClick={() => setAlgorithm("weighted")}
            >
              <div>
                <p className="font-medium flex items-center gap-2">Weighted Algorithm <Trophy className="h-3 w-3 text-gold-glow" /></p>
                <p className="text-xs text-muted-foreground mt-1">Prioritizes active Pro tier users based on their scores.</p>
              </div>
              {algorithm === "weighted" && (
                <Badge variant="outline" className="bg-emerald-glow/10 text-emerald-glow border-emerald-glow/50">
                  Active
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent & Pending Draws */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-gold-glow" />
              Simulation Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {draws.filter((d) => d.status === "pending").map((draw) => (
              <div key={draw._id} className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Simulated Potential Draw</span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">Pending Publish</Badge>
                </div>
                <div className="flex gap-2">
                  {draw.numbers?.map((num: number) => (
                    <div key={num} className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {num}
                    </div>
                  ))}
                </div>
                <Button size="sm" onClick={() => publishDraw(draw._id)} className="w-full mt-2">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Publish Results Confirmed
                </Button>
              </div>
            ))}
            {draws.filter((d) => d.status === "pending").length === 0 && (
              <div className="text-center p-6 text-muted-foreground text-sm border border-dashed rounded-lg">
                No pending simulations. Run a simulation to draft numbers.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
