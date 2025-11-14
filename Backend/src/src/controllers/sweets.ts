import { Request, Response } from 'express';
import Sweet from '../models/Sweet';

export const listSweets = async (req: Request, res: Response) => {
  const sweets = await Sweet.find();
  res.json(sweets);
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

export const createSweet = async (req: Request, res: Response) => {
  const { name, category, price, quantity } = req.body;
  if (!name || !category || price == null) return res.status(400).json({ message: 'Missing fields' });
  const sweet = new Sweet({ name, category, price, quantity: quantity || 0 });
  await sweet.save();
  res.status(201).json(sweet);
};

export const updateSweet = async (req: Request, res: Response) => {
  const { id } = req.params;
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
