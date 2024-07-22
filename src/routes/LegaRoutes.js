const express = require('express');
const LegaService = require('../services/LegaService');
const router = express.Router();

const legaService = new LegaService(true);

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
    res.json(risultato[0]);
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


router.post('/legaPartecipantiNickname', async (req, res) => {
  try {
    const risultato = await legaService.getByIdPartecipantiNickname(req.body.idLega);
    res.json(risultato[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/iscriviUserALega', async (req, res) => {
  try {
    const { idLega, idUtente } = req.body;
    const leghe = await legaService.aggiungiUtenteALega(idLega, idUtente, res);
    res.json(leghe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/inserisciUserInAttesaLega', async (req, res) => {
  try {
    const { idLega, idUtente } = req.body;
    const leghe = await legaService.aggiungiUtenteInAttesaLega(idLega, idUtente, res);
    res.json(leghe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/rimuoviRichiestaUtente', async (req, res) => {
  try {
    const { idLega, idUtente } = req.body;
    const leghe = await legaService.rimuoviUtenteInAttesaLega(idLega, idUtente, res);
    res.json(leghe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/rendiAmdinUtente', async (req, res) => {
  try {
    const { idLega, idUtente } = req.body;
    const leghe = await legaService.rendiAmdinUtente(idLega, idUtente, res);
    res.json(leghe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/rimuoviUtenteALega', async (req, res) => {
  try {
    const { idLega, idUtente } = req.body;
    const leghe = await legaService.rimuoviUtenteALega(idLega, idUtente, res);
    res.json(leghe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
