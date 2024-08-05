const express = require('express');
const router = express.Router();
const CategorieService = require('../services/CategorieService');

const categorieService = new CategorieService(true);

router.get('/', async (req, res) => {
  try {
    const risultato = await categorieService.getAll();
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
router.get('/:id', async (req, res) => {
  try {
    const risultato = await categorieService.getById(req.params.id);
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/categoriePerLega', async (req, res) => {
  try {
    const { idLega } = req.body;
    const categorie = await categorieService.getCategoriePerLega(idLega, res);
    if(categorie) {
      res.status(200).json({ status: 'success', message: 'Estrazione compleatata', categorie: categorie })
    }  }catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/postCategoriePerLegaConBonus', async (req, res) => {
  try {
    const { idLega } = req.body;
    const categorie = await categorieService.getCategoriePerLegaConBonus(idLega, res);
    if(categorie) {
      res.status(200).json({ status: 'success', message: 'Estrazione compleatata', categorie: categorie })
    }  }catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/giocatoriPerLegaSenzaBonus', async (req, res) => {
  try {
    const { idLega } = req.body;
    const categorie = await categorieService.getCategoriePerLegaSenzaBonus(idLega, res);
    if(categorie) {
      res.status(200).json(categorie)
    }  }catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
