import express from 'express';
import { registerValidation, loginValidation } from '../validations.js';
import { checkAuth, handleValidationErrors } from '../middleware/index.js';
import { UserController, ItemController, BlogController } from '../controllers/index.js';
import { upload } from '../middleware/multer.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

const router = express.Router();

router.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

router.get('/auth/me', checkAuth, UserController.getMe);

let imageUrl;

router.post('/upload', upload.single('image'), (req, res) => {
  imageUrl = `/uploads/${req.file.originalname}`;
  res.json({
    url: imageUrl,
  });
});

router.post('/auth/register', registerValidation, handleValidationErrors, async (req, res) => {
   try {
     const password = req.body.password;
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password, salt);
 
     const doc = new UserModel({
       email: req.body.email,
       fullName: req.body.fullName,
       avatarUrl: imageUrl,
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
router.get('/items/:id', ItemController.getOne);

router.get('/blogs', BlogController.getBlogs);
router.get('/blogs/:id', BlogController.getOneBlog);


export default router;
