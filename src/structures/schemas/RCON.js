const { model, Schema } = require('mongoose');

module.exports = model('rcons', new Schema({
    IP: String,
    Port: Number,
    Pass: String,
    Channel: String,
}));    