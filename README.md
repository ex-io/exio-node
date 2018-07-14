<p align="center">
  <img src="https://s3.amazonaws.com/sandbox-exio-static/email/email-header.png" alt="ex.io">
</p>
<p align="center">
  <h1 align="center">exio-node</h1>
</p>
<p align="center">
  <b>A minimal client library &amp; CLI demonstrating API usage</b>
</p>

[![Build Status](https://travis-ci.org/ex-io/exio-node.svg?branch=master)](https://travis-ci.org/ex-io/exio-node)
[![Coverage Status](https://img.shields.io/coveralls/github/ex-io/exio-node/master.svg)](https://coveralls.io/github/ex-io/exio-node?branch=master)

This project contains a minimal client library that wraps ex.io's API. In addition, it contains a command-line utility that you can use to drive the client library. This is intended to demonstrate basic API usage.

### Library Usage

In your node.js app, add `exio-node` as a dependency:

```
$ npm install --save exio-node
```

You can now import and instantiate a client object in your app.

#### Example

```javascript
const Client = require("exio-node");

// construct the client
const client = new Client({
  key: <YOUR-API-KEY>,                  // provide your api key
  secret: <YOUR-API-SECRET>,            // provide your api secret
  passphrase: <YOUR-API-PASSPHRASE>,    // provide your api passphrase
  domain: "sandbox.ex.io"               // use "ex.io" for production
});

// subscribe to orders and books channels for btc-usdt and eth-usdt
const socket = client.subscribe(["orders", "books"], ["btc-usdt", "eth-usdt"]);
socket.on("message", (data) => {
  console.log(data);
});

// insert an order
client.insertOrder("btc-usdt", "buy", "6000", "1", (err, data) => {
  console.log(err, data);
});
```

### CLI Usage

This repository comes bundled with a simple CLI app that you can use to run various operations. The CLI app is built on top of the library. You can execute the CLI remotely without downloading anything via `npx`:

```
$ npx exio-node subscribe btc-usdt
```

After running that command, you should see public market data for `btc-usdt` logged to your console. You can run various other commands documented below. Detailed usage for each command is available via `npx exio-node <command> -h`

Certain commands require authentication. To use these commands, you can provide your authentication credentials as environment variables, e.g.:

```
$ export EX_API_KEY=<YOUR-API-KEY>
$ export EX_API_SECRET=<YOUR-API-SECRET>
$ export EX_API_PASSPHRASE=<YOUR-API-PASSPHRASE>

$ npx exio-node subscribe btc-usdt
```

You can also specify your credentials directly via command-line instead of through environment variables, e.g:

```
$ npx exio-node --apiKey=<YOUR-API-KEY> --apiSecret=<YOUR-API-SECRET> --apiPassphrase=<YOUR-API-PASSPHRASE> subscribe btc-usdt
```

> Note: To get an API credentials, you must login to ex.io and create one from with your user settings.

The command-line utility defaults to using endpoints that are in the _sandbox_ environment, not production. Therefore, you should use API key, secret, and passphrases that were created from sandbox environment. If you want to use production endpoints, you can specificy them through the command-line:

```
$ npx exio-node --restApi=https://api.ex.io --websocketApi=wss://feed.ex.io subscribe btc-usdt
```

### Subscribe

The subscribe command will subscribe to the public `books` channel. If an API credentials are available, it will also subscribe to the private `orders` channel.

### Insert

The insert command will insert an order into the exchange. This command requires API credentials.

```
$ npx exio-node insert buy btc-usdt 4000 1
```

### Cancel

This cancel command will cancel all open orders for a particular symbol, or a particular order if given an order-id to cancel. This command requires you to provide an API credentials.

```
$ npx exio-node cancel btc-usdt
```

### Open

The open command will return all open orders you might have for a given symbol. This command requires API credentials.

```
$ npx exio-node open btc-usdt
```

### Funds

The funds command will return your balance information for all currencies. This command requiers API credentials.

```
$ npx exio-node funds
```
