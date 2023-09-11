import { body } from 'express-validator';

export const loginValidation = [
   body('email', 'Invalid Email').isEmail(), 
   body('password', "Password shoul be at least 5 symbols").isLength({ min: 5 }),
];

export const registerValidation = [
   body('email', 'Invalid Email').isEmail(), 
   body('password', "Password shoul be at least 5 symbols").isLength({ min: 5 }),
   body('fullName', 'Enter your Name').isLength({ min: 3 }),
   body('avatarUrl', 'Invalid Avatar Url').optional().isURL(),
];
