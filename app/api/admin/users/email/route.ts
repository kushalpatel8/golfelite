import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import User from "@/lib/models/user";
import { connectToDatabase } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const adminUser = await User.findOne({ clerkId: userId });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { targetEmail, subject, message } = await req.json();

    if (!targetEmail || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: "GolfElite Admin <onboarding@resend.dev>",
      to: [targetEmail],
      subject: subject,
      html: `<div style="font-family: sans-serif; color: #333;">
              <h2 style="color: #d4af37;">Message from GolfElite Admin</h2>
              <p>${message.replace(/\n/g, '<br/>')}</p>
              <br/>
              <p style="font-size: 12px; color: #888;">This is an automated message from the GolfElite Platform.</p>
             </div>`,
    });

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
