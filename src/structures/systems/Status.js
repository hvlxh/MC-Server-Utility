const DB = require('../schemas/Status');

/**
 * 
 * @param {import('../lib/Client')} client 
 */
module.exports = (client) => {
    DB.find().then((docs) => {
        docs.forEach(async (doc) => {
            const channel = await client.channels.cache.get(doc.Channel);
            const message = await channel.messages.fetch(doc.Message);
            const def = setInterval(() => {
                require('../functions/Status')(doc.IP, doc.Port, doc.Type, doc.Edition, message, client);
            }, 60000)
            const nam = `${doc.IP}:${doc.Port}`;
            let obj = {};
            obj[nam] = def;
            client.serversInveral.push(obj);
        });
    });
};