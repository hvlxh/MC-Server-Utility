const DB = require('../schemas/RCON');

/**
 * 
 * @param {import('../lib/Client')} client 
 */
module.exports = (client) => {
    DB.find().then((docs) => {
        docs.forEach(async (doc) => {
            client.rcons.set(doc.Channel, `${doc.IP}:${doc.Port}:${doc.Pass}`)
        });
    });
};