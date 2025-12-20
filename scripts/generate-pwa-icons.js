const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  const sizes = [180, 192, 512];
  const inputPath = path.join(__dirname, '../public/logos/mzlogo.webp');
  const outputDir = path.join(__dirname, '../public/logos');
  
  try {
    // Read the original logo
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    for (const size of sizes) {
      // Generate PNG icons
      await image
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
        .toFormat('png')
        .toFile(path.join(outputDir, `icon-${size}.png`));
      
      console.log(`Generated icon-${size}.png`);
      
      // Also generate WebP for modern browsers
      await image
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
        .toFormat('webp')
        .toFile(path.join(outputDir, `icon-${size}.webp`));
        
      console.log(`Generated icon-${size}.webp`);
    }
    
    console.log('✅ All PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();