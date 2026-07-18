const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, delete: deleteEntity } = require('../controllers/settingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAll);
router.get('/:id', getById);

// Admin only routes
router.post('/', protect, adminOnly, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, deleteEntity);

module.exports = router;
