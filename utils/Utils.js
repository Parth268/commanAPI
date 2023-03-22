const https = require('https');
const { Config } = require('./Config');

let mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let mySql = mysql.createConnection({
    host: process.env.HOSTNAME,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASENAME
});



const authenticateToken = (props) => {
    const { url, req, res, next } = props

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(401)
        req.user = user
        next()
    })
};


mySql.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


const httpCall = (props) => {
    const { options } = props

    return new Promise(resolve => {
        const request = https.get(options, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data = data + chunk.toString();
            });

            response.on('end', () => {
                const body = JSON.parse(data);
                resolve(body?.articles);
            });
        })

        request.on('error', (error) => {
            console.log('An error', error);
            resolve(error)
        });
        request.end()

    })

}



module.exports = { httpCall, mySql, authenticateToken }
