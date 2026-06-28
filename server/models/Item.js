const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Please specify if item is lost or found']
  },
  category: {
    type: String,
    enum: ['Electronics', 'Books', 'Clothing', 'ID Cards', 'Keys', 'Accessories', 'Other'],
    required: [true, 'Please select a category']
  },
  images: [{
    url: String,
    publicId: String
  }],
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  dateLostOrFound: {
    type: Date,
    required: [true, 'Please add the date']
  },
  contactInfo: {
    phone: String,
    email: String
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'resolved'],
    default: 'active'
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Text index for search
itemSchema.index({ title: 'text', description: 'text' });

// Compound index for filtering
itemSchema.index({ type: 1, category: 1, status: 1 });

// Index for getting user's items quickly
itemSchema.index({ postedBy: 1, createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);
