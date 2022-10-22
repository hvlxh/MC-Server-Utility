const { model, Schema } = require('mongoose');

module.exports = model('statues', new Schema({
    IP: String,
    Port: Number,
    Type: String,
    Edition: String,
    Channel: String,
    Message: String,
}));    