console.log(`Setting up redis with ${process.env.REDIS_HOST} and ${process.env.REDIS_PORT}`)
const redis = require("redis"),
    client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    })

client.on("error", function (err) {
    console.log(err)
})

testConnection = () => {
    console.log('TESTING REDIS..')
    client.set("PING", "1")

    client.get("PING", (err, reply) => {
        if(!err)
            console.log("REDIS OK!")
    })
}

module.exports = {
    testConnection
}