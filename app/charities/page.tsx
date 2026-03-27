"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  Users,
  Globe,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Sample charity data (will be replaced by API data)
const charities = [
  {
    id: "1",
    name: "Golf for Good Foundation",
    slug: "golf-for-good",
    shortDescription:
      "Bringing the joy of golf to underserved communities while creating natural green spaces.",
    category: "Community",
    totalContributions: 12400,
    totalDonors: 184,
    featured: true,
    events: 3,
  },
  {
    id: "2",
    name: "GreenSwing Trust",
    slug: "greenswing-trust",
    shortDescription:
      "Planting trees and restoring habitats through golf course sustainability initiatives.",
    category: "Environment",
    totalContributions: 8200,
    totalDonors: 97,
    featured: false,
    events: 1,
  },
  {
    id: "3",
    name: "Junior Tees Initiative",
    slug: "junior-tees",
    shortDescription:
      "Introducing golf to young people from all backgrounds with free coaching and equipment.",
    category: "Youth",
    totalContributions: 15700,
    totalDonors: 231,
    featured: true,
    events: 5,
  },
  {
    id: "4",
    name: "Veterans on the Fairway",
    slug: "veterans-fairway",
    shortDescription:
      "Supporting military veterans' mental health through golf therapy and community.",
    category: "Health",
    totalContributions: 6900,
    totalDonors: 78,
    featured: false,
    events: 2,
  },
  {
    id: "5",
    name: "Accessible Golf Alliance",
    slug: "accessible-golf",
    shortDescription:
      "Making golf accessible to people with disabilities through adaptive equipment and coaching.",
    category: "Accessibility",
    totalContributions: 9500,
    totalDonors: 112,
    featured: false,
    events: 2,
  },
  {
    id: "6",
    name: "First Swing Foundation",
    slug: "first-swing",
    shortDescription:
      "Providing first-time golf experiences for families who could never afford it.",
    category: "Community",
    totalContributions: 4200,
    totalDonors: 56,
    featured: false,
    events: 1,
  },
];

const categories = ["All", "Community", "Environment", "Youth", "Health", "Accessibility"];

export default function CharitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = charities.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || c.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 gradient-hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">
            <Heart className="h-3 w-3 mr-1" /> Our Partners
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            Charities We Support
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every subscription fuels real impact. Choose a charity you believe in
            and watch your contributions grow.
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-8 border-b border-border/50 sticky top-16 md:top-20 z-40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search charities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="text-xs"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Charity Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">
                No charities found
              </h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((charity, i) => (
                <motion.div
                  key={charity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="group h-full border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
                    {charity.featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-primary/90 text-primary-foreground text-xs">
                          <Sparkles className="h-3 w-3 mr-1" /> Featured
                        </Badge>
                      </div>
                    )}

                    {/* Color Banner */}
                    <div className="h-2 bg-gradient-to-r from-primary via-emerald-glow to-primary" />

                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                          <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading text-lg font-semibold truncate group-hover:text-primary transition-colors">
                            {charity.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {charity.category}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2">
                        {charity.shortDescription}
                      </p>

                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-2 rounded-lg bg-secondary/50">
                          <p className="font-heading text-sm font-bold text-primary">
                            ${(charity.totalContributions / 1000).toFixed(1)}K
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Raised
                          </p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-secondary/50">
                          <p className="font-heading text-sm font-bold">
                            {charity.totalDonors}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Users className="h-3 w-3 inline" />
                          </p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-secondary/50">
                          <p className="font-heading text-sm font-bold">
                            {charity.events}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 inline" />
                          </p>
                        </div>
                      </div>

                      <Link href={`/charities/${charity.slug}`}>
                        <Button
                          variant="outline"
                          className="w-full group/btn"
                          size="sm"
                        >
                          Learn More
                          <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
