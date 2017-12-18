/**
 * @class WSpotWSServer
 */
'use strict'

const {WSpot} = require('w-spot')
const {wsCall, wsProxy, wsAlive} = require('shiba-ws-util')
const uuid = require('uuid')
const WebSocket = require('ws')
const debug = require('debug')('w:spot:ws:server')

/** @lends WSpotWSServer */
class WSpotWSServer extends WSpot {
  constructor () {
    super(...arguments)
    const s = this
    s.keepAliveInterval = 3 * 1000
  }

  async listenAsServer (port) {
    const s = this
    if (s.wss) {
      throw new Error(`Already open!`)
    }
    s.wss = new WebSocket.Server({port})
    s.wss.on('connection', async function onConnection (ws) {
      ws.invalidate = wsAlive(ws)
      wsProxy(ws, {
        async send (...args) {
          return s.send(...args)
        }
      })
      const spot = {
        async send (...args) {
          return await wsCall(ws, uuid.v4(), 'send', [...args])
        },
        async connect (...args) {
        }
      }
      await s.connect(spot)
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