const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bmm.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Read initiatives data
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

async function createPage(token, title, slug) {
  const res = await fetch(`${API_BASE_URL}/api/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      slug,
      isPublished: true,
    }),
  });
  
  if (!res.ok) {
    const error = await res.text();
    console.error('Failed to create page:', error);
    return null;
  }
  
  return res.json();
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

async function main() {
  try {
    console.log('🚀 Starting initiatives migration...\n');
    
    const token = await login();
    console.log('✅ Logged in successfully');
    
    // Check if initiatives page exists
    const pagesRes = await fetch(`${API_BASE_URL}/api/pages`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const pages = await pagesRes.json();
    let initiativesPage = pages.find(p => p.slug === 'initiatives');
    
    if (!initiativesPage) {
      console.log('📄 Creating initiatives page...');
      initiativesPage = await createPage(token, 'BMM Initiatives', 'initiatives');
      if (!initiativesPage) {
        console.error('❌ Failed to create initiatives page');
        return;
      }
      console.log('✅ Created initiatives page');
    } else {
      console.log(`📄 Found existing initiatives page (ID: ${initiativesPage.id})`);
    }
    
    let order = 0;
    
    // Hero section
    console.log('\n📋 Creating hero section...');
    await createSection(token, initiativesPage.id, 'hero', {
      title: initiativesData.page.title,
      descriptionEn: initiativesData.page.descriptionEn,
      descriptionMr: initiativesData.page.descriptionMr,
    }, order++);
    console.log('✅ Created hero section');
    
    // Top action buttons
    console.log('\n🔗 Creating top action buttons...');
    await createSection(token, initiativesPage.id, 'top_action_buttons', {
      buttons: initiativesData.actionButtons.map(btn => ({
        label: btn.label,
        href: btn.href,
        variant: btn.variant,
      })),
    }, order++);
    console.log('✅ Created top action buttons');
    
    // Initiatives list
    console.log('\n📋 Creating initiatives list...');
    await createSection(token, initiativesPage.id, 'initiatives_list', {
      initiatives: initiativesData.initiatives.map(init => ({
        nameMr: init.nameMr,
        nameEn: init.nameEn,
        subtitle: init.subtitle || '',
        href: init.href,
      })),
    }, order++);
    console.log('✅ Created initiatives list');
    
    // Bottom buttons
    console.log('\n🔗 Creating bottom buttons...');
    await createSection(token, initiativesPage.id, 'bottom_action_buttons', {
      buttons: initiativesData.bottomButtons.map(btn => ({
        label: btn.label,
        href: btn.href,
        variant: btn.variant,
      })),
    }, order++);
    console.log('✅ Created bottom buttons');
    
    // Volunteer award
    console.log('\n🏆 Creating volunteer award section...');
    await createSection(token, initiativesPage.id, 'volunteer_award', {
      title: initiativesData.volunteerAward.title,
      buttonLabel: initiativesData.volunteerAward.buttonLabel,
      href: initiativesData.volunteerAward.href,
    }, order++);
    console.log('✅ Created volunteer award section');
    
    console.log('\n✅ Migration completed successfully!');
    console.log('🎉 All initiatives data has been migrated to the CMS!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
  }
}

main();