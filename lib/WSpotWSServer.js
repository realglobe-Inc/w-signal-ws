/**
 * @class WSpotWSServer
 */
'use strict'

const {WSpot} = require('w-spot')
const spotProxy = require('./helpers/spotProxy')
const WebSocket = require('ws')
const messageHandler = require('./helpers/messageHandler')

/** @lends WSpotWSServer */
class WSpotWSServer extends WSpot {
  async listenAsServer (port) {
    const s = this
    if (s.wss) {
      throw new Error(`Already open!`)
    }
    s.wss = new WebSocket.Server({port})
    s.wss.on('connection', async function onConnection (ws) {
      const spot = spotProxy(ws)
      await s.connect(spot)
      ws.on('message', messageHandler(ws, s))
      ws.on('close', async function onOpen () {
        await s.disconnect(spot)
      })
    })
  }

  async close () {
    const s = this
    s.wss.close()
    s.wss = null
  }
}

module.exports = WSpotWSServer