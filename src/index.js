import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import authRouter from "./routes/auth.routes.js";
import incidentRouter from "./routes/incidents.routes.js";
// import { authenticate } from "./middlewares/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// app.use("/api/auth", authRouter);

// app.use(authenticate());

// app.get("/api/users", (req, res) => {
//   res.json({
//     message: "Access granted for any authenticated user",
//     user: req.user,
//   });
// });

// app.get("/api/admin", authenticate(["admin"]), (req, res) => {
//   res.json({ message: "Admin access only", user: req.user });
// });

// app.delete("/api/users/:id", authenticate(["admin", "manager"]), (req, res) => {
//   res.json({ message: "User deleted by authorized staff" });
// });

app.use("/incidents", incidentRouter);
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
