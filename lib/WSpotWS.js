/**
 * @class WSpotWS
 */
'use strict'

const {WSpot} = require('w-spot')
const WSpotWSServer = require('./WSpotWSServer')
const WSpotWSClient = require('./WSpotWSClient')

/** @lends WSpotWS */
class WSpotWS extends WSpotWSServer {

}

Object.assign(WSpotWS, {
  Client: WSpotWSClient,
  Server: WSpotWSServer
})

module.exports = WSpotWS
