import "./config/env"; // loads .env immediately

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";
// import emailRoutes from "./routes/email.routes"; // adjust path
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- CONNECT DB --------------------
connectDB();

// -------------------- SECURITY + PARSERS --------------------
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// -------------------- RATE LIMIT --------------------
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 mins
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    message: { success: false, message: "Too many requests" },
  })
);

// -------------------- CORS --------------------
// const allowedOrigins = [
//   process.env.ALLOWED_ORIGINS || "https://highway-delite-assignment-ten.vercel.app/"
 
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(cors({
  origin: "*",
  credentials: true
}));


// -------------------- HEALTH CHECK --------------------
app.get("/health", (req, res) =>
  res.json({ success: true, message: "Server running" })
);

// -------------------- ROUTES --------------------
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// app.use("/api/email", emailRoutes);

// -------------------- 404 --------------------
app.use("*", (req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// -------------------- ERROR HANDLER --------------------
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Server error:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
);

// -------------------- START SERVER --------------------
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
