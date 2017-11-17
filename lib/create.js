/**
 * Create a WSignalWs instance
 * @function create
 * @param {...*} args
 * @returns {WSignalWs}
 */
'use strict'

const WSignalWs = require('./WSignalWs')

/** @lends create */
function create (...args) {
  return new WSignalWs(...args)
}

module.exports = create
