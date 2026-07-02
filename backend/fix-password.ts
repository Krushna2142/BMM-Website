// backend/fix-password.ts
import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env file!');
    process.exit(1);
  }

  // Prisma v7 requires the driver adapter
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const password = 'admin123';
  console.log('🔄 Generating real bcrypt hash for "admin123"...');
  const hash = await bcrypt.hash(password, 10);
  console.log('✅ Generated hash:', hash);

  console.log('🔄 Updating database...');
  await prisma.adminUser.update({
    where: { email: 'admin@bmm.com' },
    data: { passwordHash: hash },
  });
  
  console.log('🎉 Password updated successfully!');
  console.log('You can now log in with:');
  console.log('📧 Email: admin@bmm.com');
  console.log('🔑 Password: admin123');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});