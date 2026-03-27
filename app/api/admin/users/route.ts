import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";

export const dynamic = "force-dynamic";

// GET all users
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const adminUser = await User.findOne({ clerkId: userId });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await User.find().sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT (update a user's subscription, role, ban status, etc)
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const adminUser = await User.findOne({ clerkId: userId });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { targetUserId, updates } = body;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const client = await clerkClient();

    // Handle Native Clerk Banning
    try {
      if (targetUser.clerkId && targetUser.clerkId.startsWith("user_")) {
        if (updates.isBanned === true) {
          await client.users.banUser(targetUser.clerkId);
        } else if (updates.isBanned === false) {
          await client.users.unbanUser(targetUser.clerkId);
        }
      } else {
        console.warn("Skipping Clerk hook: User has missing or mock clerkId:", targetUser.clerkId);
      }
    } catch (e) {
      console.warn("Clerk ban sync failed (User may be deleted in Clerk):", e);
    }

    const updatedUser = await User.findByIdAndUpdate(targetUserId, updates, { new: true });
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE (permanently remove a user from the platform's database)
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const adminUser = await User.findOne({ clerkId: userId });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("id");

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing Target ID" }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    if (targetUser) {
      const client = await clerkClient();
      try {
        await client.users.deleteUser(targetUser.clerkId);
      } catch (e) {
        console.warn("User already missing from Clerk DB, advancing to Mongo wipe.");
      }
      await User.findByIdAndDelete(targetUserId);
    }
    
    return NextResponse.json({ success: true, message: "User completely deleted from Mongo and Clerk." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
