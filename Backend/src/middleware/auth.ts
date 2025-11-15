import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token = null;
    console.log("Auth Token:", req.cookies.token);
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const authorize = (role: "admin" | "user") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userRole = req.user.role;

    // Admin-only access
    if (role === "admin" && userRole !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    // User-level access (user OR admin)
    if (role === "user" && !["user", "admin"].includes(userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
};