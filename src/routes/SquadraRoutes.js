const express = require('express');
const router = express.Router();
const SquadraService = require('../services/SquadraService');

const squadraService = new SquadraService();

router.get('/', async (req, res) => {
  try {
    const risultato = await squadraService.getAll();
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
router.get('/:id', async (req, res) => {
  try {
    const risultato = await squadraService.getById(req.params.id);
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
