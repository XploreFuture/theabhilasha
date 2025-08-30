// routes/ticketRoutes.js
import express from "express";
import Ticket from "../models/Ticket.js";
import protect from "../middlewares/authMiddleware.js";
import Event from "../models/Event.js";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from 'path';
import fs from "fs";
const router = express.Router();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------------------- Get all tickets of logged-in user -------------------
router.get("/my-tickets", protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate("eventId", "title date location participationFee audienceFee")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets", error });
  }
});

// ------------------- Download PDF ticket -------------------
// ------------------- Download PDF ticket with QR code -------------------
// --- Import modules for ES Modules environment ---

// --- Import modules for ES Modules environment ---

router.get("/ticket/:paymentId", protect, async (req, res) => {
  try {
    const { paymentId } = req.params;

    // 1️⃣ Find ticket
    const ticket = await Ticket.findOne({ paymentId })
      .populate("eventId", "title date location participationFee audienceFee");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // 2️⃣ Check ownership
    if (ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 3️⃣ Generate QR Code (based on ticketId)
    const qrData = `Ticket ID: ${ticket.ticketId}\nEvent: ${ticket.eventId?.title}\nUser: ${req.user.username}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrData);
    const qrCodeBase64 = qrCodeDataURL.split(",")[1];
    const qrCodeBuffer = Buffer.from(qrCodeBase64, "base64");

    // 4️⃣ Generate PDF
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ticket_${ticket.ticketId}.pdf`
    );

    doc.pipe(res);

    // --- Add background and borders ---
    const backgroundImagePath = path.join(__dirname, "../public/ticket.png");

    if (fs.existsSync(backgroundImagePath)) {
      doc.image(backgroundImagePath, 0, 0, { width: doc.page.width, height: doc.page.height });
      // Removed the opacity and black overlay as requested.
    } else {
      const gradient = doc.linearGradient(0, 0, doc.page.width, doc.page.height);
      gradient.stop(0, '#E0F2FE').stop(1, '#F8FAFC');
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(gradient);
    }
    
    // --- Central Content Box to hold all details ---
    const contentBoxX = 50;
    const contentBoxWidth = doc.page.width - 100;
    const contentBoxY = 150;
    const contentBoxHeight = doc.page.height - 250;

    
    // ---------------- Header and Logo ----------------
    let currentY = contentBoxY + 30;

    
    
    doc.moveTo(contentBoxX + 20, currentY).lineTo(doc.page.width - 70, currentY)
       .lineWidth(1).strokeColor('lightgrey').stroke();
    currentY += 20;

    // Helper function to draw text blocks
    const drawTextBlock = (doc, label, value, y, x, labelColor, valueColor, fontSize) => {
        doc.fillColor(labelColor).fontSize(fontSize).text(label + ": ", x, y, { continued: true });
        doc.fillColor(valueColor).text(value);
        return doc.y;
    };
    
    // --- Two-Column Layout ---
    const columnPadding = 20;
    const detailsColumnX = contentBoxX + columnPadding;
    const qrColumnX = contentBoxX + contentBoxWidth / 2 + columnPadding;

    let detailsY = currentY;

    // ---------------- All Details (Left Column) ----------------
    detailsY = drawTextBlock(doc, `Event`, `${ticket.eventId?.title || "Unknown Event"}`, detailsY, detailsColumnX, 'white', 'lightblue', 14);
    detailsY = drawTextBlock(doc, `Ticket Type`, `${ticket.ticketType}`, detailsY, detailsColumnX, 'white', 'gold', 14);
    detailsY = drawTextBlock(doc, `Amount Paid`, `₹${ticket.amount}`, detailsY, detailsColumnX, 'white', 'palegreen', 14);
    detailsY = drawTextBlock(doc, `Username`, `${req.user.username}`, detailsY, detailsColumnX, 'white', 'lavender', 14);
    detailsY = drawTextBlock(doc, `Email`, `${req.user.email}`, detailsY, detailsColumnX, 'white', 'lavender', 14);
    detailsY = drawTextBlock(doc, `Ticket ID`, `${ticket.ticketId}`, detailsY, detailsColumnX, 'white', 'darkgrey', 14);
    detailsY = drawTextBlock(doc, `Payment ID`, `${ticket.paymentId}`, detailsY, detailsColumnX, 'white', 'darkgrey', 14);
    detailsY = drawTextBlock(doc, `Order ID`, `${ticket.orderId}`, detailsY, detailsColumnX, 'white', 'darkgrey', 14);
    detailsY = drawTextBlock(doc, `Status`, `${ticket.status}`, detailsY, detailsColumnX, 'white', 'lime', 14);
    detailsY = drawTextBlock(doc, `Event Date`, `${ticket.eventId?.date?.toDateString() || "N/A"}`, detailsY, detailsColumnX, 'white', 'peachpuff', 14);
    detailsY = drawTextBlock(doc, `Event Location`, `${ticket.eventId?.location || "N/A"}`, detailsY, detailsColumnX, 'white', 'peachpuff', 14);

    // ---------------- QR Code (Right Column) ----------------
    // Calculate the QR code position to align it with the details block
    const qrSize = 150;
    const qrX = doc.page.width - 150 - 70; // Position on the right side
    const qrY = currentY + 10;
    
    // Add white background for readability
    doc.fillColor('white').rect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20).fill();
    doc.image(qrCodeBuffer, qrX, qrY, { width: qrSize, height: qrSize });
    
    // --- Footer ---
    doc.fillColor("white")
      .fontSize(14)
      .text("✅ Please present this ticket at entry.", 0, contentBoxY + contentBoxHeight + 50, { align: "center" });

    doc.end();
  } catch (err) {
    console.error("PDF download error:", err);
    res.status(500).json({ message: "Failed to generate ticket PDF" });
  }
});
// Get ticket details (JSON) - (NO CHANGE)
router.get("/ticket/:paymentId/details", protect, async (req, res) => {
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
    res.json(ticket);
  } catch (err) {
    console.error("Fetch ticket details error:", err);
    res.status(500).json({ message: "Failed to fetch ticket details" });
  }
});
export default router;
