const amqp = require('amqplib/callback_api');
const raabitmqSettings = {
    protocol: 'amqp',
    hostname: process.env.RABBIT_HOST,
    port: process.env.RABBIT_PORT,
    username: process.env.RABBIT_USERNAME,
    password: process.env.RABBIT_PASSWORD,
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
};

const queue = process.env.RABBIT_QUEUE;
let rabbitConnection = null;

async function init() {
    return new Promise(function(resolve, reject) {
        amqp.connect(raabitmqSettings, function(error0, connection) {
            if (error0) {
                console.log('Error');
                reject(error0);
            }
            resolve(connection)
        });
    })
}

push = async (queue, data) => {
    // console.log(`Sending ${data} to ${queue}`)
    if(rabbitConnection === undefined || rabbitConnection === null) {
        init().then(function(res) {
            res.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }

                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
            });
        }, function(err){
            console.log(err)
        })
    }else {
        rabbitConnection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(data));
            console.log(`SEND NEW ITEM ON ${queue}`, data);
        });
    }
};

module.exports = {
    init,
    push: push
};