const TimeClass = require('./../classes/time')
const clearConsole = require('clear-console')

function consoleTick( val ) {
  console.log('tick value ', val)
}


const xis = new TimeClass({
  onTick: consoleTick
})

// xis.start()
// xis.stop()
const a =  setTimeout( xis.pause, 5000)
