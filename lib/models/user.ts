import mongoose, { Schema, Document, Model } from "mongoose";

export interface IScore {
  grossScore: number;
  handicap: number;
  courseRating: number;
  slopeRating: number;
  stablefordPoints: number;
  date: Date;
}

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: "user" | "admin";
  selectedCharity: mongoose.Types.ObjectId | null;
  charityPercentage: number;
  subscriptionStatus: "none" | "active" | "cancelled" | "lapsed";
  subscriptionPlan: "monthly" | "yearly" | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionExpiry: Date | null;
  scores: IScore[];
  onboardingComplete: boolean;
  isBanned: boolean;
  totalWinnings: number;
  totalDonated: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScoreSchema = new Schema<IScore>(
  {
    grossScore: { type: Number, required: true },
    handicap: { type: Number, required: true },
    courseRating: { type: Number, required: true },
    slopeRating: { type: Number, required: true },
    stablefordPoints: { type: Number, required: true },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    selectedCharity: {
      type: Schema.Types.ObjectId,
      ref: "Charity",
      default: null,
    },
    charityPercentage: { type: Number, default: 10, min: 10, max: 100 },
    subscriptionStatus: {
      type: String,
      enum: ["none", "active", "cancelled", "lapsed"],
      default: "none",
    },
    subscriptionPlan: {
      type: String,
      enum: ["monthly", "yearly", null],
      default: null,
    },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },
    subscriptionExpiry: { type: Date, default: null },
    scores: {
      type: [ScoreSchema],
      validate: {
        validator: (v: IScore[]) => v.length <= 5,
        message: "A user can have at most 5 scores",
      },
    },
    onboardingComplete: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    totalWinnings: { type: Number, default: 0 },
    totalDonated: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
