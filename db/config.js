
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/media-app').then(()=>console.log('mongodb connected'));