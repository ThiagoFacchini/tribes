// @flow
import { orderBy, remove } from 'lodash'

const DEFAULT_TICK_SPEED = 600

class Ticker {

  tickSpeed: number
  subscriptions: Array<Object>
  shouldTick: boolean

  _tick: Function

  start: Function
  stop: Function
  setTickSpeed: Function
  getTickSpeed: Function
  subscribe: Function
  getSubscriptions: Function
  unsubscribe: Function


  constructor (tickSpeed?: number = DEFAULT_TICK_SPEED) {
    this.tickSpeed = tickSpeed
    this.subscriptions = []
  }


  _tick () {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].callbackFn()
    }
    // console.log(`all subcribers ticked (${this.subscriptions.length})`)

    if (this.shouldTick) {
      window.setTimeout( () => { this._tick() }, this.tickSpeed )
    }
  }


  start () {
    this.shouldTick = true
    this._tick()
  }


  stop () {
    this.shouldTick = false
  }


  subscribe (name: string, callbackFn: Function, priority: number): void {
    this.subscriptions.push(
      {
        name: name,
        callbackFn: callbackFn,
        priority: priority
      }
    )

    this.subscriptions = orderBy(this.subscriptions, 'priority', 'asc')
  }


  getSubscriptions (): Array<Object> {
    return this.subscriptions
  }


  unsubscribe (name: string): void {
    this.subscriptions = remove(this.subscriptions, (subscription) => {
      return subscription.name === name
    })
  }


}

export default Ticker
