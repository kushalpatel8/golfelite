import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";
import Draw from "@/lib/models/draw";
import Ticket from "@/lib/models/ticket";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current month's active draw
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    let activeDraw = await Draw.findOne({
      month: currentMonth,
      year: currentYear,
      status: "pending"
    });

    if (!activeDraw) {
      // Mock creation if there isn't one. In production, a cron job should handle this.
      activeDraw = await Draw.create({
        month: currentMonth,
        year: currentYear,
        numbers: [0, 0, 0, 0, 0], // Not drawn yet
        status: "pending",
        prizePool: 0,
        jackpotCarryover: 0
      });
    }

    // Get past draws
    const pastDraws = await Draw.find({
      status: "published"
    }).sort({ year: -1, month: -1 }).limit(5);

    // Get user's tickets for active draw
    const tickets = await Ticket.find({
      user: user._id,
      draw: activeDraw._id
    });

    // We can also infer tickets from recent scores if they haven't been generated
    // For this prototype, we'll return user scores as visual representation of "score tickets"
    // and subscription stats for "subscription tickets"
    
    // Check if user is subscribed to give them the standard 10 tickets per month
    const isSubscribed = user.subscriptionStatus === "active";

    return NextResponse.json({ 
      activeDraw,
      pastDraws,
      tickets,
      scores: user.scores || [],
      isSubscribed
    });
  } catch (error) {
    console.error("GET /api/draws error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
