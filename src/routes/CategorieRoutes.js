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


module.exports = router;
