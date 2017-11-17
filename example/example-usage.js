'use strict'

const wSignalWs = require('w-signal-ws')

async function tryExample () {
  const signal = await wSignalWs()
}

tryExample().catch((err) => console.error(err))
