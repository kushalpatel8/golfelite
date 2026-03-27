import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await req.json();

    if (token !== "12345") {
      return NextResponse.json({ error: "Invalid secure token" }, { status: 403 });
    }

    await connectToDatabase();
    
    // Find by clerkId first
    let user = await User.findOne({ clerkId: clerkUser.id });

    // Fallback: If clerkId isn't found but email exists (common if Clerk was reset during dev)
    if (!user && clerkUser.emailAddresses?.[0]?.emailAddress) {
      user = await User.findOne({ email: clerkUser.emailAddresses[0].emailAddress });
    }

    if (user) {
      // Existing user found -> Update to admin and ensure clerkId matches current session
      user.role = "admin";
      user.clerkId = clerkUser.id;
      user.firstName = clerkUser.firstName || user.firstName;
      user.lastName = clerkUser.lastName || user.lastName;
      user.onboardingComplete = true;
      await user.save();
    } else {
      // Completely new user -> Safe to create
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "admin@placeholder.com",
        firstName: clerkUser.firstName || "Admin",
        lastName: clerkUser.lastName || "User",
        avatar: clerkUser.imageUrl || "",
        role: "admin",
        onboardingComplete: true
      });
    }

    return NextResponse.json({ success: true, role: user.role });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
