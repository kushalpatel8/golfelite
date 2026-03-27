"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserCog, Mail, Calendar, Edit2, Shield, User as UserIcon, Trash2, Ban, CheckCircle, LayoutDashboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [filter, setFilter] = useState<"all" | "admin" | "player">("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to promote this user to Admin?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId, updates: { role: "admin" } }),
      });
      if (res.ok) {
        toast.success("User promoted to Admin");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleUpdateSubscription = async (userId: string, status: string) => {
    const actionStr = status === "active" ? "grant subscription to" : "cancel subscription for";
    if (!confirm(`Are you sure you want to ${actionStr} this user?`)) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId, updates: { subscriptionStatus: status } }),
      });
      if (res.ok) {
        toast.success(`Subscription ${status === "active" ? "activated" : "cancelled"} successfully!`);
        fetchUsers();
      } else {
        toast.error("Failed to update subscription");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleBanUser = async (userId: string, currentBanState: boolean) => {
    const actionStr = currentBanState ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${actionStr} this user from the platform?`)) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId, updates: { isBanned: !currentBanState } }),
      });
      if (res.ok) {
        toast.success(`User successfully ${actionStr}ned!`);
        fetchUsers();
      } else {
        const errorData = await res.json();
        toast.error(`Failed: ${errorData.error}`);
      }
    } catch (err: any) {
      toast.error("Network error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you securely authorizing the permanent deletion of this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted permanently");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const saveUserEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: editingUser._id,
          updates: {
            firstName: editingUser.firstName,
            lastName: editingUser.lastName,
            subscriptionStatus: editingUser.subscriptionStatus,
            scores: editingUser.scores,
          },
        }),
      });
      if (res.ok) {
        toast.success("User updated successfully");
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const removeScore = (scoreIndex: number) => {
    const newScores = [...editingUser.scores];
    newScores.splice(scoreIndex, 1);
    setEditingUser({ ...editingUser, scores: newScores });
  };

  const addMockScore = () => {
    if ((editingUser.scores?.length || 0) >= 5) {
      toast.error("Maximum 5 scores allowed");
      return;
    }
    const newScore = {
      grossScore: 85,
      handicap: 12,
      courseRating: 72,
      slopeRating: 113,
      stablefordPoints: 36,
      date: new Date(),
    };
    setEditingUser({ ...editingUser, scores: [...(editingUser.scores || []), newScore] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gold-glow" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <UserCog className="h-8 w-8 text-gold-glow" />
            User Management ({users.length})
          </h1>
          <p className="text-muted-foreground mt-1">Review profiles, roles, and subscriptions.</p>
        </div>
        
        <div className="flex bg-secondary/30 p-1 rounded-lg border border-border/50">
          <Button variant={filter === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("all")} className={filter === "all" ? "bg-background shadow-sm" : ""}>All</Button>
          <Button variant={filter === "admin" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("admin")} className={filter === "admin" ? "bg-background shadow-sm" : ""}>Admins</Button>
          <Button variant={filter === "player" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("player")} className={filter === "player" ? "bg-background shadow-sm" : ""}>Players</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.filter(user => {
          if (filter === "admin") return user.role === "admin";
          if (filter === "player") return user.role !== "admin";
          return true;
        }).map((user) => (
          <Card key={user._id} className="border-border/50 bg-card/80 hover:border-gold-glow/30 transition-all relative overflow-hidden flex flex-col">
            <div className={user.isBanned ? "blur-[3px] opacity-50 pointer-events-none transition-all duration-300 flex-1" : "transition-all duration-300 flex-1"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-full">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
                      ) : (
                        <UserIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">{user.firstName} {user.lastName}</CardTitle>
                      <p className="text-xs flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {user.role === "admin" ? (
                    <Badge className="bg-gold-glow/20 text-gold-glow hover:bg-gold-glow/20 border-gold-glow/50">
                      <Shield className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline">Player</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-2 text-sm space-y-3 pb-2">
                {user.role !== "admin" && (
                  <div className="flex justify-between items-center border-t border-border/50 pt-2">
                    <span className="text-muted-foreground">Subscription</span>
                    <Badge variant={user.subscriptionStatus === "active" ? "default" : "secondary"}>
                      {user.subscriptionStatus.toUpperCase()}
                    </Badge>
                  </div>
                )}
                {user.role !== "admin" && (
                  <div className="flex justify-between items-center border-t border-border/50 pt-2">
                    <span className="text-muted-foreground">Scores Logged</span>
                    <span className="font-semibold">{user.scores?.length || 0}/5</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-border/50 pt-2">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </div>

            <div className="p-6 pt-4 grid grid-cols-2 gap-2 mt-auto border-t border-border/10 bg-card/50">
              {user.role !== "admin" && (
                <Link href={`/dashboard?userId=${user.clerkId || user._id}`} className="block">
                  <Button variant="outline" size="sm" className="w-full border-primary/50 text-primary hover:bg-primary/10" disabled={user.isBanned}>
                    <LayoutDashboard className="h-3 w-3 mr-1" /> View Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" className="w-full text-foreground" onClick={() => setEditingUser({...user})} disabled={user.isBanned}>
                <Edit2 className="h-3 w-3 mr-1" /> Edit Profile
              </Button>
              {user.role !== "admin" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-foreground hover:bg-muted" 
                  onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}&su=Message from GolfElite Admin`, '_blank')}
                >
                  <Mail className="h-3 w-3 mr-1" /> Email User
                </Button>
              )}
              {user.role !== "admin" && (
                <Button variant="outline" size="sm" className="w-full text-gold-glow border-gold-glow/50 hover:bg-gold-glow/10" onClick={() => promoteToAdmin(user._id)} disabled={user.isBanned}>
                  Promote Admin
                </Button>
              )}
              {user.role !== "admin" && (
                <>
                  {user.subscriptionStatus === "active" ? (
                    <Button variant="outline" size="sm" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10" onClick={() => handleUpdateSubscription(user._id, "cancelled")}>
                      Cancel Subscription
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full text-emerald-glow border-emerald-glow/50 hover:bg-emerald-glow/10" onClick={() => handleUpdateSubscription(user._id, "active")}>
                      Give Subscription
                    </Button>
                  )}
                </>
              )}
              {user.role !== "admin" && (
                <Button variant="outline" size="sm" className={`w-full ${user.isBanned ? "text-emerald-glow border-emerald-glow/50 hover:bg-emerald-glow/10" : "text-orange-500 border-orange-500/50 hover:bg-orange-500/10"}`} onClick={() => handleBanUser(user._id, user.isBanned)}>
                  {user.isBanned ? <CheckCircle className="h-3 w-3 mr-1" /> : <Ban className="h-3 w-3 mr-1" />}
                  {user.isBanned ? "Unban" : "Ban"}
                </Button>
              )}
              {user.role !== "admin" && (
                <Button variant="outline" size="sm" className="w-full col-span-2 text-destructive border-destructive/50 hover:bg-destructive/10" onClick={() => handleDeleteUser(user._id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete Permanently
                </Button>
              )}
            </div>

            {user.isBanned && (
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="destructive" className="animate-pulse shadow-lg shadow-destructive/20 border-destructive/50">
                  <Ban className="h-3 w-3 mr-1" /> ACCOUNT BANNED
                </Badge>
              </div>
            )}
          </Card>
        ))}
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg shadow-2xl bg-card border-border/50 overflow-auto max-h-[90vh]">
            <CardHeader className="flex flex-row justify-between items-center border-b border-border/50 pb-4">
              <CardTitle>Edit User: {editingUser.email}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditingUser(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <form onSubmit={saveUserEdits} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input 
                      value={editingUser.firstName} 
                      onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input 
                      value={editingUser.lastName} 
                      onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})} 
                    />
                  </div>
                </div>

                {editingUser.role !== "admin" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subscription Status</label>
                    <select 
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={editingUser.subscriptionStatus}
                      onChange={(e) => setEditingUser({...editingUser, subscriptionStatus: e.target.value})}
                    >
                      <option value="none">None</option>
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="lapsed">Lapsed</option>
                    </select>
                  </div>
                )}

                {editingUser.role !== "admin" && (
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Golf Scores ({editingUser.scores?.length || 0}/5)</label>
                      <Button type="button" variant="outline" size="sm" onClick={addMockScore}>+ Add Fix</Button>
                    </div>
                    {editingUser.scores?.map((score: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-secondary/50 p-2 rounded border border-border/50">
                        <div>
                          <p className="text-sm font-bold text-primary">Stableford: {score.stablefordPoints}</p>
                          <p className="text-xs text-muted-foreground">{new Date(score.date).toLocaleDateString()}</p>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeScore(idx)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!editingUser.scores || editingUser.scores.length === 0) && (
                      <div className="text-xs text-muted-foreground text-center py-2">No scores logged.</div>
                    )}
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-2 border-t border-border/50">
                  <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
