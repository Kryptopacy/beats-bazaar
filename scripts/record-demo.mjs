import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const RECORDINGS_DIR = path.resolve('recordings');
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

async function recordDemo() {
  console.log('Starting Playwright automated demo recording...');
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

  // 1. Marketplace Hero & Sponsored Rotation
  console.log('2. Exploring Marketplace & Rotating Sponsored Beats...');
  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(2500);

  // Hover over sponsored banner
  const sponsoredCard = page.locator('text=Sponsored Track').first();
  if (await sponsoredCard.count() > 0) {
    await sponsoredCard.hover();
    await page.waitForTimeout(2000);
  }

  // Filter beats by genre: Amapiano
  console.log('3. Filtering by genre: Amapiano...');
  const amapianoBtn = page.locator('button:has-text("Amapiano")').first();
  if (await amapianoBtn.count() > 0) {
    await amapianoBtn.click();
    await page.waitForTimeout(2000);
  }

  // Filter beats by genre: Afrobeats
  console.log('4. Filtering by genre: Afrobeats...');
  const afrobeatsBtn = page.locator('button:has-text("Afrobeats")').first();
  if (await afrobeatsBtn.count() > 0) {
    await afrobeatsBtn.click();
    await page.waitForTimeout(2000);
  }

  // Play a beat
  console.log('5. Playing beat preview & waveform...');
  const playBtn = page.locator('button:has-text("Preview")').first();
  if (await playBtn.count() > 0) {
    await playBtn.click();
    await page.waitForTimeout(4000);
  }

  // 2. Switch to 24/7 Cypher Room
  console.log('6. Navigating to 24/7 Cypher Room...');
  const cypherNavBtn = page.locator('button:has-text("Cypher Room")').first();
  await cypherNavBtn.click();
  await page.waitForTimeout(3000);

  // Crossfade toggle interaction
  console.log('7. Demonstrating Smooth Crossfade & skipping track...');
  const crossfadeLabel = page.locator('label[for="crossfadeToggle"]').first();
  if (await crossfadeLabel.count() > 0) {
    await crossfadeLabel.click();
    await page.waitForTimeout(1500);
  }

  // Skip to next track to trigger crossfade
  const skipBtn = page.locator('button[title*="Skip"]').first();
  if (await skipBtn.count() > 0) {
    await skipBtn.click();
    await page.waitForTimeout(3500);
  }

  // 3. AI DJ Bazza Interaction
  console.log('8. Interacting with Native AI DJ Bazza...');
  const askBazzaBtn = page.locator('button:has-text("Ask Bazza")').first();
  if (await askBazzaBtn.count() > 0) {
    await askBazzaBtn.click();
    await page.waitForTimeout(2500);

    // Click a preset vibe in the modal
    const drillPreset = page.locator('text=Aggressive Drill Cypher Bars').first();
    if (await drillPreset.count() > 0) {
      console.log('Asking Bazza for aggressive drill bars...');
      await drillPreset.click();
      await page.waitForTimeout(4500); // Allow Bazza to evaluate and respond
    }

    // Close Bazza modal
    const closeBtn = page.locator('button:has([class*="lucide-x"])').first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await page.waitForTimeout(1500);
    }
  }

  // 4. Return to Marketplace & Purchase License
  console.log('9. Navigating to Marketplace for Digital Legal Licensing...');
  const marketNavBtn = page.locator('button:has-text("Marketplace")').first();
  await marketNavBtn.click();
  await page.waitForTimeout(2500);

  // Click License on a beat card
  const licenseBtn = page.locator('button:has-text("License")').first();
  if (await licenseBtn.count() > 0) {
    await licenseBtn.click();
    await page.waitForTimeout(2500);

    // Bachs modal is open, click complete payment
    const payBtn = page.locator('button:has-text("Complete")').first();
    if (await payBtn.count() > 0) {
      console.log('10. Completing Bachs checkout flow...');
      await payBtn.click();
      await page.waitForTimeout(3500);
    }

    // Certificate is shown, scroll to review contract
    console.log('11. Reviewing generated Legal Master Certificate & Download WAV...');
    await page.mouse.wheel(0, 250);
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, 250);
    await page.waitForTimeout(3000);
  }

  console.log('12. Finalizing video recording...');
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
    console.log(`Demo video successfully created at: ${finalVideoPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  }
}

recordDemo().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
