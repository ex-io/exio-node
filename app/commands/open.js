const Client = require("../../lib");

exports.command = "open <symbol>";
exports.desc = "Get open orders for a symbol";
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

  client.getOpen(argv.symbol, (err, data) => {
    if (err) return console.log(err);
    return console.log(data);
  });
};
