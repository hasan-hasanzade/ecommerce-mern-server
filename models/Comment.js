import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
   text: {
      type: String,
      required: true
   },
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true
   },
}, {
   timestamps: true,
});

export default mongoose.model("Comment", CommentSchema);
