// models/Ticket.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  orderId: { type: String, required: true },       // Razorpay order_id
  paymentId: { type: String, required: true },     // Razorpay payment_id
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
  
  // ✅ New fields
  amount: { type: Number, required: true },        // Amount paid
  ticketType: { type: String, enum: ["participant", "audience"], required: true },
  ticketId: { type: String, unique: true },
  qrCode: { type: String }, 

  category: { 
    type: String, 
    enum: ["song", "story", "shayari", "poem"], 
    required: function() { return this.ticketType === "participant"; } // required only for participants
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", ticketSchema);
