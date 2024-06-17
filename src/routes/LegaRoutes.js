const express = require('express');
const router = express.Router();
const LegaService = require('../services/LegaService');

const legaService = new LegaService();

router.get('/', async (req, res) => {
  try {
    const risultato = await legaService.getAll();
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
router.get('/:id', async (req, res) => {
  try {
    const risultato = await legaService.getById(req.params.id);
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/perUtente', async (req, res) => {
  try {
    const userId = req.body.userId;
    const leghe = await LegaService.getLeghePerUtente(userId);
    res.json(leghe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
