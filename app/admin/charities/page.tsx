"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Heart, Plus, Trash2, Edit, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    shortDescription: "", 
    category: "General",
    logo: "",
    featured: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await fetch("/api/admin/charities");
      const data = await res.json();
      if (res.ok) setCharities(data.charities || []);
    } catch {
      toast.error("Failed to load charities");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (charity: any) => {
    setEditingId(charity._id);
    setFormData({
      name: charity.name || "",
      description: charity.description || "",
      shortDescription: charity.shortDescription || "",
      category: charity.category || "General",
      logo: charity.logo || "",
      featured: charity.featured || false
    });
    setShowForm(true);
  };

  const handleCreateNewClick = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", shortDescription: "", category: "General", logo: "", featured: false });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEditing = !!editingId;
      const res = await fetch("/api/admin/charities", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { id: editingId, ...formData } : formData),
      });
      if (res.ok) {
        toast.success(isEditing ? "Charity Updated" : "Charity Added");
        cancelForm();
        fetchCharities();
      } else {
        toast.error("Error saving charity");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/charities?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Charity Deleted");
        fetchCharities();
      }
    } catch {
      toast.error("Error deleting");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gold-glow" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-gold-glow" />
            Charity Management
          </h1>
          <p className="text-muted-foreground mt-1">Add, edit, and safely manage platform partner charities.</p>
        </div>
        <Button onClick={handleCreateNewClick} className="bg-gold-glow hover:bg-gold-glow/90 text-gold-glow-foreground">
          <Plus className="h-4 w-4 mr-2" /> Add Charity
        </Button>
      </div>

      {/* OVERLAY MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl shadow-2xl bg-card border-gold-glow/30 overflow-auto max-h-[90vh]">
            <CardHeader className="flex flex-row justify-between items-center border-b border-border/50 pb-4">
              <CardTitle>{editingId ? "Edit Charity" : "Register New Partner Charity"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={cancelForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Name</label>
                    <Input
                      placeholder="Charity Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Category</label>
                    <Input
                      placeholder="e.g. Wildlife, Health, Youth"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Logo URL / Image</label>
                  <Input
                    placeholder="https://example.com/logo.png"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Short Description (1 sentence)</label>
                  <Input
                    placeholder="Brief objective"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Full Description</label>
                  <textarea
                    placeholder="Detailed explanation..."
                    required
                    className="w-full min-h-[100px] flex rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={formData.featured} 
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})} 
                    className="rounded border-gray-300 text-gold-glow focus:ring-gold-glow"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured Charity (Highlights on homepage)</label>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={cancelForm}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-gold-glow text-gold-glow-foreground hover:bg-gold-glow/90">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" /> : (editingId ? "Save Changes" : "Save Charity")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map((charity) => (
          <Card key={charity._id} className="border-border/50 bg-card/80 flex flex-col hover:border-gold-glow/20 transition-all">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-3">
                  {charity.logo && (
                    <div className="w-10 h-10 rounded-md bg-secondary/50 border border-border/50 overflow-hidden flex-shrink-0">
                      <img src={charity.logo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg leading-tight">{charity.name}</CardTitle>
                    <Badge variant="outline" className="w-fit mt-1 text-xs">{charity.category}</Badge>
                  </div>
                </div>
                {charity.featured && <Badge className="bg-emerald-glow/20 text-emerald-glow border-emerald-glow/50 shrink-0">Featured</Badge>}
              </div>
            </CardHeader>
            <CardContent className="flex-1 pb-3 text-sm text-muted-foreground">
              <p className="line-clamp-3">{charity.shortDescription || charity.description}</p>
              
              <div className="mt-4 space-y-2 pt-4 border-t border-border/50 text-xs">
                <div className="flex justify-between">
                  <span>Total Donors</span>
                  <span className="font-semibold text-foreground">{charity.totalDonors}</span>
                </div>
                <div className="flex justify-between">
                  <span>Allocated Funds</span>
                  <span className="font-semibold text-emerald-glow">${charity.totalContributions || 0}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2 border-t border-border/10">
              <Button variant="outline" size="sm" className="flex-1 mt-4" onClick={() => handleEditClick(charity)}>
                <Edit className="h-3 w-3 mr-2" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="mt-4 text-destructive border-destructive/50 hover:bg-destructive/10" onClick={() => handleDelete(charity._id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        {charities.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg bg-secondary/10">
            No charities found. Click "Add Charity" to register one.
          </div>
        )}
      </div>
    </div>
  );
}
