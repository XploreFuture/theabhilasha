// routes/razorpay.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import protect from "../middlewares/authMiddleware.js";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import QRCode from "qrcode"; 
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateTicketId } from "../utils/generateTicketId.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router = express.Router();

// IMPORTANT: use server-side env var names (do NOT use VITE_ here)
const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify payment + book ticket + decrement availability (atomically)
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
        ticketType,
      category,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !eventId || !ticketType) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const secret = process.env.VITE_RAZORPAY_KEY_SECRET;
    const expectedSign = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Check if tickets are available
    if ((ticketType === "participant" && event.participantTickets <= 0) ||
        (ticketType === "audience" && event.audienceTickets <= 0)) {
      return res.status(400).json({ success: false, message: "Tickets sold out" });
    }

    // Decrement ticket
    if (ticketType === "participant") event.participantTickets -= 1;
    else event.audienceTickets -= 1;

    await event.save();

    const newTicketId = await generateTicketId();

    // Create Ticket
    const ticket = await Ticket.create({
      userId: req.user.id,
      eventId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      ticketType,
      amount: ticketType === "participant" ? event.participationFee : event.audienceFee,
        status: "booked",
      ...(ticketType === "participant" && category ? { category } : {}),
      ticketId: newTicketId,
    });
    

    res.json({ success: true, ticket, event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});


// Generate on-demand ticket PDF (by paymentId)
// --- FIX: Import modules for ES Modules environment --
router.get("/ticket/:paymentId", protect, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const ticket = await Ticket.findOne({ paymentId }).populate([
      { path: "eventId", select: "title date location time" },
      { path: "userId", select: "username email fullName" },
    ]);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const doc = new PDFDocument({ margin: 40 });
    const filename = `ticket_${ticket.paymentId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    doc.pipe(res);

    // --- Add background image ---
    const backgroundImagePath = path.join(__dirname, "../public/ticket.png"); 
    if (fs.existsSync(backgroundImagePath)) {
          doc.image(backgroundImagePath, 0, 0, { width: doc.page.width, height: doc.page.height });
        } else {
          const gradient = doc.linearGradient(0, 0, doc.page.width, doc.page.height);
          gradient.stop(0, '#E0F2FE').stop(1, '#F8FAFC');
          doc.rect(0, 0, doc.page.width, doc.page.height).fill(gradient);
        }

    // --- Central Content Box ---
    const contentBoxX = 50;
    const contentBoxWidth = doc.page.width - 100;
    const contentBoxY = 150;
    const contentBoxHeight = doc.page.height - 250;


    // ---------------- Header ----------------
    let currentY = contentBoxY + 30; // Start inside the box

    const logoPath = path.join(__dirname, "../assets/Abhilashaa.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, (doc.page.width - 80) / 2, currentY, { width: 80, height: 80 });
      doc.fillColor('white')
         .fontSize(26)
         .text("The Abhilashaa", 0, currentY + 90, { align: 'center' });
      currentY += 120;
    } else {
      doc.fillColor("white").fontSize(20).text("🎟️ Event Ticket", { align: "center" });
      currentY = doc.y + 20;
    }
    
    doc.moveTo(contentBoxX + 20, currentY).lineTo(doc.page.width - 70, currentY)
       .lineWidth(1).strokeColor('lightgrey').stroke();
    currentY += 20;

    // Helper function to draw text blocks (left-aligned)
    const drawTextBlock = (doc, label, value, y, x, labelColor, valueColor, fontSize) => {
        doc.fillColor(labelColor).fontSize(fontSize).text(label + ": ", x, y, { continued: true });
        doc.fillColor(valueColor).text(value);
        return doc.y;
    };
    
    // --- Two-Column Layout ---
    const columnPadding = 20;
    const detailsColumnX = contentBoxX + columnPadding;

    let detailsY = currentY;
    const qrY = currentY;

    // ---------------- All Details (Left Column) ----------------
    detailsY = drawTextBlock(doc, `Event`, `${ticket.eventId?.title ?? "Unknown Event"}`, detailsY, detailsColumnX, 'white', 'lightblue', 14);
    if (ticket.eventId?.date) detailsY = drawTextBlock(doc, `Date`, `${new Date(ticket.eventId.date).toLocaleString()}`, detailsY, detailsColumnX, 'white', 'white', 14);
    if (ticket.eventId?.location) detailsY = drawTextBlock(doc, `Location`, `${ticket.eventId.location}`, detailsY, detailsColumnX, 'white', 'white', 14);
    if (ticket.eventId?.time) detailsY = drawTextBlock(doc, `Time`, `${ticket.eventId.time}`, detailsY, detailsColumnX, 'white', 'white', 14);
    
    detailsY += 10;

    detailsY = drawTextBlock(doc, `Name`, `${ticket.userId.fullName ?? ticket.userId.username}`, detailsY, detailsColumnX, 'white', 'white', 14);
    detailsY = drawTextBlock(doc, `Type`, `${ticket.ticketType}`, detailsY, detailsColumnX, 'white', 'white', 14);
    if (ticket.ticketType === "participant" && ticket.category) {
      detailsY = drawTextBlock(doc, `Category`, `${ticket.category}`, detailsY, detailsColumnX, 'white', 'white', 14);
    }
    detailsY = drawTextBlock(doc, `Amount`, `₹${ticket.amount}`, detailsY, detailsColumnX, 'white', 'white', 14);
    detailsY = drawTextBlock(doc, `Ticket ID`, `${ticket.ticketId}`, detailsY, detailsColumnX, 'white', 'white', 14);

    detailsY += 10;

    detailsY = drawTextBlock(doc, `Booked On`, `${new Date(ticket.createdAt).toLocaleString()}`, detailsY, detailsColumnX, 'white', 'white', 14);
    
    // ---------------- QR Code (Right Column) ----------------
    const qrData = ticket.ticketId;
    const qrImageBuffer = await QRCode.toBuffer(qrData, { type: "png", width: 150 });
    const qrX = doc.page.width - 150 - 70;
    
    doc.fillColor('white').rect(qrX - 10, qrY - 10, 170, 170).fill();
    doc.image(qrImageBuffer, qrX, qrY, { width: 150 });
    doc.y = Math.max(detailsY, qrY + 170) + 10; // Adjust doc.y to the lowest point of the two columns

    // ---------------- Footer ----------------
    doc.fillColor("white")
      .fontSize(14)
      .text("✅ Please present this ticket at entry.", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("PDF download error:", err);
    res.status(500).json({ message: "Failed to generate ticket PDF" });
  }
});

export default router;
