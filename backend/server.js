import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import userRoute from './routes/users.js';
import razorpayRoutes from "./routes/razorpay.js";
import eventRoute from "./routes/eventRoutes.js";
import profile from "./routes/profile.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import contentRoute from "./routes/contentRoutes.js";
import cron from "node-cron";
import Event from "./models/Event.js";
import Gallery from './routes/galleryRoute.js';







dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/profile", profile)
app.use("/api/payment", razorpayRoutes);
app.use("/api/events", eventRoute);
app.use("/api/tickets", ticketRoutes);
app.use("/api/content", contentRoute);
app.use("/api/gallery",Gallery);




app.get('/', (req, res) => {
    res.send('API is running...');
});

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(5000, () => {});
    } catch (error) {
        process.exit(1);
    }
};
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  await Event.deleteMany({ date: { $lt: now } });
  console.log("Expired events deleted at midnight");
});
startServer();