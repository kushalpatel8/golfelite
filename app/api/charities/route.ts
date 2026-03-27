import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Charity from "@/lib/models/charity";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured");

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    const charities = await Charity.find(query).sort({ featured: -1, totalContributions: -1 });

    return NextResponse.json({ charities });
  } catch (error) {
    console.error("GET /api/charities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
