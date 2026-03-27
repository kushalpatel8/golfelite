"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Settings,
  User,
  CreditCard,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    fetchProfile();
    
    // Check if we just returned from Stripe
    const query = new URLSearchParams(window.location.search);
    if (query.get("session_id")) {
      toast.success("Subscription updated successfully!");
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
      } else {
        toast.error("Failed to load profile");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (res.ok) {
        toast.success("Profile updated");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = () => {
    window.location.href = "/pricing";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile, subscription, and preferences.
        </p>
      </div>

      {/* Profile */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={profile?.email || ""} disabled className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">
              Managed securely via Clerk. Change via your account portal.
            </p>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} size="sm">
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Membership Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/20 gap-4">
            <div>
              <p className="font-medium text-sm">Subscription Management</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Upgrade to Pro to participate in our massive monthly charity draws and gain extra automatic tickets.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                onClick={handleSubscribe}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Manage via Clerk Billing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
