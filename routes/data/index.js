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
        console.log('Received from REST API', body)
        if(body.type === 0) {
            // Ho ricevuto una velocità
            if(validatorService.isValidSpeed(body.value)) {
                producer.pushOnQueue(process.env.RABBIT_QUEUE_GENERAL, body)
            } else {
                producer.pushOnQueue(process.env.RABBIT_QUEUE_WARNINGS, body)
            }
        } else if(body.type === 1) {
            // Ho ricevuto un consumo
            if(validatorService.isValidConsumption(body.value)) {
                producer.pushOnQueue(process.env.RABBIT_QUEUE_GENERAL, body)
            } else {
                producer.pushOnQueue(process.env.RABBIT_QUEUE_WARNINGS, body)
            }
        }

    }else{
        res.json(400)
    }
    res.json({ result: 1 })
})

module.exports = router