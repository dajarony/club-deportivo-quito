const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  uploadImage
} = require('../controllers/news.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/news');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
});

// Input validation middleware
const newsValidation = [
  body('title')
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El título debe tener máximo 100 caracteres'),
  body('excerpt')
    .notEmpty()
    .withMessage('El extracto es obligatorio')
    .isLength({ max: 250 })
    .withMessage('El extracto debe tener máximo 250 caracteres'),
  body('content')
    .notEmpty()
    .withMessage('El contenido es obligatorio'),
  body('image')
    .notEmpty()
    .withMessage('La imagen es obligatoria'),
  body('category')
    .optional()
    .isIn(['team', 'match', 'transfer', 'club', 'other'])
    .withMessage('Categoría no válida')
];

// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Protected routes (admin and editor roles)
router.post('/', protect, authorize('admin', 'editor'), newsValidation, createNews);
router.put('/:id', protect, authorize('admin', 'editor'), updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);
router.post('/upload', protect, authorize('admin', 'editor'), upload.single('image'), uploadImage);

module.exports = router;