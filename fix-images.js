const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixImages() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is missing from .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    console.log(`Found ${products.length} products. Checking images...`);
    
    for (const p of products) {
      let updated = false;
      let newImage = p.image;
      
      // Fix Google Search URLs
      if (p.image && p.image.includes('google.com/imgres')) {
        const urlParams = new URLSearchParams(p.image.split('?')[1]);
        const imgUrl = urlParams.get('imgurl');
        if (imgUrl) {
          console.log(`Fixing image for product: ${p.name}`);
          console.log(`Old: ${p.image.substring(0, 50)}...`);
          newImage = imgUrl;
          updated = true;
        }
      }

      // Upgrade http to https for Shopify/Pexels/Unsplash if needed
      if (newImage && newImage.startsWith('http://')) {
        newImage = newImage.replace('http://', 'https://');
        updated = true;
      }

      if (updated) {
        await db.collection('products').updateOne(
          { _id: p._id },
          { $set: { image: newImage } }
        );
        console.log(`✅ Updated: ${p.name}`);
        console.log(`New: ${newImage}`);
      }
    }
    
    console.log('Done fixing images.');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

fixImages();
