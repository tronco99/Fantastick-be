const express = require('express');
const router = express.Router();
const SquadraService = require('../services/SquadraService');
const { ObjectId } = require('mongodb');

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

router.post('/inserisciSquadra', async (req, res) => {
  try {
    let { idUtente, idLega, idGiocatori, budgetAvanzato, nomeSquadra } = req.body;
    const objectIdUtente = ObjectId.createFromHexString(idUtente);
    const objectIdLega = ObjectId.createFromHexString(idLega);
    let nuovaSquadra;
    if(objectIdUtente && objectIdLega && idGiocatori.length > 0) {
      nuovaSquadra = {
        IDUSER: objectIdUtente,
        IDLEGA: objectIdLega,
        CNOME: nomeSquadra,
        LIDGIOCATORI: idGiocatori,
        DINSERIMENTO: new Date(),
        NBUDGETAVANZATO: budgetAvanzato
      }
      let squadre = await squadraService.inserisciSquadra(nuovaSquadra, res);
      if(squadre) {
        res.status(200).json({ status: 'success', message: 'Estrazione compleatata', squadre: squadre })
      }
    } else {
      res.status(500).json({ status: 'error', message: 'I valori inseriti non sono corretti' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
