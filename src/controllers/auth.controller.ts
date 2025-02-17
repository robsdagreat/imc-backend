import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET as string;


export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    console.log("JWT_SECRET:", JWT_SECRET); // ✅ Debugging
    if (!JWT_SECRET) {
      res.status(500).json({ message: "JWT_SECRET is missing!" });
      return;
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: "1h",
      });
  
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };
  
