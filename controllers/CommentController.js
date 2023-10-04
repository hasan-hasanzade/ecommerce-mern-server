import CommentModel from '../models/Comment.js';

export const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate({
      path: "author",
      select: "fullName avatarUrl",
    });
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get comments',
    });
  }
};

export const postComment = async (req, res) => {
  try {
   const { userId } = req; // Replace with the actual way you access the user's ID

   // Create a new comment and set the "author" field to the user's ID
   const comment = new CommentModel({
     text: req.body.text,
     author: userId,
     // ... other comment properties ...
   });
    await comment.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get products',
    });
  }
};
