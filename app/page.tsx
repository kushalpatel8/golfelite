"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useUser } from "@clerk/nextjs";
import { motion, useInView } from "framer-motion";
import {
  Trophy,
  Heart,
  Target,
  Users,
  Award,
  ArrowRight,
  Check,
  Star,
  Zap,
  Globe,
  TrendingUp,
  Gift,
  Sparkles,
  ChevronRight,
} from "lucide-react";

/* ── Animated Section Wrapper ── */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ── Animated Counter ── */
function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: string;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="font-heading text-4xl md:text-5xl font-bold"
    >
      {prefix}
      {value}
      {suffix}
    </motion.span>
  );
}

export default function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <main className="relative overflow-hidden">
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center gradient-hero">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-glow/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-gold-glow/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-1.5 text-sm font-medium border border-primary/20 bg-primary/10 text-primary"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Season 1 — Monthly Draws Open
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
            >
              <span className="text-foreground">Play.</span>{" "}
              <span className="bg-linear-to-r from-primary via-emerald-glow to-primary bg-clip-text text-transparent">
                Win.
              </span>{" "}
              <span className="text-foreground">Give.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Enter your golf scores, compete in monthly draws, and support
              charities that matter. Your game creates real impact.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isSignedIn ? (
                <a href="/dashboard">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 group"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
              ) : (
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6 font-semibold border-border/50 hover:bg-secondary/50"
                >
                  See How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-linear-to-br from-primary/40 to-emerald-glow/40 border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>500+ Active Players</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-gold-glow text-gold-glow"
                  />
                ))}
                <span className="ml-1">Rated 4.9/5</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 bg-background relative" delay={0}>
        <div id="how-it-works" className="absolute -top-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Zap className="h-3 w-3 mr-1" /> Simple & Rewarding
            </Badge>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Three Steps to Impact
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              It takes less than 2 minutes to join. Your golf scores do the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: "01",
                icon: Target,
                title: "Subscribe",
                description:
                  "Choose your plan and select a charity you care about. A portion of your subscription goes directly to them.",
                color: "from-primary/20 to-primary/5",
                iconColor: "text-primary",
              },
              {
                step: "02",
                icon: TrendingUp,
                title: "Enter Scores",
                description:
                  "Log your last 5 Stableford scores. They're automatically entered into the monthly draw — no extra effort needed.",
                color: "from-gold-glow/20 to-gold-glow/5",
                iconColor: "text-gold-glow",
              },
              {
                step: "03",
                icon: Gift,
                title: "Win & Give",
                description:
                  "Match numbers in the monthly draw to win cash prizes. Meanwhile, your charity receives contributions every month.",
                color: "from-emerald-glow/20 to-emerald-glow/5",
                iconColor: "text-emerald-glow",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Card className="relative group hover:shadow-xl transition-all duration-500 overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm h-full">
                  {/* Gradient Top Edge */}
                  <div
                    className={`absolute top-0 inset-x-0 h-1 bg-linear-to-r ${item.color}`}
                  />
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`p-3 rounded-xl bg-linear-to-br ${item.color}`}
                      >
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <span className="font-heading text-4xl font-bold text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ══════════════════════════════════════════
          LIVE STATS
      ══════════════════════════════════════════ */}
      <AnimatedSection className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                value: "$42K",
                label: "Donated to Charities",
                icon: Heart,
                color: "text-emerald-glow",
              },
              {
                value: "520",
                label: "Active Players",
                icon: Users,
                color: "text-primary",
              },
              {
                value: "$18K",
                label: "Prizes Awarded",
                icon: Award,
                color: "text-gold-glow",
              },
              {
                value: "12",
                label: "Partner Charities",
                icon: Globe,
                color: "text-purple-glow",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="space-y-2"
              >
                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <AnimatedCounter value={stat.value} />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ══════════════════════════════════════════
          CHARITY SPOTLIGHT
      ══════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Heart className="h-3 w-3 mr-1" /> Featured Charity
              </Badge>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
                Every Swing <br />
                <span className="text-primary">Makes a Difference</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                When you subscribe, at least 10% of your fee goes directly to a
                charity of your choice. You can increase your contribution at any
                time — or make standalone donations.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Choose from our curated list of verified charities",
                  "Set your contribution percentage (10% minimum)",
                  "Track your total impact in your dashboard",
                  "Make additional one-off donations anytime",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-0.5 p-0.5 rounded-full bg-primary/20">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/charities">
                <Button variant="outline" className="group">
                  Explore Charities
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Charity Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-emerald-glow/5 to-transparent rounded-3xl blur-2xl" />
              <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-primary/10">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold">
                        Golf for Good Foundation
                      </h3>
                      <p className="text-sm text-muted-foreground">Featured Partner</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Bringing the joy of golf to underserved communities while creating
                    natural green spaces. Every contribution helps build community golf
                    spaces and fund youth programs.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Raised", value: "$12.4K" },
                      { label: "Donors", value: "184" },
                      { label: "Events", value: "3" },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="text-center p-3 rounded-xl bg-secondary/50"
                      >
                        <p className="font-heading text-lg font-bold text-primary">
                          {metric.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>



      {/* ══════════════════════════════════════════
          DRAW PREVIEW
      ══════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Award className="h-3 w-3 mr-1" /> Monthly Draws
            </Badge>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              How the Draw Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your 5 stored golf scores are your ticket numbers. Each month, 5
              winning numbers are drawn. Match them and win.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Sample Draw Numbers */}
            <div className="flex items-center justify-center gap-3 mb-12">
              {[12, 27, 34, 38, 44].map((num, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1, type: "spring" }}
                  className="w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-linear-to-br from-primary to-emerald-glow flex items-center justify-center text-primary-foreground font-heading text-xl md:text-2xl font-bold shadow-lg"
                >
                  {num}
                </motion.div>
              ))}
            </div>

            {/* Prize Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  match: "5 Match",
                  share: "40%",
                  description: "Jackpot — rolls over if unclaimed",
                  highlight: true,
                },
                {
                  match: "4 Match",
                  share: "35%",
                  description: "Split equally among winners",
                  highlight: false,
                },
                {
                  match: "3 Match",
                  share: "25%",
                  description: "Split equally among winners",
                  highlight: false,
                },
              ].map((tier) => (
                <Card
                  key={tier.match}
                  className={`border-border/50 ${
                    tier.highlight
                      ? "bg-linear-to-br from-primary/10 to-emerald-glow/5 border-primary/20"
                      : "bg-card/80"
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <p className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {tier.match}
                    </p>
                    <p className="font-heading text-3xl font-bold text-primary mb-2">
                      {tier.share}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tier.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>



      <Footer />
    </main>
  );
}