import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Winner from "@/lib/models/winner";
import User from "@/lib/models/user";
import Draw from "@/lib/models/draw"; // Needed for population

async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  await connectToDatabase();
  const adminUser = await User.findOne({ clerkId: userId });
  return adminUser?.role === "admin";
}

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await connectToDatabase();
    const winners = await Winner.find()
      .populate("userId", "firstName lastName email avatar clerkId")
      .populate("drawId", "month year prizePool")
      .sort({ createdAt: -1 });

    return NextResponse.json({ winners });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load winners" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id, action, notes } = await req.json();
    await connectToDatabase();

    const winner = await Winner.findById(id);
    if (!winner) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: any = {};
    if (notes !== undefined) updates.adminNotes = notes;

    if (action === "verify") {
      updates.verificationStatus = "approved";
      updates.verifiedAt = new Date();
    } else if (action === "reject") {
      updates.verificationStatus = "rejected";
      updates.verifiedAt = new Date();
    } else if (action === "mark_paid") {
      // Only pay if approved
      if (winner.verificationStatus !== "approved") {
        return NextResponse.json({ error: "Must be verified first" }, { status: 400 });
      }
      updates.paymentStatus = "paid";
      updates.paidAt = new Date();
      
      // Update User totalWinnings
      await User.findByIdAndUpdate(winner.userId, {
        $inc: { totalWinnings: winner.prizeAmount }
      });
    }

    const updated = await Winner.findByIdAndUpdate(id, updates, { new: true })
      .populate("userId", "firstName lastName email avatar clerkId")
      .populate("drawId", "month year prizePool");

    return NextResponse.json({ success: true, winner: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update winner" }, { status: 500 });
  }
}
