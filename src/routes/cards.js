var express = require('express')
const Deck = require('../schemas/deck')

var router = express.Router()

router.get('/:name', async function(req, res) {
    const name = req.params.name
    const userId = res.locals.userID

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            status: 400,
            data: "Id is not valid"
        })
    }

    try {
        const decks = await Deck.find({ user: userId });

        if (!decks) {
            return res.status(404).json({
                status: 404,
                message: 'No Deck found.'
            })
        }


        let card = 0
        decks.forEach(deck => {
            card = deck.cards.find(card => card.frontText === name) || card
        })

        card.mistakes = card.mistakes || 0
        card.successes = card.successes || 0
        card.revisions = card.revisions || 0

        if (card) {
            return res.status(202).json({
                status: 202,
                ok: true,
                message: card
            })
        }

        return res.status(404).json({
            status: 404,
            message: 'card not found'
        })

    } catch (err) {
        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }

            return res.status(400).json(errArry)
        }

        return res.status(500).json({ status: 500, err })
    }
})

module.exports = router