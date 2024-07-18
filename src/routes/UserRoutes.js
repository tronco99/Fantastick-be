const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');

const userService = new UserService(true);

router.get('/', async (req, res) => {
  try {
    const risultato = await userService.getAll();
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
router.get('/:id', async (req, res) => {
  try {
    const risultato = await userService.getById(req.params.id);
    res.json(risultato);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
