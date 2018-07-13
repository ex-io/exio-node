const Client = require("../../lib");

exports.command = "cancel <symbol> [oid]";
exports.desc =
  "If `oid` is non-zero, cancels order associated with `oid`, else cancels all open orders for the given symbol";
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

  client.cancelOrder(argv.symbol, argv.oid ? argv.oid : 0, (err, data) => {
    if (err) return console.log(err);
    return console.log(data);
  });
};
