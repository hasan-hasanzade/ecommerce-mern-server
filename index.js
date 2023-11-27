import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/routes.js';
import cors from 'cors';
import 'dotenv/config';


const app = express();

// const PORT = 3333;

const DB = process.env.MONGODB_CONNECT_URI;
const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log('Server OK');
});

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB OK');
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/', routes);
