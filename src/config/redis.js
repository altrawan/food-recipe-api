const redis = require('redis');
const { RDS_URL } = require('../helpers/env');

const client = redis.createClient({
  url: RDS_URL,
});

(async () => {
  await client.connect();
})();

// const client = redis.createClient();

client.on('error', (err) => console.log(`Redis Client Error : ${err}`));
client.on('connect', () => console.log(`You're now connected db redis`));

module.exports = client;
