import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICharityEvent {
  title: string;
  date: Date;
  description: string;
  location: string;
}

export interface ICharity extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  logo: string;
  featured: boolean;
  category: string;
  website: string;
  events: ICharityEvent[];
  totalContributions: number;
  totalDonors: number;
  createdAt: Date;
  updatedAt: Date;
}

const CharityEventSchema = new Schema<ICharityEvent>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, default: "" },
  location: { type: String, default: "" },
});

const CharitySchema = new Schema<ICharity>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    images: [{ type: String }],
    logo: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    category: { type: String, default: "General" },
    website: { type: String, default: "" },
    events: [CharityEventSchema],
    totalContributions: { type: Number, default: 0 },
    totalDonors: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Charity: Model<ICharity> =
  mongoose.models.Charity ||
  mongoose.model<ICharity>("Charity", CharitySchema);

export default Charity;
