import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true, index: { expires: 0 } },
  time: { type: String, required: true },
  location: { type: String },
  participationFee: { type: Number, default: 0 },
  audienceFee: { type: Number, default: 0 },
  participantTickets: { type: Number, required: true }, // total tickets
  audienceTickets: { type: Number, required: true },
  image: { type: String, default: "" },
   category: {
    type: String,
    enum: ["Open Mic", "Puppet Show"],
    default: "Open Mic",
    required: true,
  },
  // total tickets
  createdAt: { type: Date, default: Date.now },
});

export default model("Event", EventSchema);
