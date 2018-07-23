//@flow
type PropTypes = {
  initialTickCount?: number,
  tickInterval? : number,
  tickCap?: number,
  tickIncrement?: number,
  onTick?: () => void,
  onTickCap?: () => void
}

class Time<PropTypes> {

  _props: Object
  tickCount: number
  ticker: any

  start: Function
  incrementTickCount: Function


  constructor (options: PropTypes) {

    const defaults = {
      initialTickCount: 0,
      tickInterval: 100,
      tickCap: 24,
      tickIncrement: 1,
      onTick: () => {},
      onTickCap: () => {}
    }

    this._props = Object.assign(defaults, options)

    this.tickCount = this._props.initialTickCount

    this.start = this.start.bind(this)
    this.incrementTickCount = this.incrementTickCount.bind(this)
  }

  /**
   * Starts the Ticker
   */
  start (): void {
    this.ticker = setInterval(this.incrementTickCount, this._props.tickInterval)
  }

  /**
   * Pauses the Ticker
   * @TODO - Not fully implemented, ideally this method would store the time
   * elapsed from the previous cycled, so it could be resumed.
   */
  pause (): void {
    console.log('called')
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
    this.ticker = setInterval(this.incrementTickCount, this._props.tickInterval)
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
    this.tickCount += this._props.tickIncrement
    this._props.onTick(this.tickCount)
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

module.exports = Time
