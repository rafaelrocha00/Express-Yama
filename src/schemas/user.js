const mongoose = require('mongoose')
const Revision = require('./revision')
const TextEntry = require('./textEntry')

let Schema = mongoose.Schema

let userSchema = new Schema({
    username: {
        type: String
    },

    password: {
        type: String
    },

    totalRevisions: {
        type: Number
    },

    revisions: [Revision.schema],

    textEntries: [TextEntry.schema],

    cardsToLearn: {
        type: Number
    },

    cardsToRevise: {
        type: Number
    }

}, { timestamps: true })
let User = mongoose.model('user', userSchema)

module.exports = User