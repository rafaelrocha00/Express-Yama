var express = require('express')
const Deck = require('../schemas/deck')
const StandardDeck = require('../schemas/standardDeck')
const Revision = require('../schemas/revision')
const User = require('../schemas/user')
var router = express.Router()

router.post('/standard', async(req, res) => {
    const deck = new StandardDeck(req.body)
    try {
        await deck.save()
    } catch (err) {
        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
        return res.status(500).send(er)
    }

    return res.status(202).json({
        status: 202,
        ok: true,
        data: deck
    })
})

router.get('/standard', async(req, res) => {
    let deck = '';

    try {
        deck = await StandardDeck.find({})
    } catch (err) {
        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
        return res.status(500).send(er)
    }

    return res.status(202).json({
        status: 202,
        ok: true,
        data: deck
    })
})


router.get('/:id', async(req, res) => {
    const id = req.params.id
    let deck = await Deck.find({ _id: id });


    if (!deck) {
        return res.status(404).json({
            status: 404,
            message: 'Deck was not found.'
        })
    }
    return res.status(202).send({ status: 202, ok: true, data: deck })
})

router.get('/', async(req, res) => {

    try {
        let userId = res.locals.userID

        let user = await User.find({ _id: userId })
        let decks = await Deck.find({ user: userId })

        if (!decks) {
            return res.status(404).json({
                status: 404,
                message: 'No Deck found.'
            })
        }
        return res.status(202).json({
            status: 202,
            ok: true,
            data: {
                decks: decks,
                cardsToLearn: user.cardsToLearn || 0,
                totalRevisions: user.totalRevisions || 0,
                cardsToRevise: user.cardsToRevise || 0
            }
        })

    } catch (err) {
        console.log(err)
    }
})

router.post('/', async(req, res) => {

    const user = res.locals.userID
    req.body.user = user

    const deck = new Deck(req.body)
    try {
        await deck.save()
    } catch (err) {
        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
        return res.status(500).send(er)
    }

    return res.status(202).json({
        status: 202,
        ok: true,
        data: deck
    })
})

router.post('/addCard/:id', async(req, res) => {

    const id = req.params.id
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            status: 400,
            data: "Id is not valid"
        })
    }

    try {
        const deck = await Deck.findOneAndUpdate({ _id: id }, { $push: { cards: req.body } }, { new: true, runValidators: true, context: 'query' });

        if (!deck) {
            return res.status(404).json({
                status: 404,
                message: 'Deck was not found.'
            })
        }
        return res.status(202).json({
            status: 202,
            ok: true,
            data: deck
        })

    } catch (err) {
        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
    }


})

router.get('/card/:id', async(req, res) => {

    const id = req.params.id
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            status: 400,
            data: "Id is not valid"
        })
    }

    try {
        const deck = await Deck.find({ _id: id });

        if (!deck) {
            return res.status(404).json({
                status: 404,
                message: 'Deck was not found.'
            })
        }
        return res.status(202).json({
            status: 202,
            ok: true,
            data: deck
        })

    } catch (err) {
        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
    }
})

router.delete('/removeCard/:deckid/:id', async(req, res) => {

    const id = req.params.id
    const deckid = req.params.deckid

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            status: 400,
            data: "Id is not valid"
        })
    }

    try {
        const deck = await Deck.findOneAndUpdate({ _id: deckid }, { $pull: { cards: { _id: id } } }, { new: true, runValidators: true, context: 'query' });

        if (!deck) {
            return res.status(404).json({
                status: 404,
                message: 'Deck was not found.'
            })
        }
        return res.status(202).json({
            status: 202,
            ok: true,
            data: deck
        })

    } catch (err) {
        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }
    }


})

router.patch('/:id', async(req, res) => {
    try {
        const id = req.params.id
        const newDeck = req.body

        let deck = await Deck.update({ _id: id }, { $set: { cards: newDeck.cards } }, { runValidators: true });


        if (!deck) {
            return res.status(404).json({
                status: 404,
                message: 'Deck was not found.'
            })
        }

        return res.status(200).send({ ok: true, status: 200, data: deck })
    } catch (err) {
        return res.status(500).send(err)
    }
})



module.exports = router