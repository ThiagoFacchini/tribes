//@flow
type PropTypes = {
  initialTickCount?: number,
  tickInterval? : number,
  tickCap?: number,
  tickIncrement?: number,
  onTick?: () => void,
  onTickCap?: () => void,
  onStart?: () => void,
  onPause?: () => void,
  onResume?: () => void,
  onStop?: () => void
}

class Time<PropTypes> {

  _props: Object
  tickCount: number
  ticker: any
  deltaOnLoopStart: number
  deltaOnLoopPause: number
  tickerState: 'running' | 'paused'

  start: Function
  incrementTickCount: Function
  pause: Function
  resume: Function
  stop: Function
  getTickCount: Function
  setTickCount: Function

  constructor (options: PropTypes) {

    const defaults = {
      initialTickCount: 0,
      tickInterval: 1000,
      tickCap: 24,
      tickIncrement: 1,
      onTick: () => {},
      onTickCap: () => {},
      onStart: () => {},
      onPause: () => {},
      onResume: () => {},
      onStop: () => {}
    }

    this._props = Object.assign(defaults, options)

    this.tickCount = this._props.initialTickCount

    // Binding functions
    this.start = this.start.bind(this)
    this.incrementTickCount = this.incrementTickCount.bind(this)
    this.pause = this.pause.bind(this)
    this.resume = this.resume.bind(this)
    this.stop = this.stop.bind(this)
    this.getTickCount = this.getTickCount.bind(this)
    this.setTickCount = this.setTickCount.bind(this)
  }

  /**
   * Starts the Ticker
   */
  start (): void {
    this.ticker = setInterval(this.incrementTickCount, this._props.tickInterval)
    this.tickerState = 'running'
    this._props.onStart()
  }

  /**
   * Pauses the Ticker
   * @TODO - Not fully implemented, ideally this method would store the time
   * elapsed from the previous cycled, so it could be resumed.
   */
  pause (): void {
    if (this.tickerState === 'running') {
      this.deltaOnLoopPause = new Date().getTime()
      clearInterval(this.ticker)
      this.tickerState = 'paused'
      const timeElapsed = this.deltaOnLoopPause - this.deltaOnLoopStart
      this._props.onPause(timeElapsed)
    }
  }

  /**
   * Resumes the Ticker
   * @TODO - Not fully implemented, ideally this method would recover the time
   * elapsed from the previous cycle, and then resume from this point. Also
   * resume would only be available for started & paused TimeControllers
   */
  resume (): void {
    if (this.tickerState === 'paused') {
      const dif = this.deltaOnLoopPause - this.deltaOnLoopStart
      const deltaTime = this._props.tickInterval - dif
      setTimeout( this.start, deltaTime)
      this._props.onResume(deltaTime)
    }
  }

  /**
   * Stops the Ticker
   */
  stop (): void {
    if (this.tickerState === 'running') {
      clearInterval(this.ticker)
      this._props.onStop()
    }
  }

  /**
   * Increments the Tick Count
   */
  incrementTickCount (): void {
    this.tickCount += this._props.tickIncrement
    this.deltaOnLoopStart = new Date().getTime()
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
