import app from './src/app';
import connectDB, { seedAdmin } from './src/config/db.config';

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    await seedAdmin();
    app.listen(PORT, () => {
      console.log('\n=======================================');
      console.log(`  Sweet Shop Backend — Server running`);
      console.log(`  http://localhost:${PORT}`);
      console.log('=======================================\n');
    });
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
}

start();
