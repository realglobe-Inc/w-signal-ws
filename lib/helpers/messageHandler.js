/**
 * Define messageHandler
 * @function messageHandler
 */
'use strict'

/** @lends messageHandler */
function messageHandler (ws, target) {
  return async function onMessage (message) {
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
}

module.exports = messageHandler
