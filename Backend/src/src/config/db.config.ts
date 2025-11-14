import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';

export async function connectDB(mongoUri?: string) {
	const uri = mongoUri || process.env.MONGO_URI || 'mongodb://localhost:27017/sweets_dev';
	await mongoose.connect(uri);
}

export async function seedAdmin() {
	try {
		const adminEmail = process.env.ADMIN_EMAIL;
		const adminPassword = process.env.ADMIN_PASSWORD;
		if (!adminEmail || !adminPassword) return;

		const existing = await User.findOne({ email: adminEmail });
		if (existing) return;

		const hashed = await bcrypt.hash(adminPassword, 10);
		const admin = new User({ email: adminEmail, password: hashed, role: 'admin' });
		await admin.save();
		console.log('Admin user created:', adminEmail);
	} catch (err) {
		console.error('Admin seeding failed', err);
	}
}

export default connectDB;
