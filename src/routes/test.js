var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
    res.send('Its Working!')
})

router.get('/params', function(req, res) {
    res.send(req.body)
})

module.exports = router