//@flow

let currentHourCount: number = 0
let currentTickCount: number = 0

const TICK_INTERVAL: number = 100
const TICK_CAP: number = 24
let TICKER: ?number = 0

const start = (val?: number) => {
    if (val) {
      setTickCount(val)
    }

    TICKER = setInterval(incrementTickCount, TICK_INTERVAL)
}

const pause = () => {
  TICKER = clearInterval()
}

const resume = () => {
  TICKER = setInterval(incrementTickCount, TICK_INTERVAL)
}

const stop = () => {
  TICKER = null
}

const incrementTickCount = () => {
  currentTickCount++
  checkForHourIncrement()
  console.log('tick ', currentTickCount)
  return null
}

const getTIckCount = (): number => {
  return currentTickCount
}

const setTickCount = (val: number) => {
  currentTickCount = val
  return null
}


const checkForHourIncrement = () => {
  if ( currentTickCount === TICK_CAP) {
    incrementHourCount()
    setTickCount(0)
  }
}

const incrementHourCount = () => {
  currentHourCount++
  console.log('hour ', currentHourCount)
}

const timeController = {
  start: start,
  pause: pause,
  resume: resume,
  stop: stop,
  incrementTickCount: incrementTickCount,
  getTIckCount: getTIckCount,
  setTickCount: setTickCount,
}

module.exports = timeController





// doTick = () => {
//   currentTickCount++
//   checkForHourUpdate()
// }
//
// checkForHourUpdat = () => {
//   if (currentTickCount > 23) {
//     currentHour++
//     currentTick
//   }
// }
