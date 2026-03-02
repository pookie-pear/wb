import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectDB from './mongodb';
import Product from '../models/Product';

const products = [
  {
    name: 'Eclipse Slim-Fit Raw Denim',
    description: 'Our signature raw denim with a slim-fit silhouette. Crafted from premium Japanese selvedge denim, these jeans are designed to age beautifully and develop unique fades over time.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    category: 'Jeans',
    countInStock: 25,
    rating: 4.8,
    numReviews: 45,
    material: '100% Cotton Selvedge Denim',
    fit: 'Slim',
    wash: 'Dark',
    gender: 'Men',
    colors: ['Indigo', 'Black'],
    waistSizes: [28, 30, 32, 34, 36],
    lengthSizes: [30, 32, 34],
    variations: [
      {
        sku: 'ECLIPSE-SLIM-IND-32-32',
        color: 'Indigo',
        waistSize: 32,
        lengthSize: 32,
        countInStock: 10,
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      },
      {
        sku: 'ECLIPSE-SLIM-BLK-32-32',
        color: 'Black',
        waistSize: 32,
        lengthSize: 32,
        countInStock: 5,
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
      }
    ]
  },
  {
    name: 'Midnight Black Skinny Jeans',
    description: 'Sleek and versatile skinny jeans in a deep midnight black. Features a touch of stretch for all-day comfort without losing its shape.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    category: 'Jeans',
    countInStock: 40,
    rating: 4.6,
    numReviews: 28,
    material: '98% Cotton, 2% Elastane',
    fit: 'Skinny',
    wash: 'Black',
    gender: 'Unisex',
    colors: ['Black'],
    waistSizes: [26, 28, 30, 32, 34],
    lengthSizes: [30, 32],
    variations: []
  },
  {
    name: 'Classic Regular Straight Leg',
    description: 'The timeless straight-leg cut that never goes out of style. A comfortable fit through the seat and thigh with a straight opening from the knee to the ankle.',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1604176354204-926873ff34b1?w=800&q=80',
    category: 'Jeans',
    countInStock: 15,
    rating: 4.5,
    numReviews: 32,
    material: '100% Organic Cotton',
    fit: 'Straight',
    wash: 'Medium',
    gender: 'Men',
    colors: ['Light Blue', 'Medium Blue'],
    waistSizes: [30, 32, 34, 36, 38, 40],
    lengthSizes: [30, 32, 34],
    variations: []
  },
  {
    name: 'Vintage Relaxed Fit',
    description: 'Inspired by 90s heritage, these relaxed fit jeans offer a loose, comfortable feel with a vintage wash look.',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80',
    category: 'Jeans',
    countInStock: 12,
    rating: 4.7,
    numReviews: 18,
    material: '100% Recycled Cotton',
    fit: 'Relaxed',
    wash: 'Light',
    gender: 'Women',
    colors: ['Vintage Blue'],
    waistSizes: [24, 26, 28, 30, 32],
    lengthSizes: [30, 32],
    variations: []
  },
  {
    name: 'Acid Wash Retro Denim',
    description: 'Make a statement with our acid wash denim. A bold, textured look that brings a retro edge to your modern wardrobe.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1555529731-4c947233000b?w=800&q=80',
    category: 'Jeans',
    countInStock: 18,
    rating: 4.4,
    numReviews: 22,
    material: '100% Cotton',
    fit: 'Regular',
    wash: 'Acid Wash',
    gender: 'Unisex',
    colors: ['Grey', 'Light Blue'],
    waistSizes: [28, 30, 32, 34, 36],
    lengthSizes: [32, 34],
    variations: []
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Database seeded with jeans successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
