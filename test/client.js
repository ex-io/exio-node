const assert = require("chai").assert;
const Client = require("../lib");

const invalid = {
  key: "invalid",
  secret: "invalid",
  passphrase: "invalid",
  domain: "sandbox.ex.io"
};

describe("test client", () => {
  it("can be instantiated correctly", done => {
    const client = new Client();
    done();
  });

  it("can subscribe to public market data", done => {
    const client = new Client({
      websocketApi: "wss://feed.sandbox.ex.io"
    });

    const books = client.subscribe("books", "btc-usdt");
    books.on("message", data => {
      books.close();
      done();
    });
  });

  it("fails to subscribe to private market data", done => {
    const client = new Client(invalid);
    const books = client.subscribe("books", "btc-usdt");
    books.on("message", data => {
      books.close();
      done();
    });
  });

  it("receives unauthorized on insertOrder", done => {
    const client = new Client(invalid);
    client.insertOrder("btc-usdt", "buy", "1.00", "1.00", (err, data) => {
      assert.exists(err);
      done();
    });
  });

  it("receives unauthorized on cancelOrder", done => {
    const client = new Client(invalid);
    client.cancelOrder("btc-usdt", 0, (err, data) => {
      assert.exists(err);
      done();
    });
  });

  it("receives unauthorized on getFunds", done => {
    const client = new Client(invalid);
    client.getFunds((err, data) => {
      assert.exists(err);
      done();
    });
  });

  it("receives unauthorized on getOpen", done => {
    const client = new Client(invalid);
    client.getOpen("btc-usdt", (err, data) => {
      assert.exists(err);
      done();
    });
  });
});
