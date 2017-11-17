/**
 * Test for WSignalWs.
 * Runs with mocha.
 */
'use strict'

const WSignalWs = require('../lib/WSignalWs')
const {ok, equal} = require('assert')
const asleep = require('asleep')
const aport = require('aport')

describe('w-signal-ws', function () {
  this.timeout(9000)
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    ok(WSignalWs)
    const port = await aport()

    const signal01 = new WSignalWs()
    const signal02 = new WSignalWs.Client()
    const signal03 = new WSignalWs.Client()

    await signal01.open({port})
    await signal02.open({port})
    await signal03.open({port})

    {
      class HeyPerson {
        async greet (msg) {
          return `Hey, ${msg}`
        }
      }

      signal01.load(HeyPerson, 'john')
      signal02.load(HeyPerson, 'tom')
    }

    {
      const john = await signal03.use('john')
      const tom = await signal03.use('tom')
      equal(await john.greet('Nice day'), 'Hey, Nice day')
      equal(await tom.greet('Nice day'), 'Hey, Nice day')
    }

    await asleep(100)

    await signal01.close()
    await signal02.close()
    await signal03.close()

  })
})

/* global describe, before, after, it */
