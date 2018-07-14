const Client = require("../../lib");

exports.command = "subscribe <symbol>";
exports.desc = "Subscribe to a given trading symbol";
exports.handler = argv => {
  const client = new Client({
    key: argv.apiKey,
    secret: argv.apiSecret,
    passphrase: argv.apiPassphrase,
    restApi: argv.restApi,
    websocketApi: argv.websocketApi
  });

  const channels = ["books"];
  if (argv.apiKey && argv.apiSecret) {
    channels.push("orders");
  }

  const stream = client.subscribe(channels, argv.symbol);
  stream.on("message", data => {
    console.log(data);
  });
};
