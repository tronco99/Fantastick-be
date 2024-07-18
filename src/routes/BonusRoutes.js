const express = require('express');
const router = express.Router();
const BonusService = require('../services/BonusService');

const bonusService = new BonusService();

router.get('/', async (req, res) => {
  try {
    const risultato = await bonusService.getAll();
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
router.get('/:id', async (req, res) => {
  try {
    const risultato = await bonusService.getById(req.params.id);
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/postCreaLega', async (req, res) => {
  try {
    const { nuovaLega, nuoveCategorie, nuoviBonus } = req.body;
    //const leghe = await legaService.rimuoviUtenteInAttesaLega(idLega, idUtente, res);
    console.log(nuovaLega);
    console.log(nuoveCategorie);
    console.log(nuoviBonus);
    res.json(nuovaLega);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
