const express = require('express');
const router = express.Router();
const dbService = require('../../services/db')

// GET di tutte le sezioni dell'impianto
router.get('/sezioni', async (req, res) => {
    const sezioni = await dbService.getSezioni();
    res.json(sezioni);
});

// Get dei nastri di una sezione
router.get('/sezioni/:id/nastri', async (req, res) => {
    const sezioni = await dbService.getNastri(req.params.id);
    res.json(sezioni);
});

// Get di tutti i nastri
router.get('/nastri', async (req, res) => {
    const nastri = await dbService.getNastri()
    res.json(nastri)
})

module.exports = router;
