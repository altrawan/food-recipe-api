const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => console.log(`Redis Client Error : ${err}`));
// client.on('connect', () => console.log(`You're now connected db redis`));

client.connect();

module.exports = client;
