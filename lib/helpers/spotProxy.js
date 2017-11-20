/**
 * Define signal proxy
 * @function spotProxy
 */
'use strict'

const {WSpot} = require('w-spot')

const callTypes = {
  RES: 'call:res',
  REQ: 'call:req'
}

/** @lends spotProxy */
function spotProxy (ws) {
  const call = async (method, params) => {
    const id = String(WSpot.newId())
    const isRes = (data) => data.type === callTypes.RES && String(data.id) === id
    return new Promise((resolve, reject) => {
      function onMessage (message) {
        const data = JSON.parse(message)
        if (isRes(data)) {
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
        type: callTypes.REQ,
        method,
        params,
        id
      }))

      ws.addListener('message', onMessage)
    })
  }

  class WSpotWSProxy extends WSpot {
    async send (...params) {
      return call('send', params)
    }

    async ask (...params) {
      return call('ask', params)
    }

    bindProxyTarget (target) {
      ws.on('message', async function onMessage (message) {
        const data = JSON.parse(message)
        if (data.type === callTypes.REQ) {
          const {method, params, id} = data
          const {result, error} = await target[method](...params)
            .then((result) => ({result}))
            .catch((error) => ({error}))
          ws.send(JSON.stringify({
            type: callTypes.RES,
            id,
            result,
            error
          }))
        }
      })
    }
  }

  return new WSpotWSProxy()
}

module.exports = spotProxy