import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bmm_cms';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding BMM CMS database...');

  // Create Admin User
  const passwordHash = await bcrypt.hash('admin123', BCRYPT_SALT_ROUNDS);
  await prisma.adminUser.upsert({
    where: { email: 'admin@bmm.com' },
    update: { passwordHash },
    create: {
      email: 'admin@bmm.com',
      name: 'Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Created admin user');

  // Create Home Page
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Home',
      status: 'PUBLISHED',
      sections: {
        create: [
          {
            type: 'hero',
            order: 1,
            isVisible: true,
            props: {
              backgroundImage: '/images/hero-bg.jpg',
              title: 'Welcome to Bruhan Maharashtra Mandal of North America (BMM)',
              subtitleMarathi: '|| मराठी तितुका मेळवावा ||',
              subtitleEnglish: 'Uniting the Marathi speaking community',
              buttons: [
                { label: 'Learn More', link: '/about', variant: 'primary' },
                { label: 'Get Involved', link: '/contact', variant: 'secondary' },
              ],
            },
          },
          {
            type: 'action_buttons',
            order: 2,
            isVisible: true,
            props: {
              buttons: [
                { label: 'BMM 2026 Seattle', link: '/events/seattle-2026', color: 'orange' },
                { label: 'Visiting India? BMM BVG offers!', link: '/offers/bvg', color: 'red' },
                { label: 'BMM 2026 Elections', link: '/elections/2026', color: 'orange' },
              ],
            },
          },
          {
            type: 'sponsors',
            order: 3,
            isVisible: true,
            props: {
              title: 'Our Partners & Sponsors',
              subtitle: 'Trusted organizations supporting the Marathi community',
              sponsors: [
                { name: 'Avant', image: '/sponsors/avant.png', link: 'https://avant.com' },
                { name: 'ClickOnTours', image: '/sponsors/clickontours.png', link: 'https://clickontours.com' },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('✅ Created Home page with sections');

  // Create Initiatives Page
  await prisma.page.upsert({
    where: { slug: 'initiatives' },
    update: {},
    create: {
      slug: 'initiatives',
      title: 'BMM Initiatives',
      status: 'PUBLISHED',
      sections: {
        create: [
          {
            type: 'hero',
            order: 1,
            isVisible: true,
            props: {
              backgroundImage: '/images/initiatives-hero.jpg',
              title: 'BMM Initiatives',
              subtitleEnglish: 'Serving the Marathi Community',
              buttons: [],
            },
          },
        ],
      },
    },
  });
  console.log('✅ Created Initiatives page');

  console.log('🎉 Seeding completed!');
  console.log('\n Login credentials:');
  console.log('Email: admin@bmm.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });