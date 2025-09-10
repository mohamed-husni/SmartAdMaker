import express from "express";
import cors from "cors";
import multer from "multer";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow base64 image uploads

// Multer config (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Firebase Admin using env vars
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Upload route
app.post("/upload", upload.none(), async (req, res) => {
  try {
    const { imageBase64, userId, prompt } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image data" });

    const buffer = Buffer.from(imageBase64, "base64");
    const fileName = `${userId}/${Date.now()}.png`;
    const file = bucket.file(fileName);

    await file.save(buffer, { contentType: "image/png" });
    await file.makePublic(); // ❗ for testing only, later use signed URLs

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    res.json({ url: publicUrl, prompt });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
