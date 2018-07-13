const axios = require("axios");
const crypto = require("crypto");
const Websocket = require("ws");

class Client {
  /**
   * Callback for handling HTTP request responses
   * @callback restCallback
   * @param {object} error - Object if an error occured, or null otherwise
   * @param {object} response - Object containing the HTTP response
   */

  /**
   * Construct a new Client instance
   * @param {object} config - Configuration object
   * @param {string} config.key - API key
   * @param {string} config.secret - API secret
   * @param {string} config.passphrase - API passphrase
   * @param {string} config.domain - Root API domain
   */
  constructor(config) {
    this.config = { ...config };
    this._restApi = this.config.restApi || `https://api.${config.domain}`;
    this._websocketApi =
      this.config.websocketApi || `wss://feed.${config.domain}`;
  }

  /**
   * Signs the given `obj` with the appropriate fields for authenticated access
   * @param {string} method - The type of http request, e.g. GET, POST, etc
   * @param {string} path - The endpoint path
   * @param {object} obj - Object to sign
   * @return {object} Signed object
   */
  sign(method, path, body, obj) {
    const timestamp = parseInt(Date.now() / 1000);
    let digest = timestamp + method.toUpperCase() + path;
    if (body) {
      digest += JSON.stringify(body);
    }
    const hmac = crypto.createHmac(
      "sha256",
      new Buffer(this.config.secret, "base64")
    );
    obj["ex-access-key"] = this.config.key;
    obj["ex-access-timestamp"] = timestamp;
    obj["ex-access-passphrase"] = this.config.passphrase;
    obj["ex-access-sign"] = hmac.update(digest).digest("base64");
    return obj;
  }

  /**
   * Inserts an order into the exchange with the given params
   * @param {string} symbol - Trading symbol
   * @param {string} side - Order side; "buy" or "sell"
   * @param {number} price - Limit price for the order
   * @param {number} size - Order quantity
   * @callback {restCallback} callback - Callback invoked after insert is submitted
   */
  insertOrder(symbol, side, price, size, callback) {
    const path = "/v1/orders";
    const data = {
      symbol: symbol,
      token: Date.now(),
      side: side,
      orderType: "limit",
      size: size.toString(),
      price: price.toString(),
      tif: "gtc",
      flags: 0
    };
    this._request("post", path, data, callback);
  }

  /**
   * Cancel a previously inserted order.
   * @param {string} symbol - Symbol the order is associated with
   * @param {string} oid - OrderId returned from a previously accepted order
   * @callback {restCallback} callback - Callback to handle response
   */
  cancelOrder(symbol, oid, callback) {
    const path = "/v1/orders";
    const data = {
      symbol: symbol,
      oid: oid
    };
    this._request("delete", path, data, callback);
  }

  /**
   * Retrieve funding information
   * @callback {restCallback} callback - Callback to handle response
   */
  getFunds(callback) {
    const path = "/v1/funds";
    this._request("get", path, null, callback);
  }

  /**
   * Retrieve open orders for a given symbol
   * @param {string} symbol - The symbol to get open orders for
   * @callback {restCallback} callback - Callback to handle response
   */
  getOpen(symbol, callback) {
    const path = `/v1/orders?symbol=${symbol}`;
    this._request("get", path, null, callback);
  }

  /**
   * Subscribe to the given channel for the given symbol
   * @param {string} symbol - The symbol to subscribe to
   * @param {string} channel - The channel to subsribe to
   * @return {object} WebSocket instance
   */
  subscribe(symbol, channel) {
    const msg = {
      type: "subscribe",
      channels: [
        {
          name: channel,
          symbols: [symbol]
        }
      ]
    };

    if (this.config.key) {
      this.sign("get", "/user/self/verify", null, msg);
    }

    const socket = new Websocket(this._websocketApi);
    socket.on("open", function() {
      socket.send(JSON.stringify(msg));
    });

    return socket;
  }

  _request(method, path, data, callback) {
    axios({
      method: method,
      url: this._restApi + path,
      data: data,
      headers: this.sign(method, path, data, {})
    })
      .then(res => {
        return callback(null, res.data);
      })
      .catch(err => {
        if (err.response) return callback(err.response.data);
        return callback(err);
      });
  }
}

module.exports = Client;
