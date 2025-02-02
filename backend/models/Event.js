const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  }
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  description: {
    content: {
      type: String,
      required: true
    },
    format: {
      type: String,
      enum: ['plain', 'rich'],
      default: 'plain'
    }
  },
  video: {
    url: String,
    filename: String
  },
  images: [{
    url: String,
    filename: String
  }],
  links: [linkSchema],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

eventSchema.index({ title: 'text', 'description.content': 'text', tags: 'text' });

module.exports = mongoose.model('Event', eventSchema);
