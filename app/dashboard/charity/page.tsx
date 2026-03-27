"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Heart,
  Check,
  Search,
  Globe,
  Users,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Charity {
  _id: string;
  name: string;
  category: string;
  totalDonors: number;
  totalContributions: number;
}

export default function CharityPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contribution, setContribution] = useState([10]);
  const [search, setSearch] = useState("");
  
  const [allCharities, setAllCharities] = useState<Charity[]>([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/charity");
      if (res.ok) {
        const data = await res.json();
        setAllCharities(data.allCharities || []);
        if (data.selectedCharity) {
          setSelectedId(data.selectedCharity._id);
        }
        if (data.charityPercentage) {
          setContribution([data.charityPercentage]);
        }
        setTotalDonated(data.totalDonated || 0);
      } else {
        toast.error("Failed to load charity data");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/user/charity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          charityId: selectedId || "none",
          charityPercentage: contribution[0]
        }),
      });

      if (res.ok) {
        toast.success("Charity preferences updated");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (e) {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  const selected = allCharities.find((c) => c._id === selectedId);
  const filtered = allCharities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Example subscription cost is $9.99 for calculation purposes
  const baseSubPrice = 9.99;
  const monthlyAmount = (baseSubPrice * contribution[0]) / 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-emerald-glow" />
          Your Charity
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a charity and set your contribution percentage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Charity & Contribution */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-emerald-glow/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Current Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {selected?.name ?? "None Selected"}
                  </p>
                  {selected && (
                    <Badge variant="secondary" className="text-xs mt-0.5">
                      {selected.category}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contribution</span>
                  <span className="font-bold text-primary">
                    {contribution[0]}%
                  </span>
                </div>
                <Slider
                  value={contribution}
                  onValueChange={setContribution}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Min 10% • Approx ${monthlyAmount.toFixed(2)}/month
                </p>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="w-full" 
                size="sm"
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-heading text-sm font-semibold">
                Your Impact
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Monthly", value: `$${monthlyAmount.toFixed(2)}` },
                  { label: "Yearly", value: `$${(monthlyAmount * 12).toFixed(2)}` },
                  { label: "Total Donated", value: `$${totalDonated.toFixed(2)}` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charity Selector */}
        <div className="lg:col-span-2">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search charities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {allCharities.length === 0 ? (
            <div className="text-center p-8 bg-card/50 rounded-xl border border-dashed border-border/50">
              <p className="text-muted-foreground">No charities available yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((charity) => {
                const isSelected = charity._id === selectedId;
                return (
                  <Card
                    key={charity._id}
                    className={`cursor-pointer border transition-all duration-300 ${
                      isSelected
                        ? "border-primary/30 bg-primary/5 shadow-md"
                        : "border-border/50 bg-card/80 hover:border-primary/10 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedId(charity._id)}
                  >
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isSelected ? "bg-primary/20" : "bg-secondary"
                          }`}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isSelected
                                ? "text-primary fill-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{charity.name}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {charity.totalDonors || 0} donors
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {charity.category || "General"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-sm font-heading font-bold text-primary">
                          ${((charity.totalContributions || 0) / 1000).toFixed(1)}K
                        </span>
                        {isSelected && (
                          <div className="p-1 rounded-full bg-primary">
                            <Check className="h-3.5 w-3.5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
