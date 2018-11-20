// @flow
import { isFunction } from 'lodash'
import Browser from './../browser/Browser'


const GRID_SIZE = 24
const DEFAULT_GLOBAL_ALPHA = 1
const DEFAULT_STROKE_TICKNESS = 1
const DEFAULT_TEXT_FONT = 'Arial'
const DEFAULT_TEXT_FONT_SIZE = 10


class CanvasController {

  canvas: any
  context: any

  _setDefaults: Function
  _setCanvasSize: Function

  getCanvasSize: Function

  drawRect: Function
  drawStrokeRect: Function
  drawImage: Function
  drawText: Function

  measureText: Function

  clearContext: Function

  // Callbacks
  onCanvasResize: Function


  constructor(canvasId?: string = 'canvas') {
    this.canvas = document.createElement("canvas")
    this.canvas.id = canvasId

    // $FlowFixMe
    document.body.appendChild(this.canvas)

    this._setCanvasSize()

    this.canvas.style.position = 'absolute'
    this.canvas.style.top = 0
    this.canvas.style.left = 0

    this.context = this.canvas.getContext('2d')

    window.addEventListener('resize', () => {
      this._setCanvasSize()
      
      if (this.onCanvasResize != null && isFunction(this.onCanvasResize)) {
        this.onCanvasResize({
          width: this.canvas.width,
          height: this.canvas.height
        })
      }
    })
  }


  _setDefaults () {
    this.context.globalAlpha = DEFAULT_GLOBAL_ALPHA
    this.context.lineWidth = DEFAULT_STROKE_TICKNESS
  }


  _setCanvasSize () {
    this.canvas.width = Browser.getWidth()
    this.canvas.height = Browser.getHeight()
  }


  getCanvasSize (): Object {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    }
  }


  drawRect (x: number, y: number, width: number, height: number, fillColor: string, opacity?: number): void {
    if (opacity) this.context.globalAlpha = opacity

    this.context.fillStyle = fillColor
    this.context.fillRect(x, y, width, height)

    this._setDefaults()
  }


  drawStrokeRect (x: number, y: number, width: number, height: number, strokeColor?: string, strokeThickness?: number, opacity?: number): void {
    if (opacity) this.context.globalAlpha = opacity
    if (strokeColor) this.context.strokeStyle = strokeColor
    if (strokeThickness) this.context.lineWidth = strokeThickness

    this.context.strokeRect(x, y, width, height)
    this._setDefaults()
  }


  drawImage (image: any, coordX: number, coordY: number, width: number, height: number, opacity?: number): void {
    if (opacity) this.context.globalAlpha = opacity

    this.context.drawImage(image, coordX, coordY, width, height)
    this._setDefaults()
  }


  drawText (text: string, x: number, y: number, fontColor: string, font?: string, fontSize?: number, strokeColor?: string, strokeThickness?: number, opacity?: number): void {
    let textFont

    if (opacity) this.context.globalAlpha = opacity

    if (fontSize) {
      textFont = `${fontSize}px `
    } else {
      textFont = `${DEFAULT_TEXT_FONT_SIZE}px `
    }

    if (font) {
      textFont += font
    } else {
      textFont += DEFAULT_TEXT_FONT
    }

    this.context.font = textFont
    this.context.fillStyle = fontColor

    if (strokeColor && strokeThickness) {
      this.context.strokeStyle = strokeColor
      this.context.lineWidth = strokeThickness
      this.context.strokeText(text, x, y)
    }

    this.context.fillText(text, x, y)
    this._setDefaults()
  }


  measureText (text: string, font?: string, fontSize?: number, strokeThickness?: number): Object {
    const body = document.getElementsByTagName('body')[0]
    const dummy = document.createElement('div')
    const dummyText = document.createTextNode(text)

    dummy.appendChild(dummyText)

    if (font) {
      dummy.style.fontFamily = font
    } else {
      dummy.style.fontFamily = DEFAULT_TEXT_FONT
    }

    if (fontSize) {
      dummy.style.fontSize = `${fontSize}px`
    } else {
      dummy.style.fontSize = `${DEFAULT_TEXT_FONT_SIZE}px`
    }

    dummy.style.position = 'absolute'
    dummy.style.top = '0'
    dummy.style.left = '0'

    body.appendChild(dummy)

    const height = dummy.offsetHeight;
    const width = dummy.offsetWidth;

    body.removeChild(dummy)

    return {
      height: height,
      width: width
    }
  }


  clearContext(): void {
    this.context.fillStyle = '#000000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

export default CanvasController
