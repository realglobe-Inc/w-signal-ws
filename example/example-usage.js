'use strict'

const wSpotWS = require('w-spot-ws')

async function tryExample () {
  // Create multiple spot
  const NewYork = wSpotWS.client()
  const HongKong = wSpotWS()
  const Japan = wSpotWS.client()

  const port = 8080

  await HongKong.listenAsServer(port)
  await NewYork.connectAsClient({port})
  await Japan.connectAsClient({port})

  {
    class Person {
      async hi (msg) {
        return `hi, ${msg}`
      }
    }

    // Create a instance to a spot
    const john = NewYork.load(Person, 'john')
    await john.hi('I am in NewYork!')
  }

  {
    // Use remote instance
    const john = Japan.use('john')
    await john.hi('Calling from Japan!')
  }

}

tryExample().catch((err) => console.error(err))
