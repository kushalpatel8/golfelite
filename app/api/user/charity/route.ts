import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import Charity from "@/lib/models/charity";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    // Get user and populate the selectedCharity
    const user = await User.findOne({ clerkId: userId }).populate("selectedCharity");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Optional: Return a list of all charities so the user can select one
    const charities = await Charity.find({}).sort({ name: 1 });

    return NextResponse.json({ 
        selectedCharity: user.selectedCharity,
        charityPercentage: user.charityPercentage,
        totalDonated: user.totalDonated,
        allCharities: charities
    });
  } catch (error) {
    console.error("GET /api/user/charity error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { charityId, charityPercentage } = body;

    await connectToDatabase();
    
    const updateData: any = {};
    if (charityId !== undefined) {
      updateData.selectedCharity = charityId === "none" ? null : charityId;
    }
    
    if (charityPercentage !== undefined) {
      if (charityPercentage < 10 || charityPercentage > 100) {
        return NextResponse.json({ error: "Percentage must be between 10 and 100" }, { status: 400 });
      }
      updateData.charityPercentage = charityPercentage;
    }

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: updateData },
      { new: true }
    ).populate("selectedCharity");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
        selectedCharity: user.selectedCharity,
        charityPercentage: user.charityPercentage 
    });
  } catch (error) {
    console.error("PUT /api/user/charity error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
