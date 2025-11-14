import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & Password required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("Register Error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & Password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // 🚀 Local-dev friendly cookie options
    res.cookie("token", token, {
      httpOnly: true,
      secure:  false,
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token
    });
  } catch (err: any) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};