/**
 * Create a WSpotWS instance
 * @function create
 * @param {...*} args
 * @returns {WSpotWS}
 */
'use strict'

const WSpotWS = require('./WSpotWS')

/** @lends create */
function create (...args) {
  return new WSpotWS(...args)
}

Object.assign(create, {
  server (...args) {
    return new WSpotWS.Server(...args)
  },
  client (...args) {
    return new WSpotWS.Client(...args)
  }
})
module.exports = create
