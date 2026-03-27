import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Charity from "@/lib/models/charity";
import User from "@/lib/models/user";

async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  await connectToDatabase();
  const adminUser = await User.findOne({ clerkId: userId });
  return adminUser?.role === "admin";
}

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  
  await connectToDatabase();
  const charities = await Charity.find().sort({ createdAt: -1 });
  return NextResponse.json({ charities });
}

export async function POST(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    await connectToDatabase();
    
    // Auto-generate slug if not provided securely
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    const newCharity = await Charity.create(body);
    return NextResponse.json({ success: true, charity: newCharity });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create charity" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    await connectToDatabase();

    const updatedCharity = await Charity.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, charity: updatedCharity });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update charity" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await connectToDatabase();
    await Charity.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete charity" }, { status: 500 });
  }
}
