/**
 * @class WSpotWSClient
 */
'use strict'

const {WSpot} = require('w-spot')
const WebSocket = require('ws')
const uuid = require('uuid')
const {wsCall, wsProxy, wsAlive} = require('shiba-ws-util')
const {format: formatUrl} = require('url')

/** @lends WSpotWSClient */
class WSpotWSClient extends WSpot {
  constructor () {
    super(...arguments)
    const s = this
    s.keepAliveInterval = 3 * 1000
  }

  async connectAsClient (url) {
    const s = this
    if (typeof url === 'object') {
      url = formatUrl(Object.assign({
        protocol: 'http',
        hostname: 'localhost'
      }, url))
    }
    const ws = new WebSocket(url)
    await new Promise((resolve, reject) => {
      ws.on('open', async function onOpen () {
        wsProxy(ws, {
          async send (...args) {
            return s.send(...args)
          }
        })
        ws.on('close', async function onClose () {
          s.cleanupWS()
        })

        ws.invalidate = wsAlive(ws)
        const spot = {
          async send (...args) {
            return await wsCall(ws, uuid.v4(), 'send', [...args])
          },
          async connect () {
          }
        }
        await s.connect(spot)
        ws.on('close', async function onOpen () {
          await s.disconnect(spot)
        })
        resolve()
      })
      ws.on('error', (e) => reject(e))
    })
    s.ws = ws
    s.startKeepAliveTimer()
  }

  async close () {
    const s = this
    s.cleanupWS()
  }

  startKeepAliveTimer () {
    const s = this
    s.keepAliveTimer = setInterval(() => {
      const {ws} = s
      if (!ws) {
        return
      }
      ws.invalidate()
    }, s.keepAliveInterval)
  }

  stopKeepAliveTimer () {
    const s = this
    clearInterval(s.keepAliveTimer)
    s.keepAliveTimer = null
  }

  cleanupWS () {
    const s = this
    if (s.keepAliveTimer) {
      s.stopKeepAliveTimer()
    }
    if (s.ws) {
      s.ws.close()
      s.ws = null
    }
  }
}

module.exports = WSpotWSClient
