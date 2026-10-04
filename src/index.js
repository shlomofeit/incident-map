import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import authRouter from "./routes/auth.routes.js";
// import { authenticate } from "./middlewares/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

app.use((err, req, res, _next) => {
  console.error("Error caught in handler:", err);
  const status = err.status || 500;
  const message = status < 500 ? err.message : "Internal Server Error";
  res.status(status).json({ success: false, error: message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
