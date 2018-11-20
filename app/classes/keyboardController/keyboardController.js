// @flow
import { orderBy, remove } from 'lodash'


class Keyboard {

  subscriptions: Array<Object>

  subscribe: Function
  getSubscriptions: Function
  unsubscribe: Function

  _onKeyDown: Function
  _onKeyUp: Function
  _onKeyPress: Function

  constructor() {
    this.subscriptions = []

    window.addEventListener('keydown', (evt) => { this._onKeyDown(evt) })
    window.addEventListener('keyup', (evt) => { this._onKeyUp(evt) })
    window.addEventListener('keypress', (evt) => { this._onKeyPress(evt) })
  }


  _onKeyDown(evt: Object): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      if (this.subscriptions[i].event === 'keydown') {
        this.subscriptions[i].callbackFn(evt)
      }
    }
  }


  _onKeyUp(evt: Object): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      if (this.subscriptions[i].event === 'keyup') {
        this.subscriptions[i].callbackFn(evt)
      }
    }
  }


  _onKeyPress(evt: Object): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      if (this.subscriptions[i].event === 'keypress') {
        this.subscriptions[i].callbackFn(evt)
      }
    }
  }


  subscribe (name: string, callbackFn: Function, event: string, priority: number): void {
    this.subscriptions.push({
      name: name,
      callbackFn: callbackFn,
      event: event,
      priority: priority
    })

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

export default Keyboard
