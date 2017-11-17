/**
 * Define signal proxy
 * @function spotProxy
 */
'use strict'

const {WSpot} = require('w-spot')

/** @lends spotProxy */
function spotProxy (ws) {
  const call = async (method, params) => {
    const id = WSpot.newId()
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

  class WSpotWSProxy extends WSpot {
    async send (...params) {
      return call('send', params)
    }

    async ask (...params) {
      return call('ask', params)
    }
  }

  return new WSpotWSProxy()
}

module.exports = spotProxy