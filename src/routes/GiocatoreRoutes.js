const express = require('express');
const router = express.Router();
const GiocatoreService = require('../services/GiocatoreService');

const giocatoreService = new GiocatoreService();

router.get('/', async (req, res) => {
  try {
    const risultato = await giocatoreService.getAll();
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
router.get('/:id', async (req, res) => {
  try {
    const risultato = await giocatoreService.getById(req.params.id);
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
