import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/user";

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

    const scores = [...user.scores].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ scores });
  } catch (error) {
    console.error("GET /api/scores error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { stablefordPoints, grossScore, handicap, courseRating, slopeRating, date } = body;

    if (!stablefordPoints || !date) {
      return NextResponse.json(
        { error: "Stableford points and date are required" },
        { status: 400 }
      );
    }

    if (stablefordPoints < 1 || stablefordPoints > 45) {
      return NextResponse.json(
        { error: "Stableford points must be between 1 and 45" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.scores.push({
      stablefordPoints,
      grossScore: grossScore || 0,
      handicap: handicap || 0,
      courseRating: courseRating || 0,
      slopeRating: slopeRating || 0,
      date: new Date(date)
    });

    user.scores.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (user.scores.length > 5) {
      user.scores = user.scores.slice(0, 5);
    }

    await user.save();

    return NextResponse.json({ scores: user.scores });
  } catch (error) {
    console.error("POST /api/scores error:", error);
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
    const { scoreId, stablefordPoints, grossScore, handicap, courseRating, slopeRating, date } = body;

    if (!scoreId || !stablefordPoints || !date) {
      return NextResponse.json(
        { error: "Score ID, stableford points, and date are required" },
        { status: 400 }
      );
    }

    if (stablefordPoints < 1 || stablefordPoints > 45) {
      return NextResponse.json(
        { error: "Stableford points must be between 1 and 45" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOneAndUpdate(
      { clerkId: userId, "scores._id": scoreId },
      {
        $set: {
          "scores.$.stablefordPoints": stablefordPoints,
          "scores.$.grossScore": grossScore || 0,
          "scores.$.handicap": handicap || 0,
          "scores.$.courseRating": courseRating || 0,
          "scores.$.slopeRating": slopeRating || 0,
          "scores.$.date": new Date(date),
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    return NextResponse.json({ scores: user.scores });
  } catch (error) {
    console.error("PUT /api/scores error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const scoreId = searchParams.get("id");

    if (!scoreId) {
      return NextResponse.json(
        { error: "Score ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { scores: { _id: scoreId } } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ scores: user.scores });
  } catch (error) {
    console.error("DELETE /api/scores error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
