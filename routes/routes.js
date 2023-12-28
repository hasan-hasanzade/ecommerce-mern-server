import express from 'express';
import { registerValidation, loginValidation } from '../validations.js';
import { checkAuth, handleValidationErrors } from '../middleware/index.js';
import {
  UserController,
  ItemController,
  BlogController,
  CommentController,
} from '../controllers/index.js';
import { upload } from '../middleware/multer.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

const router = express.Router();

router.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

router.get('/auth/me', checkAuth, UserController.getMe);

let imageUrl;

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    imageUrl = `/uploads/${req.file?.originalname}`;
    res.json({
      url: imageUrl,
    });
  } catch (err) {
    console.error('Failed to upload image:', err);
    res.status(500).json({
      message: 'Failed to upload image',
    });
  }
});

router.delete('/deleteImage', checkAuth, async (req, res) => {
  try {
    console.log('Attempting to delete image...');
    
    if (!imageUrl) {
      console.log('Image not found.');
      return res.status(404).json({
        message: 'Image not found',
      });
    }

    const imagePath = path.join(__dirname, '..', 'uploads', path.basename(imageUrl));
    console.log('Deleting image at path:', imagePath);

    await fs.unlink(imagePath);

    // Clear the imageUrl variable
    imageUrl = undefined;

    console.log('Image deleted successfully.');
    res.json({
      message: 'Image deleted successfully',
    });
  } catch (err) {
    console.error('Failed to delete image:', err);
    res.status(500).json({
      message: 'Failed to delete image',
    });
  }
});

router.post('/auth/register', registerValidation, handleValidationErrors, async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let avatarUrl = req.body.userImageUrl || '';

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: avatarUrl, // Используем avatarUrl, который мог быть пустым.
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret433',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot register',
    });
  }
});

router.get('/items', ItemController.getItems);
router.get('/getFilteredItems', ItemController.getFilteredItems);
router.get('/shop/:id', ItemController.getOne);

router.get('/blogs', BlogController.getBlogs);
router.get('/blogs/:id', BlogController.getOneBlog);

router.get('/comments', CommentController.getComments);
router.post('/comment/post', checkAuth, CommentController.postComment);

export default router;
