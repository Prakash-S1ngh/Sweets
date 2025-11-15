import { Request, Response } from 'express';
import Sweet from '../models/Sweet';
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const createSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity, imageUrl, description } = req.body;
    console.log("Request body:", req.body);

    // Validate fields
    if (!name || !category || price == null) {
      return res.status(400).json({ message: "Name, category and price are required." });
    }

    // Extract userId from JWT token (BEST PRACTICE)
    let userId;

    const token = req.cookies.token;
    if (token) {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
      userId = decoded.id;
    } else {
      return res.status(401).json({ message: "Unauthorized — Token missing" });
    }

    // Create Sweet object
    const sweet = new Sweet({
      name,
      category,
      price,
      quantity: quantity || 0,
      imageUrl: imageUrl || "",
      description: description || "",
      userId,
    });


    await sweet.save();

    return res.status(201).json({
      success: true,
      sweet,
    });
  } catch (err: any) {
    console.error("Error creating sweet:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};


export const listSweets = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user.role;
    console.log("User role in listSweets:", req.user);

    // ADMIN → normal list
    if (role === "admin") {
      const sweets = await Sweet.find();
      return res.json({
        success: true,
        role: "admin",
        sweets
      });
    }

    // CUSTOMER / USER → grouped sweets + sweetIds array
    const sweets = await Sweet.aggregate([
      {
        $group: {
          _id: "$name",
          items: { $push: "$$ROOT" },
          sweetIds: { $push: "$_id" },
          totalQuantity: { $sum: "$quantity" },   // ✅ aggregate total quantity
          price: { $first: "$price" },            // optional - take first price
          imageUrl: { $first: "$imageUrl" },      // optional
          category: { $first: "$category" },      // optional
          description: { $first: "$description" } // optional
        }
      }
    ]);
    console.log("Grouped sweets:", sweets);

    return res.json({
      success: true,
      role: "customer",
      sweets
    });

  } catch (error: any) {
    console.error("Error in listSweets:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const searchSweets = async (req: Request, res: Response) => {
  const { name, category, minPrice, maxPrice } = req.query as any;
  const q: any = {};
  if (name) q.name = { $regex: name, $options: 'i' };
  if (category) q.category = category;
  if (minPrice || maxPrice) q.price = {};
  if (minPrice) q.price.$gte = Number(minPrice);
  if (maxPrice) q.price.$lte = Number(maxPrice);
  const sweets = await Sweet.find(q);
  res.json(sweets);
};

export const updateSweet = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Updating sweet with ID:", id);
  const data = req.body;
  const sweet = await Sweet.findByIdAndUpdate(id, data, { new: true });
  if (!sweet) return res.status(404).json({ message: 'Not found' });
  res.json(sweet);
};

export const deleteSweet = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Sweet.findByIdAndDelete(id);
  res.status(204).end();
};

export const purchaseSweet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const sweet = await Sweet.findById(id);
  if (!sweet) return res.status(404).json({ message: 'Not found' });
  if (sweet.quantity <= 0) return res.status(400).json({ message: 'Out of stock' });
  sweet.quantity -= 1;
  await sweet.save();
  res.json(sweet);
};

export const restockSweet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount } = req.body;
  const inc = Number(amount) || 1;
  const sweet = await Sweet.findById(id);
  if (!sweet) return res.status(404).json({ message: 'Not found' });
  sweet.quantity += inc;
  await sweet.save();
  res.json(sweet);
};
