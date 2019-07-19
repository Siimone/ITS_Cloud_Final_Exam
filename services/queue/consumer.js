console.log('INITIALIZING CONSUMER');
const amqp = require('amqplib/callback_api');
const dbService = require('../db/index');
// const io = require('../../index');
const POI = {
    "lat": 45.457888,
    "lon": 9.179528
};
let increment = 0.000001;

const rabbitmqSettings = {
    protocol: 'amqp',
    hostname: process.env.RABBIT_HOST,
    port: 5672,
    username: process.env.RABBIT_USERNAME,
    password: process.env.RABBIT_PASSWORD,
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
};

amqp.connect(rabbitmqSettings, function(error0, connection) {
    if (error0) {
        console.log(error0);
    }else{
        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.log(error1);
            }
            const queue = 'hello';
            channel.assertQueue(process.env.RABBIT_QUEUE_GENERAL, {
                durable: false
            });

            channel.assertQueue(process.env.RABBIT_QUEUE_WARNINGS, {
                durable: false
            });

            channel.consume(process.env.RABBIT_QUEUE_GENERAL, function(msg) {
                console.log(`Received ${msg.content}`);
                const obj = JSON.parse(msg.content.toString())
                dbService.insertMessage(obj)
                io.emit(process.env.RABBIT_QUEUE_GENERAL, obj)
            }, {
                noAck: true
            });
            channel.consume(process.env.RABBIT_QUEUE_WARNINGS, function(msg) {
                console.log(`Received ${msg.content}`);
                const obj = JSON.parse(msg.content.toString())
                dbService.insertWarning(obj)
                io.emit(process.env.RABBIT_QUEUE_WARNINGS, obj)
            }, {
                noAck: true
            });
        });
    }
});