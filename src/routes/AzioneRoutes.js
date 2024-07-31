const express = require('express');
const router = express.Router();
const AzioneService = require('../services/AzioneService');

const azioneService = new AzioneService(true);

router.get('/', async (req, res) => {
    try {
        const risultato = await azioneService.getAll();
        res.json(risultato);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const risultato = await azioneService.getById(req.params.id);
        res.json(risultato);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/azionePerLega', async (req, res) => {
    try {
        const { idLega } = req.body;
        const azione = await azioneService.getAzionePerLega(idLega, res);
        if (azione) {
            res.status(200).json({ status: 'success', message: 'Estrazione compleatata', azione: azione })
        } else {
            res.status(500).json({ status: 'error', message: 'Estrazione non completata' })
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/azioniGiocatoriPerLega', async (req, res) => {
    try {
        const { idLega } = req.body;
        const azione = await azioneService.getAzioniGiocatoriPerLega(idLega, res);
        if (azione) {
            res.status(200).json({ status: 'success', message: 'Estrazione compleatata', azione: azione })
        } else {
            res.status(500).json({ status: 'error', message: 'Estrazione non completata' })
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
})

router.post('/inserisciAzione', async (req, res) => {
    try {
        const { azione } = req.body;
        await azioneService.replaceAzione(azione, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;