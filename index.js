const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDb connected'))
.catch((err)=>console.log('MongoDb error:',err));

app.get('/', (req, res) => {
  res.json({ message: 'Resume Analyzer API running' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});