const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/ecom';

async function checkDB() {
  try {
    console.log('Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    const productsCount = await mongoose.connection.db.collection('products').countDocuments();
    console.log('Product count:', productsCount);
    const usersCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log('User count:', usersCount);
    process.exit(0);
  } catch (err) {
    console.error('DB Error:', err);
    process.exit(1);
  }
}

checkDB();
