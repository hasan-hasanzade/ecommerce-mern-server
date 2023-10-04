import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    newPrice: Number,
    oldPrice: Number,
    rating: Number,
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('items', ItemSchema);
