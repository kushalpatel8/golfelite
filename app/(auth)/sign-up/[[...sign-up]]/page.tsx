import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-emerald-glow/5 blur-3xl animate-pulse-glow" />
      </div>
      <div className="relative z-10">
        <SignUp
          fallbackRedirectUrl="/onboarding"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl",
            },
          }}
        />
      </div>
    </div>
  );
}
