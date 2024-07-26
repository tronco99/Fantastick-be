const express = require('express');
const router = express.Router();
const SquadraService = require('../services/SquadraService');

const squadraService = new SquadraService(true);

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

router.post('/squadrePerLega', async (req, res) => {
  try {
    let { idLega } = req.body;
    let squadre = await squadraService.getSquadrePerLega(idLega, res);
    if(squadre) {
      res.status(200).json({ status: 'success', message: 'Estrazione compleatata', squadre: squadre })
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


module.exports = router;
