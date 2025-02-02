const Event = require('../models/Event');
const fs = require('fs').promises;
const path = require('path');

// Helper function to delete files
const deleteFile = async (filename) => {
  if (!filename) return;
  const filepath = path.join('uploads', filename);
  try {
    await fs.unlink(filepath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

exports.createEvent = async (req, res) => {
  try {
    const eventData = JSON.parse(req.body.data);
    
    // Handle file uploads
    if (req.files) {
      if (req.files.video) {
        eventData.video = {
          url: `/uploads/${req.files.video[0].filename}`,
          filename: req.files.video[0].filename
        };
      }
      
      if (req.files.images) {
        eventData.images = req.files.images.map(file => ({
          url: `/uploads/${file.filename}`,
          filename: file.filename
        }));
      }
    }

    const event = new Event(eventData);
    await event.save();
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    // Clean up uploaded files if event creation fails
    if (req.files) {
      if (req.files.video) {
        await deleteFile(req.files.video[0].filename);
      }
      if (req.files.images) {
        await Promise.all(req.files.images.map(file => deleteFile(file.filename)));
      }
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { tags } = req.query;
    let query = {};
    
    if (tags) {
      query.tags = { $all: tags.split(',') };
    }
    
    const events = await Event.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const eventData = JSON.parse(req.body.data);
    
    // Handle file uploads
    if (req.files) {
      if (req.files.video) {
        // Delete old video if it exists
        if (event.video && event.video.filename) {
          await deleteFile(event.video.filename);
        }
        eventData.video = {
          url: `/uploads/${req.files.video[0].filename}`,
          filename: req.files.video[0].filename
        };
      }
      
      if (req.files.images) {
        // Delete old images
        if (event.images && event.images.length > 0) {
          await Promise.all(event.images.map(img => deleteFile(img.filename)));
        }
        eventData.images = req.files.images.map(file => ({
          url: `/uploads/${file.filename}`,
          filename: file.filename
        }));
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventData },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    // Clean up uploaded files if update fails
    if (req.files) {
      if (req.files.video) {
        await deleteFile(req.files.video[0].filename);
      }
      if (req.files.images) {
        await Promise.all(req.files.images.map(file => deleteFile(file.filename)));
      }
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Delete associated files
    if (event.video && event.video.filename) {
      await deleteFile(event.video.filename);
    }
    
    if (event.images && event.images.length > 0) {
      await Promise.all(event.images.map(img => deleteFile(img.filename)));
    }

    await event.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};