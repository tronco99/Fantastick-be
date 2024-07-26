const express = require('express');
const router = express.Router();
const BonusService = require('../services/BonusService');
const LegaService = require('../services/LegaService');
const CategorieService = require('../services/CategorieService');
const GiocatoreService = require('../services/GiocatoreService');
const { ObjectId } = require('mongodb');

const bonusService = new BonusService(true);
const legaService = new LegaService(false);
const categorieService = new CategorieService(false);
const giocatoreService = new GiocatoreService(false);

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
    let { nuovaLega, nuoveCategorie, nuoviBonus } = req.body;

    const legaId = new ObjectId();
    const legheConNomeUguale = await legaService.getByCnome(nuovaLega.CNOME);
    let nuoviBonusConId;
    let nuoviGiovatoriConId;
    let nGiocatori = [];

    if (legheConNomeUguale.length == 0 && nuovaLega.CNOME) {
      const objectIdCreatore = ObjectId.createFromHexString(nuovaLega.IDCREATORE);
      nuovaLega.LIDUSER = [nuovaLega.IDCREATORE];
      nuovaLega.LIDUSERADMIN = [nuovaLega.IDCREATORE];
      nuovaLega.IDCREATORE = objectIdCreatore;
      nuovaLega._id = legaId;

      if (nuoviBonus.length > 0) {
        nuoviBonusConId = nuoviBonus.map(doc => ({
          ...doc,
          IDLEGA: legaId,
          IDCREATORE: objectIdCreatore,
          _id: new ObjectId()
        }));
      }

      if (nuoveCategorie.length > 0) {
        try {
          nuoviGiovatoriConId = nuoveCategorie.flatMap(doc =>
            doc.giocatoriCollegati.map(giocatore => ({
              ...giocatore,
              _id: new ObjectId(),
              IDCREATORE: objectIdCreatore
            }))
          );
          nuoveCategorie.forEach(categoria => {
            categoria.LIDGIOCATORI = [];
            nGiocatori.push(categoria.giocatoriCollegati.length)
            categoria.giocatoriCollegati.forEach(gioc => {
              const idGiocatoriCollegati = nuoviGiovatoriConId
                .filter(giocatore => giocatore.CNOME === gioc.CNOME)
                .map(giocatore => giocatore._id.toString());
              categoria.LIDGIOCATORI.push(...idGiocatoriCollegati);
            });
          });
        } catch (err) {
          res.status(500).json({ status: 'error', message: 'Categorie e giocatori non correttamente valorizzati' })
        }
      }

      let leghe;
      let bonus;
      let categorie;
      let giocatori;

      leghe = await legaService.aggiungiLega(nuovaLega, res);

      if (nuoviBonus.length > 0) {
        bonus = await bonusService.aggiungiBonus(nuoviBonusConId, res);
      }

      if (nuoveCategorie.length > 0 && !nGiocatori.includes(0)) {
        try {
          categorie = await categorieService.aggiungiCategorie(nuoveCategorie, res);
          giocatori = await giocatoreService.aggiungiGiocatori(nuoviGiovatoriConId, res);
        } catch (err) {
          res.status(500).json({ status: 'error', message: 'Categorie e giocatori non correttamente valorizzati' })
        }
      } else if(nGiocatori.includes(0)) {
        res.status(500).json({ status: 'error', message: 'Giocatori non inseriti' })
        return 0
      }

      if (leghe || bonus || categorie || giocatori) {
        res.status(200).json({ status: 'success', message: 'Lega inserita' })
      } else {
        res.status(500).json({ status: 'error', message: 'Errore in fase di inserimento' });
      }
    } else {
      res.status(500).json({ status: 'error', message: 'Errore in fase di inserimento, nome lega già presente' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/bonusPerLega', async (req, res) => {
  try {
    let { idLega } = req.body;
    let bonus = await bonusService.getBonusPerLega(idLega, res);
    if(bonus) {
      res.status(200).json({ status: 'success', message: 'Estrazione compleatata', regolamento: bonus })
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;