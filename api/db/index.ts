const mongoose = require('mongoose');
const url = process.env.MONGODB_URL!;
mongoose
  .connect(url)
  .then(() => console.log('Connected to db'))
  .catch((err: any) => console.log('connection failed', err));
