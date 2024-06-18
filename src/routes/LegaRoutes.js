const express = require('express');
const LegaService = require('../services/LegaService');
const router = express.Router();

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
    console.log(risultato)
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/perUtente', async (req, res) => {
  try {
    const leghe = await legaService.getLeghePerUtente(req.body.idUtente);
    res.json(leghe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/nonRegisVisib', async (req, res) => {
  try {
    const { idUtente, visibilita } = req.body;
    const leghe = await legaService.getLegheNonRegistratoVisib(idUtente, visibilita);
    res.json(leghe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/iscriviUserALega', async (req, res) => {
  try {
    const { listaAggiornata, idLega } = req.body;
    const leghe = await legaService.aggiungiUtenteALega(listaAggiornata, idLega);
    res.json(leghe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
