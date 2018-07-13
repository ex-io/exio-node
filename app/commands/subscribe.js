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

  const books = client.subscribe(argv.symbol, "books");
  books.on("message", data => {
    console.log(data);
  });

  if (argv.apiKey && argv.apiSecret) {
    const orders = client.subscribe(argv.symbol, "orders");
    orders.on("message", data => {
      console.log(data);
    });
  }
};
