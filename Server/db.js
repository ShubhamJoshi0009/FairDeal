//db.js
const mongoose = require('mongoose');

const uri = 'mongodb+srv://shubham:password2109@cluster0.bd9xlfu.mongodb.net/car-marketplace?appName=Cluster0';


mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Optional: Add some connection event listeners

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
// Export the mongoose connection for use in other modules
module.exports = mongoose;
