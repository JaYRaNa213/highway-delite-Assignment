// import express from "express";
// import { sendTransactionalEmail } from "../services/mail.service";

// const router = express.Router();

// // 🚀 Test email route
// router.post("/test-email", async (req, res) => {
//   try {
//     const { toEmail } = req.body;

//     if (!toEmail) {
//       return res.status(400).json({ success: false, message: "toEmail is required" });
//     }

//     const result = await sendTransactionalEmail({
//       toEmail,
//       subject: "🚀 Test Email from Highway Delite",
//       htmlContent: "<h1>Hello!</h1><p>This is a test email from Highway Delite backend.</p>",
//       textContent: "Hello! This is a test email from Highway Delite backend.",
//     });

//     if (result.success) {
//       return res.json({ success: true, message: "✅ Email sent successfully", data: result.data });
//     } else {
//       return res.status(500).json({ success: false, message: "❌ Failed to send email", error: result.error });
//     }
//   } catch (err) {
//     console.error("❌ API Error:", err);
//     // ✅ FIX: return a response for the catch block
//     return res.status(500).json({ success: false, message: "Internal server error", error: err });
//   }
// });

// export default router;
