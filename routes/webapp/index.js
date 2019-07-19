const express = require('express');
const router = express.Router();
const dbService = require('../../services/db')

router.get('/sezioni', async (req, res) => {
    const sezioni = await dbService.getSezioni();
    res.json(sezioni);
});

router.get('/sezioni/:id/nastri', async (req, res) => {
    const sezioni = await dbService.getNastri(req.params.id);
    res.json(sezioni);
});

router.get('/nastri', async (req, res) => {
    const nastri = await dbService.getNastri()
    res.json(nastri)
})

module.exports = router;
