"use client";

import { PricingTable } from "@clerk/nextjs";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SubscriptionsPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col py-16 md:py-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
        <div className="w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 pointer-events-none">
        <div className="w-96 h-96 bg-emerald-glow/10 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-5xl px-4 text-center relative z-10">
        <div className="flex justify-center items-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
              <Trophy className="h-4 w-4" /> Upgrade to Pro
            </div>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          Choose Your <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-glow">Plan</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Upgrade to unlock unlimited round tracking, extended Stableford history, and gain massive automatic ticket allocations for our monthly charity draws!
        </p>

        <div className="flex justify-center mt-8 gap-4">
            <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
            </Link>
        </div>
      </div>

      <div className="mt-16 px-4">
        <div className="mx-auto max-w-6xl flex justify-center clerk-pricing-container">
          <PricingTable
            appearance={{
              variables: {
                colorPrimary: "#10b981", // emerald-500
              },
              elements: {
                primaryButton: "bg-green-600 hover:bg-green-700 text-white",
              }
            }}
          />
        </div>
      </div>
    </main>
  );
}