import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import ClientPage from "./client-page";

export default async function DashboardPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const searchParams = await props.searchParams;
  const impersonatedUserId = searchParams?.userId;

  if (!impersonatedUserId) {
    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: userId });

    if (!dbUser || !dbUser.onboardingComplete) {
      redirect("/onboarding");
    }

    if (dbUser.role === "admin") {
      redirect("/admin");
    }
  }

  return <ClientPage />;
}
