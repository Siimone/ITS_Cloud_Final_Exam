const axios = require('axios');
let firstLineStart = { lat: 45.457888, lon: 9.179528 };
let secondLineStart = 2;
let thirdLineStart = 2;

let increment = 0.00010;

// Tipi di dato inviato dai sensori:
// 0 -> velocità
// 1 -> consumo

setInterval( async ()=> {
    console.log('Sent NASTRO 1');
    try {
        let randomType = (Math.random()>0.5)? 1 : 0;
        await axios.post('http://34.241.79.123:3000/data', {
            id_nastro : Math.floor(Math.random() * (63 - 1 + 1)) + 1,
            timestamp: Math.floor(+ new Date()/1000),
            type: randomType,
            value: Math.random() * (65 - 55) + 55
        });
        increment = increment + 0.00010;
    }catch(e) {
        console.log('SERVER DOWN')
    }
}, 3000);