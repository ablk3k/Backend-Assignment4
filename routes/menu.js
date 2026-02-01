const express = require('express');
const { body } = require('express-validator');
const menuCtrl = require('../controllers/menuController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', menuCtrl.list);
router.get('/:id', menuCtrl.get);

router.post('/', authenticate, requireAdmin,
  body('name').isString().trim().notEmpty(),
  body('description').isString().trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('category').isString().trim().notEmpty(),
  menuCtrl.create
);

router.put('/:id', authenticate, requireAdmin,
  body('name').optional().isString().trim().notEmpty(),
  body('description').optional().isString().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isString().trim().notEmpty(),
  menuCtrl.update
);

router.delete('/:id', authenticate, requireAdmin, menuCtrl.remove);

module.exports = router;
