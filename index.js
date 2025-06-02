// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);

// DB and Server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch(err => console.error('DB connection error:', err));
