#!/usr/bin/env node

const argv = require("yargs")
  .env("EX")
  .default("restApi", "https://api.sandbox.ex.io")
  .default("websocketApi", "wss://feed.sandbox.ex.io")
  .describe(
    "apiKey",
    "API key generated from ex.io website; required for authenticated endpoints"
  )
  .describe(
    "apiSecret",
    "API secret generated from ex.io website; required for authenticated endpoints"
  )
  .describe(
    "apiPassphrase",
    "API passphrase entered into ex.io website; required for authenticated endpoints"
  )
  .commandDir("commands")
  .demandCommand()
  .help("h")
  .alias("h", "help").argv;
