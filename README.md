<h1 align="center">
  <br>
  <img src="https://s3.amazonaws.com/sandbox-exio-static/email/email-header.png" alt="ex.io">
  <br>
  exio-node
</h1>

<h4 align="center">A minimal client library demonstrating API usage</h4>
<br>

This project contains a minimal client library that wraps ex.io's API. In addition, it also contains a command-line utility that you can use to drive the client library.

### Library Usage

In your node.js app, add `exio-node` as a dependency:

```
$ npm install --save exio-node
```

#### Example

```
const Client = require("exio-node");

const client = new Client({
  key: <YOUR-API-KEY>,
  secret: <YOUR-API-SECRET>,
  passphrase: <YOUR-API-PASSPHRASE>,
  domain: "sandbox.ex.io", // use "ex.io" for production
})

// subscribe to orders channel
const orders = client.subscribe("btc-usdt", "orders");
orders.on("message", (data) => {
  console.log(data);
});

client.insertOrder("btc-usdt", "buy", "6000", "1", (err, data) => {
  console.log(err, data);
});
```

### CLI Usage

This package comes bundled with a simple CLI app that you can use to run various operations. The CLI app is built on top of the library.

First clone this repository to `/path/to/repo`, and then:

```
$ cd /path/to/repo
$ npm install
$ npm cli subscribe btc-usdt
```

You should see public market data for `btc-usdt` logged to your console. You can run various other commands documented below. Detailed usage for each command is available via `npm cli <command> -h`

Certain commands require authentication. To use these commands, you can provide your authentication credentials as environment variables, e.g.:

```
$ export EX_API_KEY=<YOUR-API-KEY>
$ export EX_API_SECRET=<YOUR-API-SECRET>
$ export EX_API_PASSPHRASE=<YOUR-API-PASSPHRASE>

$ npm cli subscribe btc-usdt
```

You can also specify your credentials directly via command-line instead of through environment variables, e.g:

```
$ yarn start --apiKey=<YOUR-API-KEY> --apiSecret=<YOUR-API-SECRET> --apiPassphrase=<YOUR-API-PASSPHRASE> subscribe btc-usdt
```

> Note: To get an API credentials, you must login to ex.io and create one from with your user settings.

The command-line utility defaults to using endpoints that are in the _sandbox_ environment, not production. Therefore, you should use API key, secret, and passphrases that were created from sandbox environment. If you want to use production endpoints, you can specificy them through the command-line:

```
$ yarn start --restApi=https://api.ex.io --websocketApi=wss://feed.ex.io subscribe btc-usdt
```

### Subscribe

The subscribe command will subscribe to the public `books` channel. If an API key and secret are available, it will also subscribe to the private `orders` channel.

### Insert

The insert command will insert an order into the exchange. This command requires you to provide an API key and secret.

Example (assumes you have your API key and secret already set):

```
$ npm cli insert buy btc-usdt 4000 1
```

### Cancel

This cancel command will cancel all open orders for a particular symbol, or a particular order if given an order-id to cancel. This command requires you to provide an API key and secret.

Example (assumes you have your API key and secret already set):

```
$ npm cli cancel btc-usdt
```
