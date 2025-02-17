import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import  AuthRequest  from "../types"; // Import the custom type

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header("Authorization")?.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token) {
    res.status(401).json({ message: "Access Denied: No token provided" });
    return;
  }

  if (!JWT_SECRET) {
    res.status(500).json({ message: "Server configuration error: JWT_SECRET is missing" });
    return;
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    // Fetch the user from the database
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Attach the user to the request object
    req.user = { id: user.id.toString(), role: user.role };
    next(); // Move to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
    return;
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Access Denied: Admins only" });
    return;
  }
  next();
};