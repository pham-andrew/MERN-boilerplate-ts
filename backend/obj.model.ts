var mongoose = require('mongoose')
const Schema = mongoose.Schema

const objSchema = new Schema({
    id: Schema.Types.ObjectId,
    text: Schema.Types.String,
    time: Schema.Types.Date
})

const Obj = mongoose.model('Obj', objSchema)
module.exports = Obj