import CommentModel from '../models/Comment.js';

export const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate({
      path: 'author',
      select: 'fullName avatarUrl',
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
    const { userId } = req;

    const comment = new CommentModel({
      text: req.body.text,
      author: userId,
    });
    await comment.save();
    res.status(200).json({ message: 'Comment posted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot post comments',
    });
  }
};
