const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

testConnection = () => {
    console.log('TESTING POSTGRES..');
    pool.query('SELECT NOW()', (err, res) => {
        if(!err)
            console.log('POSTGRES OK!');
        else
            console.log('CANNOT CONNECT TO POSTGRES')
    });
};

initNastri = async () => {
    for(let i=0; i < 7; i++) {
        for(let j=0; j < 9; j++) {
            await pool.query(`
            INSERT INTO public.nastro
                ("name", id_sezione)
            VALUES('Nastro ${j+1}', ${i+1});`)
        }
    }
}

getSezioni = async () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM sezione', (err, res) => {
            if(err) reject(err);
            resolve(res.rows)
        })
    })
};

getNastri = async(id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM nastro WHERE id_sezione = $1',
            [id],
            (err, res) => {
            if(err)
                reject(err);
            resolve(res.rows)
        })
    })
}

getNastri = async() => {
    return new Promise((resolve, reject) => {
        pool.query(
            `select nastro.id, sezione.name, sezione.id as sezione_id from nastro inner join sezione on nastro.id_sezione = sezione.id order by nastro.id`,
            (err, res) => {
                if(err) reject(err)
                resolve(res.rows)
            })
    })
}

insertWarning = async (message) => {
    console.log('ON DB', message)
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO warning (id_nastro, type, value) VALUES ($1, $2, $3)',
            [
                message.id_nastro,
                message.type,
                message.value
            ],
            (err) => {
                if(err) {
                    console.log(err)
                    reject();
                } else
                    resolve()
            }
        )
    })
}

insertMessage = async (message) => {
    console.log('ON DB', message)
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO messaggio (id_nastro, type, value) VALUES ($1, $2, $3)',
            [
                message.id_nastro,
                message.type,
                message.value
            ],
            (err) => {
                if(err) {
                    console.log(err)
                    reject();
                } else
                    resolve()
            }
        )
    })
}

module.exports = {
    testConnection,
    initNastri,
    getNastri,
    getSezioni,
    insertMessage,
    insertWarning
};