var express = require('express')
const cors = require("cors");
const dotenv = require('dotenv')
const bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var connect = require("./src/middleware/connect")


const start = async() => {
    var app = express()
    dotenv.config()

    //Middlewares
    app.use(cors())
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(bodyParser.json({ limit: '50mb' }))

    const conection = 'mongodb+srv://yamaBackend:' + process.env.API_KEY + '@testdigitalizer.nsq96t3.mongodb.net/?retryWrites=true&w=majority'
    console.log(conection)
    try {
        await connect(conection)

    } catch (err) {
        console.log(err)
    }


    // Route importing
    var users = require('./src/routes/users')
    var test = require('./src/routes/test')
    var decks = require('./src/routes/decks')
    var cards = require('./src/routes/cards')
    var revisions = require('./src/routes/revisions')
    var textEntries = require('./src/routes/textEntries')
    var notFound = require('./src/routes/404')

    // Public routes
    app.use('/users', users)
    app.use('/test', test)

    //Protected routes
    app.use(
        "*",
        (req, res, next) => {
            if (!req.body) { return res.status(401).json({ auth: false, message: 'no token provided.' }) }
            let token = req.headers['authorization']
            if (!token) { return res.status(401).json({ auth: false, message: 'no token provided.' }) }


            jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
                console.log(decoded.id)
                if (err) return res.status(500).json({ auth: false, message: 'invalid token.' })
                res.locals.userID = decoded.id
                next();
            });
        }
    );

    app.use('/decks', decks)
    app.use('/card', cards)
    app.use('/revisions', revisions)
    app.use('/textEntries', textEntries)
        // 404
    app.use('*', notFound)

    app.listen(process.env.PORT)
}

start()