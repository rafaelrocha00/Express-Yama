var express = require('express')
var router = express.Router()

const TextEntry = require('../schemas/textEntry')
const User = require('../schemas/user')

router.get('/:id', async function(req, res) {
    try {

        const id = req.params.id
        const userId = res.locals.userID

        let user = await User.findById(userId)
        const textEntry = user.textEntries.find(x => x._id == id)

        if (!textEntry) {
            return res.status(404).json({
                status: 404,
                message: 'Entry was not found.'
            })
        }
        return res.status(202).send({ status: 202, ok: true, data: textEntry })


    } catch (err) {
        console.log(err)

        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
        return res.status(500).send(err)
    }
})

router.get('/', async function(req, res) {
    try {

        const userId = res.locals.userID
        const user = await User.findById(userId)
        const textEntries = user.textEntries

        if (!textEntries) {
            return res.status(404).json({
                status: 404,
                message: 'Entry was not found.'
            })
        }
        return res.status(202).send({ status: 202, ok: true, data: textEntries })


    } catch (err) {
        console.log(err)

        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
        return res.status(500).send(err)
    }
})

router.patch('/:id', async function(req, res) {
    try {

        const id = req.params.id
        const userId = res.locals.userID

        let user = await User.findById(userId)
        const textEntry = user.textEntries.find(x => x._id == id)

        textEntry.text = req.body.text
        await user.save()

        return res.status(202).send({ status: 202, ok: true, data: textEntry })

    } catch (err) {
        console.log(err)
        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
        return res.status(500).send(err)
    }
})

router.post('/', async function(req, res) {
    try {

        const textEntry = new TextEntry(req.body)

        const userId = res.locals.userID
        let user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User was not found.'
            })
        }

        if (!user.textEntries) {
            user.textEntries = []
        }

        user.textEntries.push(textEntry)
        console.log(user)
        await user.save()

        return res.status(202).send({ status: 202, ok: true, data: textEntry })

    } catch (err) {
        console.log(err)

        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
        return res.status(500).send(err)
    }
})

module.exports = router