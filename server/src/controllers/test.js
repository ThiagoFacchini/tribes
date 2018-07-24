//@flow

const TimeClass = require('./../classes/time')
const clearConsole = require('clear-console')

function consoleOnTick (val) {
  console.log('Ticked. TickCount =>', val)
}

function consoleTickerStart () {
  console.log('Ticker started.')
}

function consoleTickerPause (val) {
  console.log('Ticker paused. Elapsed loop time', val)
}

function consoleTickerResume (val) {
  console.log('Ticker resumed. Time left for loop completion =>', val, 'ms')
}

function consoleTickerStop () {
  console.log('Ticker stoped.')
}


const xis = new TimeClass({
  onStart: consoleTickerStart,
  onPause: consoleTickerPause,
  onResume: consoleTickerResume,
  onStop: consoleTickerStop,
  onTick: consoleOnTick,
})

xis.start()
setTimeout( xis.pause, 4500)
setTimeout( xis.resume, 6000)
setTimeout( xis.stop, 10000)
