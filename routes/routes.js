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
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    if (!imageUrl) {
      return res.status(404).json({
        message: 'Image not found',
      });
    }

    const imagePath = path.join(__dirname, '..', 'uploads', path.basename(imageUrl));

    await fs.unlink(imagePath);

    imageUrl = undefined;

    res.json({
      message: 'Image deleted successfully',
    });
  } catch (err) {
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
