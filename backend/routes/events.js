const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../config/multer');

const uploadFields = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

router.post('/', uploadFields, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);
router.put('/:id', uploadFields, eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;