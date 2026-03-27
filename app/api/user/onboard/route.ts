import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";

export async function POST() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    let user = await User.findOne({ clerkId: clerkUser.id });

    if (!user && clerkUser.emailAddresses?.[0]?.emailAddress) {
      user = await User.findOne({ email: clerkUser.emailAddresses[0].emailAddress });
    }

    if (user) {
      user.onboardingComplete = true;
      user.clerkId = clerkUser.id;
      user.firstName = clerkUser.firstName || user.firstName;
      user.lastName = clerkUser.lastName || user.lastName;
      await user.save();
    } else {
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "player@placeholder.com",
        firstName: clerkUser.firstName || "Player",
        lastName: clerkUser.lastName || "User",
        avatar: clerkUser.imageUrl || "",
        role: "user",
        onboardingComplete: true
      });
    }

    return NextResponse.json({ success: true, role: user.role });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
