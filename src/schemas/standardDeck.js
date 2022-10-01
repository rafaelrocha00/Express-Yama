const mongoose = require('mongoose')
const Card = require('./card')
let Schema = mongoose.Schema

let standardDeckSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Standard Deck requires a name field']
    },

    standardDeck: {
        type: Boolean
    },

    cards: [Card.schema]

}, { timestamps: true })
let StandardDeck = mongoose.model('StandardDeck', standardDeckSchema)

module.exports = StandardDeck