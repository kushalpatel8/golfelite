import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITicket extends Document {
  user: mongoose.Types.ObjectId;
  draw: mongoose.Types.ObjectId;
  numbers: number[]; // Array of 5 numbers between 1 and 45
  source: "subscription" | "score";
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    draw: { type: Schema.Types.ObjectId, ref: "Draw", required: true, index: true },
    numbers: {
      type: [Number],
      required: true,
      validate: {
        validator: (v: number[]) =>
          v.length === 5 && v.every((n) => n >= 1 && n <= 45),
        message: "Ticket must contain exactly 5 numbers between 1 and 45",
      },
    },
    source: {
      type: String,
      enum: ["subscription", "score"],
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient querying
TicketSchema.index({ user: 1, draw: 1 });

const Ticket: Model<ITicket> =
  mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;
