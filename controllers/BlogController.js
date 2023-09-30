import BlogModel from '../models/Blog.js';

export const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    res.json(blogs);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get blogs',
    });
  }
};

export const getOneBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await BlogModel.findById({ _id: blogId });
    res.json(blog);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get blog',
    });
  }
};
