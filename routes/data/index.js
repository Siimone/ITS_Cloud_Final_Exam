const express = require('express')
const router = express.Router()
const producer = require('../../services/queue/producer')
const dbService = require('../../services/db/index')
const validatorService = require('../../services/dataValidator')

// Setup Rabbit queue
producer.init();

// Received new data from sensors, pushing it on Rabbit Queue
router.post('/', async (req, res) => {
    const body = req.body
    if(body.id_nastro && body.timestamp && (body.type === 1 || body.type === 0) && body.value){
        console.log('Pusho', body)
        if(body.type === 0) {
            // Ho ricevuto una velocità
            if(validatorService.isValidSpeed(body.value)) {
                dbService.insertMessage(body)
            } else {
                dbService.insertWarning(body)
                producer.pushOnQueue(proces.env., { bus_id: body.bus_id, timestamp: body.timestamp, lat: body.lat, lon: body.lon })
            }
        } else if(body.type === 1) {
            // Ho ricevuto un consumo
            if(validatorService.isValidConsumption(body.value)) {
                dbService.insertMessage(body)
            } else {
                dbService.insertWarning(body)
            }
        }

    }else{
        res.json(400)
    }
    res.json({ result: 1 })
})

router.get('/', async (req, res) => {
    // global.io.emit('locations', { bus_id: 1, lat: 2, lon: 3})
    // res.json({route: '/data'})
})

module.exports = router