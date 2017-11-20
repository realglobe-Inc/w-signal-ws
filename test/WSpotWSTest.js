/**
 * Test for WSpotWS.
 * Runs with mocha.
 */
'use strict'

const WSpotWS = require('../lib/WSpotWS')
const {ok, equal} = require('assert')
const asleep = require('asleep')
const aport = require('aport')

describe('w-spot-ws', function () {
  this.timeout(9000)
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    ok(WSpotWS)
    const port = await aport()

    const spot01 = new WSpotWS()
    const spot02 = new WSpotWS.Client()
    const spot03 = new WSpotWS.Client()

    await spot01.listenAsServer(port)
    await spot02.connectAsClient(`http://localhost:${port}`)
    await spot03.connectAsClient(`http://localhost:${port}`)

    {
      class HeyPerson {
        async greet (msg) {
          return `Hey, ${msg}`
        }
      }

      spot01.load(HeyPerson, 'john')
      spot02.load(HeyPerson, 'tom')
    }

    {
      const john = await spot03.use('john')
      const tom = await spot03.use('tom')
      equal(await john.greet('Nice day'), 'Hey, Nice day')
      equal(await tom.greet('Nice day'), 'Hey, Nice day')
    }

    await asleep(100)

    await spot01.close()
    await spot02.close()
    await spot03.close()

  })
})

/* global describe, before, after, it */
