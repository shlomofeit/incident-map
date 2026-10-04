import "dotenv/config";
import jwt from "jsonwebtoken";

export function authenticate(role = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (role.length > 0 && !role.includes(req.user.role)) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      next();
    } catch {
      return res
        .status(401)
        .json({ success: false, error: "Invalid or expired token" });
    }
  };
}
