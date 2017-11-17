/**
 * Web socket implementation of w-signal
 * @module w-signal-ws
 */
'use strict'

const WSignalWs = require('./WSignalWs')
const create = require('./create')

const lib = create.bind(this)

Object.assign(lib, {
  WSignalWs,
  create
})

module.exports = lib
