const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));

// CORS
const corsOptions = {
  origin: "https://etpim-camera.netlify.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

// Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "woottikarnhon@pim.ac.th",
    pass: "dqrhbngwtvqqljwk",
  },
});

// Route GET พร้อม Log
app.get("/senttext", async (req, res) => {
  console.log(`[${new Date().toISOString()}] มีการเรียกใช้ GET /senttext`);
  res.status(200).json({ message: "helloworld" });
});

// Route POST ส่งอีเมล พร้อม Log แจ้งผลลัพธ์
app.post("/senttext", async (req, res) => {
  let { email, text, image } = req.body;

  if (!Array.isArray(email)) {
    email = [email];
  }

  try {
    const base64Image = image.split(";base64,").pop();
    const imageBuffer = Buffer.from(base64Image, "base64");

    await transporter.sendMail({
      from: "woottikarnhon@pim.ac.th",
      to: email,
      subject: "ข้อความจากระบบพร้อมรูปภาพ",
      text: text || "ภาพที่คุณถ่ายไว้",
      attachments: [
        {
          filename: "captured-image.png",
          content: imageBuffer,
          contentType: "image/png",
        },
      ],
    });

    console.log(
      `[${new Date().toISOString()}] ✅ ส่งอีเมลสำเร็จไปยัง: ${email.join(
        ", "
      )}`
    );
    res.status(200).send({ message: "ส่งอีเมลพร้อมรูปภาพสำเร็จ!" });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] ❌ ส่งอีเมลไม่สำเร็จ:`,
      error.message
    );
    res.status(500).send({ message: "เกิดข้อผิดพลาดในการส่งอีเมล" });
  }
});

// Start server
const PORT = 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
