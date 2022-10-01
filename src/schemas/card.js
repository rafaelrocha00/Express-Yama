const mongoose = require('mongoose')
let Schema = mongoose.Schema

let cardSchema = new Schema({

    frontText: {
        type: String,
        required: [true, 'Front text is required']
    },

    backText: {
        type: String,
        required: [true, 'Back text is required']
    },

    revisions: {
        type: Number
    },

    successes: {
        type: Number
    },

    mistakes: {
        types: Number
    },

    grade: {
        types: Number
    },

    meanings: {
        type: Array
    },

    frequence: {
        type: Number
    },

    strokes: {
        type: Number
    }

}, { timestamps: true })
let Card = mongoose.model('card', cardSchema)

module.exports = Card