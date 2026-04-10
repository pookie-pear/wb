const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkImages() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found');
    
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
      name: String,
      image: String,
      images: [String]
    }));
    
    const products = await Product.find({}).limit(10);
    console.log(`Checking ${products.length} products...\n`);
    
    products.forEach(p => {
      console.log(`Product: ${p.name}`);
      console.log(`- Main Image: ${p.image}`);
      if (p.images && p.images.length > 0) {
        console.log(`- Gallery: ${p.images.join(', ')}`);
      }
      
      const isDirect = (url) => {
        if (!url) return false;
        return url.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i);
      };
      
      if (p.image && !isDirect(p.image)) {
        console.log(`  [!] WARNING: Main image might NOT be a direct link.`);
      }
      console.log('---');
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkImages();