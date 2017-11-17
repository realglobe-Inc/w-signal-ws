/**
 * @class WSpotWSClient
 */
'use strict'

const {WSpot} = require('w-spot')
const spotProxy = require('./helpers/spotProxy')
const messageHandler = require('./helpers/messageHandler')
const WebSocket = require('ws')
const {format: formatUrl} = require('url')


/** @lends WSpotWSClient */
class WSpotWSClient extends WSpot {
  async connectAsClient (config) {
    const s = this
    const {
      protocol = 'ws:',
      hostname = 'localhost',
      port = 8080
    } = config
    const ws = new WebSocket(formatUrl({
      protocol,
      hostname,
      port,
      slashes: true
    }))
    await new Promise((resolve, reject) => {
      ws.on('open', async function onOpen () {
        const spot = spotProxy(ws)
        await s.connect(spot)
        ws.on('close', async function onOpen () {
          await s.disconnect(spot)
        })
        ws.on('message', messageHandler(ws, s))
        resolve()
      })
      ws.on('error', (e) => reject(e))
    })
    s.ws = ws
  }

  async close () {
    const s = this
    s.ws.close()
  }
}

module.exports = WSpotWSClient
