/**
 * Create a WSpotWs instance
 * @function create
 * @param {...*} args
 * @returns {WSpotWs}
 */
'use strict'

const WSpotWs = require('./WSpotWs')

/** @lends create */
function create (...args) {
  return new WSpotWs(...args)
}

Object.assign(create, {
  server (...args) {
    return new WSpotWs.Server(...args)
  },
  client (...args) {
    return new WSpotWs.Client(...args)
  }
})
module.exports = create
