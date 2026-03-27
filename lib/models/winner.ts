import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWinner extends Document {
  userId: mongoose.Types.ObjectId;
  drawId: mongoose.Types.ObjectId;
  matchType: 3 | 4 | 5;
  matchedNumbers: number[];
  prizeAmount: number;
  proofUrl: string | null;
  verificationStatus: "pending" | "approved" | "rejected";
  paymentStatus: "pending" | "paid";
  adminNotes: string;
  verifiedAt: Date | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const WinnerSchema = new Schema<IWinner>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    drawId: {
      type: Schema.Types.ObjectId,
      ref: "Draw",
      required: true,
      index: true,
    },
    matchType: {
      type: Number,
      enum: [3, 4, 5],
      required: true,
    },
    matchedNumbers: {
      type: [Number],
      required: true,
    },
    prizeAmount: { type: Number, required: true, default: 0 },
    proofUrl: { type: String, default: null },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    adminNotes: { type: String, default: "" },
    verifiedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Winner: Model<IWinner> =
  mongoose.models.Winner || mongoose.model<IWinner>("Winner", WinnerSchema);

export default Winner;
