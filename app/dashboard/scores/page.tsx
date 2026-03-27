"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Target,
  Plus,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
} from "lucide-react";

interface Score {
  _id: string;
  stablefordPoints: number;
  grossScore: number;
  handicap: number;
  courseRating: number;
  slopeRating: number;
  date: string;
}

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Add State
  const [newStableford, setNewStableford] = useState("");
  const [newGrossScore, setNewGrossScore] = useState("");
  const [newHandicap, setNewHandicap] = useState("");
  const [newDate, setNewDate] = useState("");

  // Edit State
  const [editStableford, setEditStableford] = useState("");
  const [editGrossScore, setEditGrossScore] = useState("");
  const [editHandicap, setEditHandicap] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/scores");
      if (res.ok) {
        const data = await res.json();
        setScores(data.scores || []);
      } else {
        toast.error("Failed to load scores");
      }
    } catch (e) {
      toast.error("An error occurred loading scores");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const val = parseInt(newStableford);
    if (isNaN(val) || val < 1 || val > 45 || !newDate) {
      toast.error("Please enter a valid Stableford Score and Date");
      return;
    }

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stablefordPoints: val,
          grossScore: parseInt(newGrossScore) || 0,
          handicap: parseInt(newHandicap) || 0,
          date: newDate,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setScores(data.scores);
        setNewStableford("");
        setNewGrossScore("");
        setNewHandicap("");
        setNewDate("");
        setShowAdd(false);
        toast.success("Score added successfully!");
      } else {
        toast.error("Failed to add score");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleEdit = async (id: string) => {
    const val = parseInt(editStableford);
    if (isNaN(val) || val < 1 || val > 45 || !editDate) {
        toast.error("Please enter a valid Stableford Score and Date");
        return;
    }

    try {
      const res = await fetch("/api/scores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scoreId: id,
          stablefordPoints: val,
          grossScore: parseInt(editGrossScore) || 0,
          handicap: parseInt(editHandicap) || 0,
          date: editDate,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setScores(data.scores);
        setEditingId(null);
        toast.success("Score updated!");
      } else {
        toast.error("Failed to update score");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/scores?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        setScores(data.scores);
        toast.success("Score removed");
      } else {
        toast.error("Failed to delete score");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const startEdit = (score: Score) => {
    setEditingId(score._id);
    setEditStableford(score.stablefordPoints.toString());
    setEditGrossScore(score.grossScore ? score.grossScore.toString() : "");
    setEditHandicap(score.handicap ? score.handicap.toString() : "");
    // Format date for date input
    const dateObj = new Date(score.date);
    const yr = dateObj.getFullYear();
    const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    setEditDate(`${yr}-${mo}-${day}`);
  };

  const average =
    scores.length > 0
      ? (scores.reduce((s, c) => s + c.stablefordPoints, 0) / scores.length).toFixed(1)
      : "—";

  const best = scores.length > 0 ? Math.max(...scores.map((s) => s.stablefordPoints)) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Your Scores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your last 5 Stableford scores (1–45). They constitute your draw ticket numbers.
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          className="self-start"
          disabled={scores.length >= 5 && !showAdd}
        >
          {showAdd ? (
            <>
              <X className="h-4 w-4 mr-1" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" /> Add Score
            </>
          )}
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Average</p>
            <p className="font-heading text-2xl font-bold text-primary">
              {average}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Best</p>
            <p className="font-heading text-2xl font-bold text-emerald-glow">
              {best || "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Stored</p>
            <p className="font-heading text-2xl font-bold">{scores.length}/5</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Score Form */}
      {showAdd && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add New Round</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label className="text-xs">Stableford Points</Label>
                <Input
                  type="number"
                  min={1}
                  max={45}
                  value={newStableford}
                  onChange={(e) => setNewStableford(e.target.value)}
                  placeholder="e.g. 34"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Gross Score (Opt)</Label>
                <Input
                  type="number"
                  value={newGrossScore}
                  onChange={(e) => setNewGrossScore(e.target.value)}
                  placeholder="e.g. 82"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Handicap (Opt)</Label>
                <Input
                  type="number"
                  value={newHandicap}
                  onChange={(e) => setNewHandicap(e.target.value)}
                  placeholder="e.g. 15"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Date Played</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAdd} className="w-full">
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score List */}
      <div className="space-y-3">
        {scores.map((score, i) => {
          const isEditing = editingId === score._id;
          const prevScore = scores[i + 1]?.stablefordPoints;
          const trend =
            prevScore !== undefined
              ? score.stablefordPoints > prevScore
                ? "up"
                : score.stablefordPoints < prevScore
                ? "down"
                : "same"
              : null;

          return (
            <Card
              key={score._id}
              className={`border-border/50 transition-all duration-300 ${
                isEditing ? "bg-primary/5 border-primary/20" : "bg-card/80"
              }`}
            >
              <CardContent className="p-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                    <div>
                      <Label className="text-xs">Points</Label>
                      <Input
                        type="number"
                        min={1}
                        max={45}
                        value={editStableford}
                        onChange={(e) => setEditStableford(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Gross</Label>
                      <Input
                        type="number"
                        value={editGrossScore}
                        onChange={(e) => setEditGrossScore(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">HCP</Label>
                      <Input
                        type="number"
                        value={editHandicap}
                        onChange={(e) => setEditHandicap(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Date</Label>
                      <Input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => handleEdit(score._id)} size="sm">
                      <Save className="h-3.5 w-3.5 mr-1" /> Save
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingId(null)} size="sm">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center font-heading text-2xl font-bold text-primary">
                        {score.stablefordPoints}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-base">
                            {score.stablefordPoints >= 36
                              ? "🔥 Excellent Round"
                              : score.stablefordPoints >= 30
                              ? "💪 Great Round"
                              : score.stablefordPoints >= 24
                              ? "👍 Good Round"
                              : "🎯 Keep Pushing"}
                          </p>
                          {trend === "up" && <TrendingUp className="h-4 w-4 text-primary" />}
                          {trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(score.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        {(score.grossScore > 0 || score.handicap > 0) && (
                           <div className="flex gap-2 mt-1 -ml-1">
                              {score.grossScore > 0 && <Badge variant="outline" className="text-[10px]">Gross: {score.grossScore}</Badge>}
                              {score.handicap > 0 && <Badge variant="outline" className="text-[10px]">HCP: {score.handicap}</Badge>}
                           </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {i === 0 && (
                        <Badge variant="secondary" className="text-xs mr-2 hidden sm:flex">
                          Latest
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => startEdit(score)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(score._id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {scores.length === 0 && (
          <Card className="border-dashed border-2 border-border/50">
            <CardContent className="p-10 text-center">
              <Target className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">
                No Scores Yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Enter your Stableford scores to start tracking your performance and generate your monthly draw tickets.
              </p>
              <Button onClick={() => setShowAdd(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" /> Add Your First Score
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Draw Numbers Preview */}
      {scores.length > 0 && (
        <Card className="border-border/50 bg-card/80 mt-8">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-lg font-heading">
              Your Active Draw Numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              These scores formulate your ticket numbers for upcoming monthly draws.
            </p>
            <div className="flex flex-wrap gap-4">
              {scores.map((score) => (
                <div
                  key={score._id}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-emerald-glow flex items-center justify-center text-primary-foreground font-heading text-2xl font-bold shadow-lg shadow-primary/20"
                >
                  {score.stablefordPoints}
                </div>
              ))}
              {Array.from({ length: 5 - scores.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-border/50 bg-muted/20 flex items-center justify-center text-muted-foreground/30 font-heading text-2xl"
                >
                  ?
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
