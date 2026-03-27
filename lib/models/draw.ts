import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDraw extends Document {
  month: number;
  year: number;
  numbers: number[];
  drawType: "random" | "algorithmic";
  status: "pending" | "simulated" | "published";
  prizePool: number;
  jackpotCarryover: number;
  distribution: {
    fiveMatch: number;
    fourMatch: number;
    threeMatch: number;
  };
  winners: mongoose.Types.ObjectId[];
  totalParticipants: number;
  executedAt: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const DrawSchema = new Schema<IDraw>(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    numbers: {
      type: [Number],
      validate: {
        validator: (v: number[]) =>
          v.length === 5 && v.every((n) => n >= 1 && n <= 45),
        message: "Draw must contain exactly 5 numbers between 1 and 45",
      },
    },
    drawType: {
      type: String,
      enum: ["random", "algorithmic"],
      default: "random",
    },
    status: {
      type: String,
      enum: ["pending", "simulated", "published"],
      default: "pending",
    },
    prizePool: { type: Number, default: 0 },
    jackpotCarryover: { type: Number, default: 0 },
    distribution: {
      fiveMatch: { type: Number, default: 40 },
      fourMatch: { type: Number, default: 35 },
      threeMatch: { type: Number, default: 25 },
    },
    winners: [{ type: Schema.Types.ObjectId, ref: "Winner" }],
    totalParticipants: { type: Number, default: 0 },
    executedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

DrawSchema.index({ month: 1, year: 1 }, { unique: true });

const Draw: Model<IDraw> =
  mongoose.models.Draw || mongoose.model<IDraw>("Draw", DrawSchema);

export default Draw;
