//@flow

const DEFAULTS = {
  INITIAL_TICK_COUNT: 0,
  TICK_INTERVAL: 100,
  TICK_CAP: 24,
  TICK_INCREMENT: 1
}

class TimeController {
  tickCount: number
  ticker: ?number

  start: Function
  incrementTickCount: Function


  constructor (startVal?:number) {
      if (startVal) {
        this.tickCount = startVal
      } else {
        this.tickCount = DEFAULTS.INITIAL_TICK_COUNT
      }
  }

  /**
   * Starts the Ticker
   */
  start (): void {
    this.ticker = setInterval(this.incrementTickCount, DEFAULTS.TICK_INTERVAL)
  }

  /**
   * Pauses the Ticker
   * @TODO - Not fully implemented, ideally this method would store the time
   * elapsed from the previous cycled, so it could be resumed.
   */
  pause (): void {
    if (this.ticker)
      clearInterval(this.ticker)
  }

  /**
   * Resumes the Ticker
   * @TODO - Not fully implemented, ideally this method would recover the time
   * elapsed from the previous cycle, and then resume from this point. Also
   * resume would only be available for started & paused TimeControllers
   */
  resume (): void {
    this.ticker = setInterval(this.incrementTickCount, DEFAULTS.TICK_INTERVAL)
  }

  /**
   * Stops the Ticker
   */
  stop (): void {
    if (this.ticker)
      clearInterval(this.ticker)
  }

  /**
   * Increments the Tick Count
   */
  incrementTickCount (): void {
    this.tickCount += DEFAULTS.TICK_INCREMENT
  }

  /**
   * Returns the current tickCount
   */
  getTickCount (): number {
    return this.tickCount
  }

  /**
   * Sets the tickCount
   * @type {number} New tickCount
   */
  setTickCount (val: number): void {
    this.tickCount = val
  }
}
