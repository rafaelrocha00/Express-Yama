const mongoose = require('mongoose')
let Schema = mongoose.Schema

let revisionSchema = new Schema({

    date: {
        type: Date
    },

    total: {
        type: Number
    },

})
let Revision = mongoose.model('revision', revisionSchema)

module.exports = Revision