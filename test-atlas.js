const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing connection to:', uri.replace(/:[^:@]+@/, ':****@'));
  
  try {
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB Atlas');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    if (collections.some(c => c.name === 'products')) {
      const products = await db.collection('products').find({}).limit(5).toArray();
      console.log(`Found ${products.length} products in the archive.`);
      products.forEach((p, i) => {
        console.log(`Product ${i + 1}: ${p.name}`);
        console.log(` - Main Image: ${p.image}`);
        if (p.images) console.log(` - Gallery: ${p.images.join(', ')}`);
      });
    } else {
      console.log('❌ "products" collection not found in "ecom" database.');
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Connection failed:');
    console.error(err.message);
  }
}

testConnection();
