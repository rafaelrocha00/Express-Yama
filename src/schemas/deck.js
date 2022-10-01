const mongoose = require('mongoose')
const Card = require('./card')
let Schema = mongoose.Schema

let deckSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'Deck requires a user field']
    },

    name: {
        type: String,
        required: [true, 'Deck requires a name field']
    },

    cards: [Card.schema]

}, { timestamps: true })
let Deck = mongoose.model('deck', deckSchema)

module.exports = Deck