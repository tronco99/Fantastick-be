const express = require('express');
const router = express.Router();
const BonusService = require('../services/BonusService');
const LegaService = require('../services/LegaService');
const CategorieService = require('../services/CategorieService');
const GiocatoreService = require('../services/GiocatoreService');
const { ObjectId } = require('mongodb');

const bonusService = new BonusService();
const legaService = new LegaService();
const categorieService = new CategorieService();
const giocatoreService = new GiocatoreService();

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

    /*
      - lega: id, idCreatore -> ok
      - bonus: id, idLega, idCreatore -> ok
      - categorie: id, LidGiocatore -> ok (tolto idlega perche meglio che ogni categoria sia a se)
      - giocatore: id -> ok
    */

    const legaId = new ObjectId();

    const objectIdCreatore = ObjectId.createFromHexString(nuovaLega.IDCREATORE);
    nuovaLega.LIDUSER = [nuovaLega.IDCREATORE];
    nuovaLega.IDCREATORE = objectIdCreatore;
    nuovaLega._id = legaId;


    const nuoviBonusConId = nuoviBonus.map(doc => ({
      ...doc,
      IDLEGA: legaId,
      IDCREATORE: objectIdCreatore,
      _id: new ObjectId()
    }));

    const nuoviGiovatoriConId = nuoveCategorie.flatMap(doc =>
      doc.giocatoriCollegati.map(giocatore => ({
        ...giocatore,
        _id: new ObjectId(),
        IDCREATORE: objectIdCreatore
      }))
    );

    nuoveCategorie.forEach(categoria => {
      categoria.LIDGIOCATORI = [];
      categoria.giocatoriCollegati.forEach(gioc => {
        const idGiocatoriCollegati = nuoviGiovatoriConId
          .filter(giocatore => giocatore.CNOME === gioc.CNOME)
          .map(giocatore => giocatore._id.toString());
        categoria.LIDGIOCATORI.push(...idGiocatoriCollegati);
      });
    });

    const leghe = await legaService.aggiungiLega(nuovaLega, res);
    const bonus = await bonusService.aggiungiBonus(nuoviBonusConId, res);
    const categorie = await categorieService.aggiungiCategorie(nuoveCategorie, res);
    const giocatori = await giocatoreService.aggiungiGiocatori(nuoviGiovatoriConId, res);




    res.json(nuoviGiovatoriConId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

/*const nuoveCategorieConId = nuoveCategorie.map(doc => ({
   ...doc,
   giocatoriCollegati: doc.giocatoriCollegati.map(giocatore => ({
     ...giocatore,
     IDCREATORE: objectIdCreatore
   })
   ),
 }));*/