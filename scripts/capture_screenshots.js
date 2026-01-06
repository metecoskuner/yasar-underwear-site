const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const defaultUrl = 'https://yasar-underwear-site-fp6u4ibd2-metes-projects-d3b2be38.vercel.app/';
const url = process.env.SCREENSHOT_URL || process.argv[2] || defaultUrl;
const outDir = path.resolve(process.cwd(), 'screenshots');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  console.log('Opening browser...');
  const browser = await chromium.launch();

  try {
    // Desktop screenshot
    const desktopContext = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    const page = await desktopContext.newPage();
    console.log('Navigating to', url, '(desktop)');
    await page.goto(url, { waitUntil: 'networkidle' });
    const desktopPath = path.join(outDir, 'yasar-desktop-raw.png');
    await page.screenshot({ path: desktopPath, fullPage: false });
    console.log('Saved desktop screenshot to', desktopPath);
    await desktopContext.close();

    // Mobile screenshot (iPhone 12)
    const iPhone = devices['iPhone 12'];
    const mobileContext = await browser.newContext({ ...iPhone });
    const page2 = await mobileContext.newPage();
    console.log('Navigating to', url, '(mobile: iPhone 12)');
    await page2.goto(url, { waitUntil: 'networkidle' });
    const mobilePath = path.join(outDir, 'yasar-mobile-raw.png');
    await page2.screenshot({ path: mobilePath, fullPage: false });
    console.log('Saved mobile screenshot to', mobilePath);
    await mobileContext.close();

    // Resize and prepare LinkedIn-ready images using sharp
    const desktopResizedPath = path.join(outDir, 'yasar-desktop-1200x627.png');
    const mobileResizedPath = path.join(outDir, 'yasar-mobile-1080x1080.png');
    const combinedPath = path.join(outDir, 'yasar-combined-2280x1080.png');
    const linkedinHeroPath = path.join(outDir, 'yasar-linkedin-1200x627.png');

    console.log('Resizing desktop to 1200x627...');
    await sharp(desktopPath).resize(1200, 627, { fit: 'cover' }).toFile(desktopResizedPath);

    console.log('Resizing mobile to 1080x1080...');
    await sharp(mobilePath).resize(1080, 1080, { fit: 'cover' }).toFile(mobileResizedPath);

    // Create combined canvas 2280x1080 and composite images
    console.log('Combining images into side-by-side 2280x1080...');
    const canvasWidth = 1200 + 1080;
    const canvasHeight = Math.max(627, 1080);
    const desktopTop = Math.floor((canvasHeight - 627) / 2); // center desktop vertically

    const background = {
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 3,
        background: '#ffffff'
      }
    };

    const compositeBuffer = await sharp(background)
      .composite([
        { input: desktopResizedPath, left: 0, top: desktopTop },
        { input: mobileResizedPath, left: 1200, top: 0 }
      ])
      .png()
      .toBuffer();

    await sharp(compositeBuffer).toFile(combinedPath);

    // LinkedIn hero (use desktop resized as hero)
    await sharp(desktopResizedPath).toFile(linkedinHeroPath);

    console.log('Saved resized and combined images:');
    console.log(' -', desktopResizedPath);
    console.log(' -', mobileResizedPath);
    console.log(' -', combinedPath);
    console.log(' -', linkedinHeroPath);

    console.log('All screenshots and assets saved in', outDir);
  } catch (err) {
    console.error('Error capturing screenshots:', err);
  } finally {
    await browser.close();
  }
})();
