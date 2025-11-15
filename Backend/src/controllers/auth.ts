import { Request, Response } from "express";
import User from "../models/User";
import Cart from "../models/Cart";
import Sweet from "../models/Sweet";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth";

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
    console.log(email, password);

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
      sameSite: "lax",
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

export const fetchuserController = async (req: Request, res: Response) => {
  try {
    // const userId = (req as any).user.id;
    const {id } = req.user;
    const userId = id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err: any) {
    console.error("Fetch User Error:", err.message);        
  }
}

export const logoutController = (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: false
  });

  return res.json({ success: true, message: "Logged out successfully" });
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, quantity } = req.body;

    if (!name || !quantity) {
      return res.status(400).json({ message: "Name and quantity required" });
    }

    // Find a sweet with same name and available stock
    const sweet = await Sweet.findOne({
      name: { $regex: name, $options: "i" },
      quantity: { $gte: quantity }
    }).sort({ quantity: -1 });

    if (!sweet) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const sweetId = sweet._id;
    const price = sweet.price;

    // Reduce stock IMMEDIATELY
    sweet.quantity -= quantity;
    await sweet.save();

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ sweetId, quantity, price }]
      });
    } else {
      const idx = cart.items.findIndex(
        (item: any) => item.sweetId.toString() === sweetId.toString()
      );

      if (idx > -1) {
        cart.items[idx].quantity += quantity;
      } else {
        cart.items.push({ sweetId, quantity, price });
      }
    }

    await cart.save();

    return res.json({
      success: true,
      message: "Item added to cart & stock reduced",
      cart
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { sweetId, newQuantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex(
      (item: any) => item.sweetId.toString() === sweetId
    );
    if (idx === -1) return res.status(404).json({ message: "Item not in cart" });

    const oldQuantity = cart.items[idx].quantity;

    const sweet = await Sweet.findById(sweetId);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    // ================================
    // CASE 1: newQuantity === 0 → DELETE ITEM
    // ================================
    if (newQuantity === 0) {
      // restore stock fully
      sweet.quantity += oldQuantity;
      await sweet.save();

      // remove item from cart
      cart.items.splice(idx, 1);
      await cart.save();

      return res.json({
        success: true,
        message: "Item removed from cart & stock restored",
        cart
      });
    }

    // ================================
    // CASE 2: update quantity
    // ================================

    const difference = newQuantity - oldQuantity;

    // If user increases quantity → reduce stock
    if (difference > 0) {
      if (sweet.quantity < difference) {
        return res.status(400).json({ message: "Not enough stock" });
      }
      sweet.quantity -= difference;
    }

    // If user decreases quantity → restore stock
    if (difference < 0) {
      sweet.quantity += Math.abs(difference);
    }

    await sweet.save();

    // Update cart item quantity
    cart.items[idx].quantity = newQuantity;
    await cart.save();

    return res.json({
      success: true,
      message: "Cart updated & stock adjusted",
      cart
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.sweetId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.json({
      success: true,
      cart
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

