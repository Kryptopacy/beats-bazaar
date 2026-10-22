import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const RECORDINGS_DIR = path.resolve('recordings');
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

async function recordDemo() {
  console.log('Starting Playwright automated Beats Bazaar demo recording...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: RECORDINGS_DIR,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  console.log('1. Navigating to Beats Bazaar...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // 1. Marketplace Hero & Boosted Tracks
  console.log('2. Exploring Marketplace & Boosted Tracks...');
  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(2000);

  // Filter beats by genre: Amapiano
  console.log('3. Filtering by Amapiano...');
  const amapianoBtn = page.locator('button:has-text("Amapiano")').first();
  if (await amapianoBtn.count() > 0) {
    await amapianoBtn.click();
    await page.waitForTimeout(2000);
  }

  // Filter beats by genre: Afrobeats
  console.log('4. Filtering by Afrobeats...');
  const afrobeatsBtn = page.locator('button:has-text("Afrobeats")').first();
  if (await afrobeatsBtn.count() > 0) {
    await afrobeatsBtn.click();
    await page.waitForTimeout(2000);
  }

  // Play beat preview
  console.log('5. Playing beat preview & audio scrubber...');
  const playOverlay = page.locator('div[style*="linear-gradient"], div[style*="background"]').first();
  if (await playOverlay.count() > 0) {
    await playOverlay.click();
    await page.waitForTimeout(3500);
  }

  // Inspect producer storefront modal
  console.log('6. Opening Producer Profile Storefront...');
  const prodBtn = page.locator('button:has-text("TCG-m"), button:has-text("SarzAura")').first();
  if (await prodBtn.count() > 0) {
    await prodBtn.click();
    await page.waitForTimeout(2500);
    // Switch to placements tab if available
    const placementsTab = page.locator('button:has-text("Placements"), button:has-text("Streaming")').first();
    if (await placementsTab.count() > 0) {
      await placementsTab.click();
      await page.waitForTimeout(2000);
    }
    // Close modal
    const closeProd = page.locator('button:has([class*="lucide-x"])').first();
    if (await closeProd.count() > 0) {
      await closeProd.click();
      await page.waitForTimeout(1500);
    }
  }

  // 2. Navigate to 24/7 Cypher Room
  console.log('7. Entering 24/7 Freestyle Cypher Room...');
  const cypherNavBtn = page.locator('button:has-text("Cypher Room")').first();
  await cypherNavBtn.click();
  await page.waitForTimeout(3000);

  // 3. Trigger Interactive Cypher FX Soundboard
  console.log('8. Triggering Cypher FX Soundboard (Airhorn, Laser, Scratch, 808 Boom)...');
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(1200);

  // Airhorn
  const airhornBtn = page.locator('button:has-text("Airhorn")').first();
  if (await airhornBtn.count() > 0) {
    await airhornBtn.click();
    await page.waitForTimeout(1000);
  }

  // Laser Drop
  const laserBtn = page.locator('button:has-text("Laser")').first();
  if (await laserBtn.count() > 0) {
    await laserBtn.click();
    await page.waitForTimeout(1000);
  }

  // Scratch
  const scratchBtn = page.locator('button:has-text("Scratch")').first();
  if (await scratchBtn.count() > 0) {
    await scratchBtn.click();
    await page.waitForTimeout(1000);
  }

  // 808 Boom
  const subBtn = page.locator('button:has-text("808 Boom")').first();
  if (await subBtn.count() > 0) {
    await subBtn.click();
    await page.waitForTimeout(1500);
  }

  // Crossfade toggle
  console.log('9. Demonstrating Smooth Crossfade & skipping track...');
  const crossfadeLabel = page.locator('label[for="crossfadeToggle"]').first();
  if (await crossfadeLabel.count() > 0) {
    await crossfadeLabel.click();
    await page.waitForTimeout(1200);
  }

  // Skip track
  const skipBtn = page.locator('button[title*="Skip"]').first();
  if (await skipBtn.count() > 0) {
    await skipBtn.click();
    await page.waitForTimeout(3000);
  }

  // 4. Native AI DJ Bazza Curation
  console.log('10. Interacting with Bazza (Resident Sound Selector)...');
  const askBazzaBtn = page.locator('button:has-text("Ask Bazza")').first();
  if (await askBazzaBtn.count() > 0) {
    await askBazzaBtn.click();
    await page.waitForTimeout(2000);

    // Type directly into Bazza's prompt area
    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.fill('Fast 140 BPM battle drill with heavy sliding 808s for a rapid cypher');
      await page.waitForTimeout(1000);
      
      const submitBazza = page.locator('button:has-text("Queue Beat"), button:has-text("Find Beats")').first();
      if (await submitBazza.count() > 0) {
        await submitBazza.click();
        await page.waitForTimeout(4500); // Allow Bazza crate animation and recommendation
      }
    }

    // Close Bazza modal
    const closeBtn = page.locator('div.fixed.inset-0 button:has([class*="lucide-x"])').first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await page.waitForTimeout(1500);
    }
  }

  // 5. Digital Master Licensing Checkout
  console.log('11. Initiating Digital Master Rights Licensing...');
  const licenseDeckBtn = page.locator('button:has-text("License This Beat")').first();
  if (await licenseDeckBtn.count() > 0) {
    await licenseDeckBtn.click();
    await page.waitForTimeout(2500);
  }

  // Complete Bachs checkout flow
  const payBtn = page.locator('button:has-text("Pay $")').first();
  if (await payBtn.count() > 0) {
    console.log('12. Completing Bachs checkout flow...');
    await payBtn.click();
    await page.waitForTimeout(3500);
  }

  // Certificate review & contract verification
  console.log('13. Reviewing generated Master License Certificate & Token...');
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(2500);
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(3000);

  // Close Certificate
  const closeCert = page.locator('div.fixed.inset-0 button:has([class*="lucide-x"])').first();
  if (await closeCert.count() > 0) {
    await closeCert.click();
    await page.waitForTimeout(1500);
  }

  console.log('14. Finalizing video recording...');
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video in recordings/
  const files = fs.readdirSync(RECORDINGS_DIR).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    files.sort((a, b) => fs.statSync(path.join(RECORDINGS_DIR, b)).mtimeMs - fs.statSync(path.join(RECORDINGS_DIR, a)).mtimeMs);
    const latestVideo = path.join(RECORDINGS_DIR, files[0]);
    const finalVideoPath = path.join(RECORDINGS_DIR, 'beats-bazaar-demo.webm');
    if (latestVideo !== finalVideoPath) {
      fs.copyFileSync(latestVideo, finalVideoPath);
    }
    const stats = fs.statSync(finalVideoPath);
    console.log(`Demo video successfully recorded at: ${finalVideoPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // Also copy to devpost/
    const devpostDest = path.resolve('devpost', 'beats-bazaar-demo.webm');
    fs.copyFileSync(finalVideoPath, devpostDest);
    console.log(`Mirrored to devpost at: ${devpostDest}`);
  }
}

recordDemo().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
