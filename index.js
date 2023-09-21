import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';

import cors from 'cors';

import * as UserController from './controllers/UserController.js';
import * as ItemController from './controllers/ItemController.js';

mongoose
  .connect('mongodb+srv://hasanzadeweb:Hesenov433@cluster0.3rh2cen.mongodb.net/ecom')
  .then(() => {
    console.log('DB is OK');
  })
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3333;



app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/items', ItemController.getItems);
app.get('/paginatedItems', ItemController.getPaginatedItems);
app.get('/items/:id', ItemController.getOne);

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
