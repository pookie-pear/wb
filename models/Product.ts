import mongoose, { Schema, Document } from 'mongoose';

export interface IVariation {
  _id?: string;
  sku: string;
  color: string;
  waistSize: number;
  lengthSize: number;
  countInStock: number;
  price: number;
  image: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  countInStock: number;
  rating: number;
  numReviews: number;
  archiveTags: string[];
  
  // Jeans specific fields
  material: string;
  fit: 'Slim' | 'Regular' | 'Relaxed' | 'Skinny' | 'Straight';
  wash: 'Dark' | 'Medium' | 'Light' | 'Black' | 'Acid Wash';
  gender: 'Men' | 'Women' | 'Unisex';
  
  // Variations
  variations: IVariation[];
  
  // Base properties for filters
  colors: string[];
  waistSizes: number[];
  lengthSizes: number[];
}

const VariationSchema = new Schema({
  sku: { type: String, required: true },
  color: { type: String, required: true },
  waistSize: { type: Number, required: true },
  lengthSize: { type: Number, required: true },
  countInStock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    images: [String],
    category: { type: String, required: true, default: 'Jeans' },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    archiveTags: [String],
    
    // Jeans specific
    material: { type: String, required: true },
    fit: { type: String, enum: ['Slim', 'Regular', 'Relaxed', 'Skinny', 'Straight'], required: true },
    wash: { type: String, enum: ['Dark', 'Medium', 'Light', 'Black', 'Acid Wash'], required: true },
    gender: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true },
    
    // Variations
    variations: [VariationSchema],
    
    // Aggregate fields for filtering
    colors: [String],
    waistSizes: [Number],
    lengthSizes: [Number],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
