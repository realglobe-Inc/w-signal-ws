/**
 * Web socket implementation of w-spot
 * @module w-spot-ws
 */
'use strict'

const WSpotWs = require('./WSpotWs')
const create = require('./create')

const lib = create.bind(this)

Object.assign(lib, {
  WSpotWs,
  create
})

module.exports = lib
