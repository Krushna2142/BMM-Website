// backend/prisma/seed.ts
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
  await prisma.page.upsert({
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

  // ==========================================
  // ✅ NEW: Create About Page (Based on your document)
  // ==========================================
  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      slug: 'about',
      title: 'About BMM',
      status: 'PUBLISHED',
      sections: {
        create: [
          // 1. Hero Section
          {
            type: 'hero',
            order: 1,
            isVisible: true,
            props: {
              title: 'About Us',
              subtitleEnglish: 'Uniting the Marathi speaking community',
            },
          },
          // 2. Main Content Section
          {
            type: 'content',
            order: 2,
            isVisible: true,
            label: 'About BMM',
            props: {
              title: 'Bruhan Maharashtra Mandal of North America (BMM)',
              content: `Bruhan Maharashtra Mandal of North America (BMM) is the largest umbrella organization representing the Marathi-speaking community across the United States and Canada, with nearly sixty affiliated nonprofit Maharashtra Mandals. Outside of Maharashtra and India, BMM stands as the single largest organization in the world representing the global Marathi-speaking population.

BMM was established in 1981 in Chicago with the vision of bringing together Marathi-speaking communities across North America under a common platform and promoting the rich cultural heritage of Maharashtra. The organization was founded by Mrs. Jayashree Huprikar (1943-2023), Mr. Sharad Godbole (1930-2004), and Mr. Vishnu Vaidya (1935-2001), whose leadership laid the foundation for a vibrant and collaborative Marathi diaspora network.

For over four decades, BMM has served as a cultural, intellectual, and community bridge between Maharashtra and the global Marathi diaspora. By connecting Mandals across North America, BMM fosters collaboration, encourages cultural exchange, and supports initiatives that preserve and promote the Marathi language, arts, traditions, and community values.

Through its various programs, social initiatives, educational activities, and the biennial BMM Convention, the organization continues to strengthen community bonds and create opportunities for engagement among Marathi-speaking families across generations.

BMM also leads and supports a wide range of community initiatives designed to serve different age groups and interests. These include Marathi Shala for language education, Yuwa for youth engagement and leadership development, Uttarrang for senior community members, Samajrang for social impact initiatives, Reshimgathee for matrimonial networking, Gurupeeth for connecting Marathi academicians and scholars, B-Connect for business and professional networking, and programs focused on Meditation, Philosophy, and cultural learning.

Today, BMM remains committed to celebrating Maharashtra's rich cultural legacy while empowering the next generation of Marathi leaders, professionals, and community builders across North America. By nurturing connections between communities, institutions, and individuals, BMM strives to ensure that the Marathi identity continues to thrive globally while contributing positively to the broader society.`,
            },
          },
          // 3. Founders Section
          {
            type: 'founders',
            order: 3,
            isVisible: true,
            label: 'Our Founders',
            props: {
              title: 'The Visionaries Who Established BMM in 1981',
              founders: [
                {
                  name: 'Mrs. Jayashree Huprikar',
                  years: '1943 - 2023',
                  image: '/images/founders/jayashree-huprikar.jpg',
                },
                {
                  name: 'Mr. Sharad Godbole',
                  years: '1930 - 2004',
                  image: '/images/founders/sharad-godbole.jpg',
                },
                {
                  name: 'Mr. Vishnu Vaidya',
                  years: '1935 - 2001',
                  image: '/images/founders/vishnu-vaidya.jpg',
                },
              ],
            },
          },
          // 4. Vision, Mission, Values Section
          {
            type: 'vision_mission_values',
            order: 4,
            isVisible: true,
            label: 'Vision, Mission & Values',
            props: {
              vision: {
                title: "BMM's Vision",
                content: 'To serve as a vibrant global platform for the Marathi diaspora, fostering cultural pride, community service, and leadership while strengthening the bond between Maharashtra and Marathi communities worldwide.',
              },
              mission: {
                title: "BMM's Mission",
                content: 'To connect and empower the Marathi-speaking community across North America by promoting Marathi language, culture, heritage, and values through cultural, educational, social, and professional initiatives.',
              },
              values: {
                title: "BMM's Values",
                content: 'To uphold the values of community, cultural pride, inclusiveness, service, and collaboration, while strengthening connections among Marathi-speaking people across North America.',
              },
            },
          },
          // 5. Important Links Section
          {
            type: 'custom_section',
            order: 5,
            isVisible: true,
            label: 'BMM Resources & Links',
            props: {
              sectionName: 'Important Documents & Links',
              layout: 'grid',
              customFields: [
                { name: 'link1', label: 'BMM Constitution', type: 'url', value: '/bmm-constitution' },
                { name: 'link2', label: 'BMM Elections', type: 'url', value: '/bmm-elections' },
                { name: 'link3', label: 'BMM Presidents', type: 'url', value: '/bmm-presidents' },
                { name: 'link4', label: 'BMM Conventions', type: 'url', value: '/bmm-conventions' },
                { name: 'link5', label: 'Amended and Restated By-Laws', type: 'url', value: '/by-laws' },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('✅ Created About page with sections');

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