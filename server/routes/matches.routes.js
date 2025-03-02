const express = require('express');
const router = express.Router();
const {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getFixtures,
  getResults,
  getLiveMatches,
  updateMatchResult
} = require('../controllers/matches.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Input validation middleware
const matchValidation = [
  body('competition')
    .notEmpty()
    .withMessage('La competición es obligatoria')
    .isIn(['Liga Pro', 'Copa Ecuador', 'Copa Libertadores', 'Copa Sudamericana', 'Amistoso'])
    .withMessage('Competición no válida'),
  body('season')
    .notEmpty()
    .withMessage('La temporada es obligatoria'),
  body('matchday')
    .notEmpty()
    .withMessage('La jornada es obligatoria'),
  body('date')
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .isISO8601()
    .withMessage('Formato de fecha no válido'),
  body('homeTeam')
    .notEmpty()
    .withMessage('El equipo local es obligatorio'),
  body('awayTeam')
    .notEmpty()
    .withMessage('El equipo visitante es obligatorio'),
  body('status')
    .optional()
    .isIn(['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'])
    .withMessage('Estado no válido')
];

const matchResultValidation = [
  body('status')
    .optional()
    .isIn(['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'])
    .withMessage('Estado no válido'),
  body('homeScore')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Goles del equipo local debe ser un número positivo'),
  body('awayScore')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Goles del equipo visitante debe ser un número positivo'),
  body('minute')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('Minuto debe ser un número entre 0 y 120')
];

// Public routes
router.get('/', getAllMatches);
router.get('/fixtures', getFixtures);
router.get('/results', getResults);
router.get('/live', getLiveMatches);
router.get('/:id', getMatchById);

// Protected routes (admin and editor roles)
router.post('/', protect, authorize('admin', 'editor'), matchValidation, createMatch);
router.put('/:id', protect, authorize('admin', 'editor'), updateMatch);
router.delete('/:id', protect, authorize('admin'), deleteMatch);
router.put('/:id/result', protect, authorize('admin', 'editor'), matchResultValidation, updateMatchResult);

module.exports = router;