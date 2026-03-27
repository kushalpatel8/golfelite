import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Draw from "@/lib/models/draw";
import User from "@/lib/models/user";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const adminUser = await User.findOne({ clerkId: userId });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const draws = await Draw.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ draws });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const adminUser = await User.findOne({ clerkId: userId });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    if (body.action === "simulate") {
      const isWeighted = body.algorithm === "weighted";
      const numbers = new Set<number>();
      
      while (numbers.size < 5) {
        if (isWeighted) {
          // Weighted: Higher likelihood of selecting numbers 1-20
          const weightedNum = Math.random() < 0.7 
            ? Math.floor(Math.random() * 20) + 1 
            : Math.floor(Math.random() * 30) + 21;
          numbers.add(weightedNum);
        } else {
          // Standard True Random 1-50
          numbers.add(Math.floor(Math.random() * 50) + 1);
        }
      }
      
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const newDraw = await Draw.create({
          month,
          year,
          prizePool: 5000, 
        status: "pending", 
        numbers: Array.from(numbers),
      });

      return NextResponse.json({ success: true, draw: newDraw });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const adminUser = await User.findOne({ clerkId: userId });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, action } = await req.json();

    if (action === "publish") {
      // First, close all other active draws
      await Draw.updateMany({ status: "active" }, { status: "completed" });
      
      // Publish the specific simulated draw
      const updatedDraw = await Draw.findByIdAndUpdate(id, { status: "active" }, { new: true });
      return NextResponse.json({ success: true, draw: updatedDraw });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
