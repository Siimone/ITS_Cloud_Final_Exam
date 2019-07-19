console.log('INITIALIZING PRODUCER');
const producerInstance = require('./rabbitProducer');

pushOnQueue = (queue, data) => {
    producerInstance.push(queue, data);
};

init = async() => {
    await producerInstance.init();
};

module.exports = {
    init,
    pushOnQueue
};