import dotenv from 'dotenv';
import util from 'util';

import app from './app';
import { connectDB, seedAdmin } from './config/db.config';

dotenv.config();

const PORT = Number(process.env.PORT || 4000);

// Handle multiple resolve issues
// process.on('multipleResolves', (type, promise, reason) => {
//   console.warn('Multiple resolves detected:', { 
//     type, 
//     reason: util.inspect(reason, { depth: null }) 
//   });
// });

async function start() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await seedAdmin();

    app.listen(PORT, () => {
      console.log('\n==========================================');
      console.log('     Sweet Shop Backend — Server Running  ');
      console.log(`     http://localhost:${PORT}`);
      console.log('==========================================\n');
    });
  } catch (err) {
    if (err && (err as any).stack) {
      console.error('Startup error (stack):', (err as any).stack);
    } else {
      console.error('Startup error:', util.inspect(err, { depth: null }));
    }
    process.exit(1);
  }
}

start();