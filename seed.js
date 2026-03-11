const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom';

const products = [
  {
    name: 'DENIM HAZE - RAW SELVEDGE',
    description: '14.5oz Japanese selvedge denim, deep indigo wash with natural aging potential. Hand-crafted in small batches.',
    price: 245,
    category: 'Jeans',
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2363825/pexels-photo-2363825.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    fit: 'Slim',
    wash: 'Dark',
    gender: 'Unisex',
    material: '100% COTTON SELVEDGE',
    waistSizes: [28, 30, 32, 34, 36],
    lengthSizes: [30, 32, 34],
    countInStock: 25,
    rating: 4.9,
    numReviews: 12,
    colors: ['Indigo'],
    variations: [
      { sku: 'DH-RS-30-32', color: 'Indigo', waistSize: 30, lengthSize: 32, countInStock: 5, price: 245, image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { sku: 'DH-RS-32-32', color: 'Indigo', waistSize: 32, lengthSize: 32, countInStock: 8, price: 245, image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800' }
    ]
  },
  {
    name: 'VINTAGE WASH 01',
    description: 'Heavily washed for a lived-in feel. Inspired by the 90s archive pieces. Relaxed fit with a slight taper.',
    price: 185,
    category: 'Jeans',
    image: 'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    fit: 'Relaxed',
    wash: 'Medium',
    gender: 'Unisex',
    material: '12oz ORGANIC COTTON',
    waistSizes: [30, 32, 34, 36],
    lengthSizes: [30, 32],
    countInStock: 15,
    rating: 4.7,
    numReviews: 8,
    colors: ['Vintage Blue'],
    variations: [
      { sku: 'VW-01-32-30', color: 'Vintage Blue', waistSize: 32, lengthSize: 30, countInStock: 4, price: 185, image: 'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=800' }
    ]
  },
  {
    name: 'MIDNIGHT BLACK',
    description: 'Deep black reactive dye that resists fading. Clean, sharp lines for a formal denim appearance.',
    price: 165,
    category: 'Jeans',
    image: 'https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    fit: 'Skinny',
    wash: 'Black',
    gender: 'Unisex',
    material: 'STRETCH DENIM',
    waistSizes: [28, 30, 32, 34],
    lengthSizes: [30, 32, 34],
    countInStock: 40,
    rating: 4.8,
    numReviews: 24,
    colors: ['Black'],
    variations: [
      { sku: 'MB-30-32', color: 'Black', waistSize: 30, lengthSize: 32, countInStock: 10, price: 165, image: 'https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=800' }
    ]
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Seeding products...');
    
    // Check if products already exist
    const count = await mongoose.connection.db.collection('products').countDocuments();
    if (count > 0) {
      console.log('Products already exist. Deleting existing products...');
      await mongoose.connection.db.collection('products').deleteMany({});
    }
    
    await mongoose.connection.db.collection('products').insertMany(products);
    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

seed();
