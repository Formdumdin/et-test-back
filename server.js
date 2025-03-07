const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));

// CORS (แก้ไขตรงนี้!)
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
    user: "sornwisetthanyapat@gmail.com",
    pass: "lnpm bjdx oklg zsoz",
  },
});

// Test route
app.get('/senttext', (req, res) => {
  res.json({ message: 'Hello from Render' });
});

// Route ส่งอีเมล
// API route to send email with attachment
app.post("/senttext", async (req, res) => {
  const { email, text, image } = req.body;

  try {
    // แปลงข้อมูล base64 เป็น Buffer
    const base64Image = image.split(";base64,").pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');

    await transporter.sendMail({
      from: "sornwisetthanyapat@gmail.com",
      to: email,
      subject: "ข้อความจากระบบพร้อมรูปภาพ",
      text: text || "ภาพที่คุณถ่ายไว้",
      attachments: [{
        filename: "captured-image.png",
        content: imageBuffer,
        contentType: "image/png"
      }]
    });

    res.status(200).send({ message: "ส่งอีเมลพร้อมรูปภาพสำเร็จ!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "เกิดข้อผิดพลาดในการส่งอีเมล" });
  }
});

// Start server
const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
