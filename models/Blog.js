import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: String,
    date: Number,
    month: String,
    author: String,
    text: String,
    mainText: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('blogs', BlogSchema);
