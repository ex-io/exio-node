const Client = require("../../lib");

exports.command = "insert <side> <symbol> <price> <size>";
exports.desc = "Insert an order for the given symbol at a given price and size";
exports.handler = argv => {
  if (!argv.apiKey || !argv.apiSecret || !argv.apiPassphrase)
    throw new Error("API key, secret, and passphrase must be provided");

  const client = new Client({
    key: argv.apiKey,
    secret: argv.apiSecret,
    passphrase: argv.apiPassphrase,
    restApi: argv.restApi,
    websocketApi: argv.websocketApi
  });

  client.insertOrder(
    argv.symbol,
    argv.side,
    argv.price,
    argv.size,
    (err, data) => {
      if (err) return console.log(err);
      return console.log(data);
    }
  );
};
