// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import { initializeApp, cert } from "firebase-admin/app";
// import { getStorage } from "firebase-admin/storage";
// import { v4 as uuidv4 } from "uuid";
// import fs from "fs";

// // Load Firebase Admin credentials
// const serviceAccount = JSON.parse(
//   fs.readFileSync("../serviceAccountKey.json", "utf8")
// );

// initializeApp({
//   credential: cert(serviceAccount),
//   storageBucket: "ai-app-7f653.appspot.com",
// });

// const app = express();
// const upload = multer({ storage: multer.memoryStorage() });
// const bucket = getStorage().bucket();

// app.use(cors());
// app.use(express.json());

// // Upload route
// app.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).send("No image provided");

//     const fileName = `users/${req.body.uid}/${Date.now()}-${uuidv4()}.png`;
//     const file = bucket.file(fileName);

//     await file.save(req.file.buffer, {
//       metadata: { contentType: req.file.mimetype },
//     });

//     // Get public download URL
//     const [url] = await file.getSignedUrl({
//       action: "read",
//       expires: "03-01-2030",
//     });

//     res.json({ downloadURL: url, fileName });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     res.status(500).send("Upload failed");
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
