const Client = require("../../lib");

exports.command = "funds";
exports.desc = "Get funds for all symbols";
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

  client.getFunds((err, data) => {
    if (err) return console.log(err);
    return console.log(data);
  });
};
