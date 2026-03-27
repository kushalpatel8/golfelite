"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Heart, Mail, MapPin } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function Footer() {
  const { isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.role === "admin") setIsAdmin(true);
        })
        .catch(console.error);
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn]);

  return (
    <footer className="relative border-t border-border/50 bg-card/50">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Trophy className="h-6 w-6 text-primary" />
                <Heart className="absolute -bottom-1 -right-1 h-3 w-3 text-emerald-glow fill-emerald-glow" />
              </div>
              <span className="font-heading text-lg font-bold">
                Golf<span className="text-primary">Elite</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Play golf. Win prizes. Support charities. A modern platform where
              your scores create real impact.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-heading font-semibold text-sm tracking-wider uppercase mb-4 text-foreground">
              Platform
            </h3>
            <ul className="space-y-3">
              {[
                { label: "How It Works", href: "#how-it-works" },
                { label: "Pricing", href: "/pricing" },
                { label: "Monthly Draws", href: "#" },
                { label: "Leaderboard", href: "#" },
              ]
                .filter((link) => !(isAdmin && link.label === "Pricing"))
                .map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Charities */}
          <div>
            <h3 className="font-heading font-semibold text-sm tracking-wider uppercase mb-4 text-foreground">
              Impact
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Our Charities", href: "/charities" },
                { label: "How Giving Works", href: "#" },
                { label: "Impact Report", href: "#" },
                { label: "Partner With Us", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-sm tracking-wider uppercase mb-4 text-foreground">
              Connect
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                [EMAIL_ADDRESS]
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GolfElite. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
