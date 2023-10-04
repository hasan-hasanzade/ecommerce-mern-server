import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/routes.js';

import cors from 'cors';

const app = express();

const PORT = 3333;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});

mongoose
  .connect('mongodb+srv://hasanzadeweb:Hesenov433@cluster0.3rh2cen.mongodb.net/ecom')
  .then(() => {
    console.log('DB OK');
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/', routes);
