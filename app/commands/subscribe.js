const Client = require("../../lib");

exports.command = "subscribe <symbol> [channels..]";
exports.desc = "Subscribe to a given trading symbol";
exports.handler = argv => {
  const client = new Client({
    key: argv.apiKey,
    secret: argv.apiSecret,
    passphrase: argv.apiPassphrase,
    restApi: argv.restApi,
    websocketApi: argv.websocketApi
  });

  const channels = argv.channels;
  if (!channels.length) {
    channels.push("books");
    if (argv.apiKey && argv.apiSecret && argv.apiPassphrase) {
      channels.push("orders");
    }
  }

  const stream = client.subscribe(channels, argv.symbol);
  stream.on("message", data => {
    console.log(data);
  });

  stream.on("close", (err) => {
    console.log("websocket closed ", err);
  });

  stream.on("error", err => {
    console.log(err);
  });
};
