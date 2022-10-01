const mongoose = require('mongoose')
let Schema = mongoose.Schema

let textEntrySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Text Entry requires a name']
    },

    text: {
        type: String
    },

}, { timestamps: true })
let TextEntry = mongoose.model('TextEntry', textEntrySchema)

module.exports = TextEntry