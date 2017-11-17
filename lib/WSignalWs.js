/**
 * @class WSignalWs
 */
'use strict'

const {WSignal} = require('w-signal')
const WebSocket = require('ws')
const {format: formatUrl} = require('url')

const signalProxy = (ws) => {
  const call = async (method, params) => {
    const id = WSignal.newId()
    return new Promise((resolve, reject) => {
      function onMessage (message) {
        const data = JSON.parse(message)
        const isRes = data.type === 'res' && data.id === id
        if (isRes) {
          ws.removeListener('message', onMessage)
          const {error, result} = data
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      }

      ws.send(JSON.stringify({
        type: 'req',
        method,
        params,
        id
      }))

      ws.addListener('message', onMessage)
    })
  }

  class WSignalWsProxy extends WSignal {
    async send (...params) {
      return call('send', params)
    }

    async ask (...params) {
      return call('ask', params)
    }
  }

  return new WSignalWsProxy()
}

const messageHandler = (ws, target) => async function onMessage (message) {
  const data = JSON.parse(message)
  if (data.type === 'req') {
    const {method, params, id} = data
    const {result, error} = await target[method](...params)
      .then((result) => ({result}))
      .catch((error) => ({error}))
    ws.send(JSON.stringify({
      type: 'res',
      id,
      result,
      error
    }))
  }
}

/** @lends WSignalWs */
class WSignalWs extends WSignal {
  async open (options = {}) {
    const {port = 8080} = options
    const s = this
    if (s.wss) {
      throw new Error(`Already open!`)
    }
    s.wss = new WebSocket.Server({port})
    s.wss.on('connection', async function onConnection (ws) {
      const signal = signalProxy(ws)
      await s.connect(signal)
      ws.on('message', messageHandler(ws, s))
      ws.on('close', async function onOpen () {
        await s.disconnect(signal)
      })
    })
  }

  async close () {
    const s = this
    s.wss.close()
    s.wss = null
  }
}

class WSignalWsClient extends WSignal {
  async open (options = {}) {
    const s = this
    const {
      protocol = 'ws:',
      hostname = 'localhost',
      port = 8080
    } = options
    const ws = new WebSocket(formatUrl({
      protocol,
      hostname,
      port,
      slashes: true
    }))
    await new Promise((resolve, reject) => {
      ws.on('open', async function onOpen () {
        const signal = signalProxy(ws)
        await s.connect(signal)
        ws.on('close', async function onOpen () {
          await s.disconnect(signal)
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

Object.assign(WSignalWs, {
  Client: WSignalWsClient
})

module.exports = WSignalWs
