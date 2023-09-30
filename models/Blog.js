import mongoose from "mongoose"

const BlogSchema = new mongoose.Schema({
   title: String,
   date: Number,
   month: String,
   author: String,
   text: String,
   mainText: String,
   imageUrl: String,
})

export default mongoose.model("blogs", BlogSchema);