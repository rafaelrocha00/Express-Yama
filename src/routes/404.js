var express = require('express')
var router = express.Router()

router.get('*', function(req, res) {
    res.status(404).send({
        status: 404,
        message: 'Endpoint was not found.'
    })
})

module.exports = router