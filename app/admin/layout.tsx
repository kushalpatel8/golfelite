import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Users, Trophy, Heart, Gift, BarChart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await connectToDatabase();
  const dbUser = await User.findOne({ clerkId: userId });

  if (!dbUser || dbUser.role !== "admin") {
    redirect("/dashboard");
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Draws", href: "/admin/draws", icon: Trophy },
    { label: "Charities", href: "/admin/charities", icon: Heart },
    { label: "Winners", href: "/admin/winners", icon: Gift },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Focus on Admin */}
      <aside className="w-64 border-r border-gold-glow/20 bg-card/50 backdrop-blur-sm shadow-xl hidden lg:flex flex-col">
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2 group">
            <Trophy className="h-6 w-6 text-gold-glow" />
            <span className="font-heading text-lg font-bold">
              GolfElite <span className="text-gold-glow">Admin</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-gold-glow/10 hover:text-foreground"
            >
              <item.icon className="h-4 w-4 text-gold-glow/70" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        <header className="flex flex-wrap items-center justify-between p-4 px-8 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-40">
          <h2 className="font-heading font-semibold text-gold-glow flex items-center gap-2">
            <Shield className="h-5 w-5" /> Admin Terminal
          </h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 border border-gold-glow/50" } }} />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
