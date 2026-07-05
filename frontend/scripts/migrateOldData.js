// frontend/scripts/migrateOldData.js
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bmm.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Read JSON files
const committeeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/committee-members.json'), 'utf8'));
const sliderData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/slider-images.json'), 'utf8'));
const initiativesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/initiatives.json'), 'utf8'));

async function login() {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  return data.access_token;
}

async function createSection(token, pageId, type, props, order) {
  const res = await fetch(`${API_BASE_URL}/api/pages/${pageId}/sections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      type,
      isVisible: true,
      props,
      order,
    }),
  });
  
  if (!res.ok) {
    const error = await res.text();
    console.error(`Failed to create ${type} section:`, error);
    return null;
  }
  
  return res.json();
}

async function migrateCommitteeMembers(token, pageId) {
  console.log('\n📋 Migrating Committee Members...');
  
  let order = 0;
  
  // Committee Section
  const mainCommittee = committeeData.sections.find(s => s.id === 'main-committee');
  if (mainCommittee) {
    const props = {
      members: mainCommittee.members.map(m => ({
        name: m.name,
        nameMarathi: m.nameMarathi,
        role: m.position,
        image: m.image,
      })),
    };
    await createSection(token, pageId, 'committee', props, order++);
    console.log('✅ Created Committee section');
  }
  
  // Executive Members Section
  const executiveCommittee = committeeData.sections.find(s => s.id === 'executive-committee');
  if (executiveCommittee) {
    const props = {
      members: executiveCommittee.members.map(m => ({
        name: m.name,
        nameMarathi: m.nameMarathi,
        role: m.position,
        image: m.image,
      })),
    };
    await createSection(token, pageId, 'executive_members', props, order++);
    console.log('✅ Created Executive Members section');
  }
  
  // Trustees Section
  const boardOfTrustees = committeeData.sections.find(s => s.id === 'board-of-trustees');
  if (boardOfTrustees) {
    const props = {
      trustees: boardOfTrustees.members.map(m => ({
        name: m.name,
        nameMarathi: m.nameMarathi,
        role: m.position,
        image: m.image,
      })),
    };
    await createSection(token, pageId, 'trustees', props, order++);
    console.log('✅ Created Trustees section');
  }
}

async function migrateImageSlider(token, pageId) {
  console.log('\n🖼️ Migrating Image Slider...');
  
  const props = {
    slides: sliderData.slides.map(s => ({
      image: s.src,
      title: s.alt,
      description: '',
    })),
  };
  
  await createSection(token, pageId, 'image_slider', props, 10);
  console.log('✅ Created Image Slider section');
}

async function migrateActionButtons(token, pageId) {
  console.log('\n🔗 Migrating Action Buttons...');
  
  const props = {
    buttons: initiativesData.actionButtons.map(btn => ({
      label: btn.label,
      url: btn.href,
      icon: '',
    })),
  };
  
  await createSection(token, pageId, 'action_buttons', props, 1);
  console.log('✅ Created Action Buttons section');
}

async function migrateSponsors(token, pageId) {
  console.log('\n💼 Migrating Sponsors...');
  
  // You'll need to manually add sponsors or create a sponsors.json file
  // For now, creating empty section
  const props = {
    sponsors: [
      { name: 'Avant', logo: '/images/sponsors/avant.png', url: 'https://avant.com' },
      { name: 'Clickontours', logo: '/images/sponsors/clickontours.png', url: 'https://clickontours.com' },
      { name: 'VSS Foundation', logo: '/images/sponsors/VSSF.png', url: 'https://vssfoundation.org' },
      { name: 'Avana Senior Care', logo: '/images/sponsors/avana.png', url: 'https://avanaseniorcare.com' },
      { name: 'MI Adventures', logo: '/images/sponsors/miadventures.png', url: 'https://miadventures.com' },
      { name: 'Chugh', logo: '/images/sponsors/chugh.png', url: 'https://chugh.com' },
    ],
  };
  
  await createSection(token, pageId, 'sponsors', props, 2);
  console.log('✅ Created Sponsors section');
}

async function main() {
  try {
    console.log('🚀 Starting data migration...\n');
    
    // Login
    const token = await login();
    console.log('✅ Logged in successfully');
    
    // Get Home Page ID
    const pagesRes = await fetch(`${API_BASE_URL}/api/pages`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const pages = await pagesRes.json();
    const homePage = pages.find(p => p.slug === 'home');
    
    if (!homePage) {
      console.error('❌ Home page not found!');
      return;
    }
    
    console.log(`📄 Found Home Page (ID: ${homePage.id})`);
    
    // Migrate all sections
    await migrateActionButtons(token, homePage.id);
    await migrateSponsors(token, homePage.id);
    await migrateCommitteeMembers(token, homePage.id);
    await migrateImageSlider(token, homePage.id);
    
    console.log('\n✅ Migration completed successfully!');
    console.log('🎉 All old data has been migrated to the CMS!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
  }
}

main();