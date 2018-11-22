// @flow
import CanvasController from './../canvasController/canvasController'
import KeyboardController from './../keyboardController/keyboardController'
import AssetLoader from './../assetLoader/assetLoader'

const DEFAULT_TILE_SIZE = 48
const DEFAULT_TERRAIN_GRID_OPACITY = 0.8
const DEFAULT_VIEWPORT_RENDER_OFFSET = 2
const DEFAULT_VIEWPORT_MOVEMENT_DELAY = 400
const DEFAULT_VIEWPORT_MOVEMENT_STEPS = 48

class World {

  // Instances
  canvasController: any
  keyboardController: any

  // Map Related
  _mapCols: number
  _mapRows: number
  _viewPortWidth: number
  _viewPortHeight: number
  _viewPortMaxRows: number
  _viewPortMaxCols: number
  _viewPortPositionX: number
  _viewPortPositionY: number
  _viewPortTempOffsetX: number
  _viewPortTempOffsetY: number
  _viewPortMovementStepCount: number
  _viewPortTempOffsetIterator: any

  _tileSize: number

  // Layers
  _terrainLayer: Array<Array<?string>>
  _resourceLayer: Array<Array<?string>>
  _entityLayer: Array<Array<?string>>

  // Material Related
  gridOddTileMaterial: any
  gridEvenTileMaterial: any

  // FPS tracking
  _lastRenderCall: number
  _frameCount: number
  _framesPerSecond: number

  // Flags
  _shouldDrawGrid: boolean
  _shouldDrawCoordinates: boolean
  _shouldDrawDebug: boolean
  _isViewPortProcessingMovement: boolean


  // Private Methods
  _createLayer: Function
  _getMapRenderableSize: Function
  _getWorldRenderableCoords: Function
  _calcViewPortTempOffset: Function


  // Public Methods
  setTerrainTileMaterial: Function
  setViewPortPosition: Function
  getTerrainTileMaterial: Function
  getViewPortPosition: Function
  drawTerrainLayer: Function
  drawGridLayer: Function
  drawGridCoordinates: Function
  draw: Function
  debug: Function
  drawDebugInfo: Function


  constructor (rows?: number = 5, cols?: number = 10): void {
    this.canvasController = new CanvasController('canvas')
    this.keyboardController = new KeyboardController()

    this._mapRows = rows
    this._mapCols = cols
    this._tileSize = DEFAULT_TILE_SIZE

    this._viewPortWidth = this.canvasController.canvas.width
    this._viewPortHeight = this.canvasController.canvas.height
    this. _getMapRenderableSize()

    this._viewPortPositionX = 0
    this._viewPortPositionY = 0

    this._lastRenderCall = 0
    this._frameCount = 0
    this._framesPerSecond = 0

    this._terrainLayer = this._createLayer()
    this._resourceLayer = this._createLayer()
    this._entityLayer = this._createLayer()

    this._shouldDrawDebug = false
    this._shouldDrawGrid = false
    this._shouldDrawCoordinates = false

    this._isViewPortProcessingMovement = false
    this._viewPortMovementStepCount = 0
    this._viewPortTempOffsetY = 0
    this._viewPortTempOffsetX = 0

    this.canvasController.onCanvasResize = (canvasSize: Object) => {
      this._viewPortWidth = canvasSize.width
      this._viewPortHeight = canvasSize.height
      this._getMapRenderableSize()
    }
  }


  _createLayer (): Array<Array<?string>> {
    const layer = []

    for (let row = 0; row < this._mapRows; row++) {
      layer[row] = []

      for (let col = 0; col < this._mapCols; col++) {
        layer[row][col] = null
      }
    }

    return layer
  }


  _getMapRenderableSize (): void {
    this._viewPortMaxRows = Math.floor(this._viewPortHeight / this._tileSize)
    this._viewPortMaxCols = Math.floor(this._viewPortWidth / this._tileSize)
  }


  _calcViewPortTempOffset (viewPortMovement: Object): void {
    const fnInterval = Math.floor(DEFAULT_VIEWPORT_MOVEMENT_DELAY / DEFAULT_VIEWPORT_MOVEMENT_STEPS)
    const distancePerStep = Math.floor(this._tileSize / DEFAULT_VIEWPORT_MOVEMENT_STEPS)

    this._viewPortTempOffsetIterator = setInterval( ()=> {
      // Substracting 1 from the amount of steps because the last iteration do represent
      // the final position, therefore unecessary.
      if (this._viewPortMovementStepCount === (DEFAULT_VIEWPORT_MOVEMENT_STEPS -1)) {
        clearInterval(this._viewPortTempOffsetIterator)
        this._viewPortMovementStepCount = 0

        this._viewPortTempOffsetY = 0
        this._viewPortTempOffsetX = 0

        this._viewPortPositionY = viewPortMovement.newY
        this._viewPortPositionX = viewPortMovement.newX

      } else {
        if (viewPortMovement.newY > viewPortMovement.oldY) {
          this._viewPortTempOffsetY -= distancePerStep
        } else if (viewPortMovement.newY < viewPortMovement.oldY) {
          this._viewPortTempOffsetY += distancePerStep
        }

        if (viewPortMovement.newX > viewPortMovement.oldX) {
          this._viewPortTempOffsetX -= distancePerStep
        } else if (viewPortMovement.newX < viewPortMovement.oldX) {
          this._viewPortTempOffsetX += distancePerStep
        }

        this._viewPortMovementStepCount++
      }
    }, fnInterval)
  }


  setTerrainTileMaterial (row: number, col: number, material: string): void {
    if (row <= this._mapRows && col <= this._mapCols) {
      this._terrainLayer[row][col] = material
      return
    }
    throw new Error('x or y coordinates out of bounds.')
  }


  setViewPortPosition (x: number, y: number): void {
    if (this._isViewPortProcessingMovement === false) {
      this._isViewPortProcessingMovement = true

      window.setTimeout( () => {
        this._isViewPortProcessingMovement = false
      }, DEFAULT_VIEWPORT_MOVEMENT_DELAY)

      let newX, newY

      if (x >= 0 && ((x - DEFAULT_VIEWPORT_RENDER_OFFSET) + this._viewPortMaxRows) < this._mapRows) {
        newX = x
      } else {
        newX = this._viewPortPositionX
      }

      if (y >= 0 && ((y - DEFAULT_VIEWPORT_RENDER_OFFSET) + this._viewPortMaxCols) < this._mapCols) {
        newY = y
      } else {
        newY = this._viewPortPositionY
      }

      const viewPortMovement = {
        oldX: this._viewPortPositionX,
        newX: newX,
        oldY: this._viewPortPositionY,
        newY: newY
      }

      this._calcViewPortTempOffset(viewPortMovement)
    }
  }


  getTerrainTileMaterial (row: number, col: number): ?string {
    if (row <= this._mapRows && col <= this._mapCols) {
      return this._terrainLayer[row][col]
    }
    throw new Error('x or y coordinates out of bounds.')
  }


  getViewPortPosition(): Object {
    return {
      x: this._viewPortPositionX,
      y: this._viewPortPositionY
    }
  }


  _getWorldRenderableCoords(): Object {
    let startRow, startCol, endRow, endCol

    const startPosX = this._viewPortPositionX - DEFAULT_VIEWPORT_RENDER_OFFSET
    const startPosY = this._viewPortPositionY - DEFAULT_VIEWPORT_RENDER_OFFSET

    const endPosX = (this._viewPortPositionX + this._viewPortMaxRows + DEFAULT_VIEWPORT_RENDER_OFFSET)
    const endPosY = (this._viewPortPositionY + this._viewPortMaxCols + DEFAULT_VIEWPORT_RENDER_OFFSET)

    startPosX < 0 ? startRow = 0 : startRow = startPosX
    startPosY < 0 ? startCol = 0 : startCol = startPosY

    endPosX > this._mapRows ? endRow = this._mapRows : endRow = endPosX
    endPosY > this._mapCols ? endCol = this._mapCols : endCol = endPosY

    return {
      startRow: startRow,
      startCol: startCol,
      endRow: endRow,
      endCol: endCol
    }
  }


  drawTerrainLayer (): void {
    const renderableCoord = this._getWorldRenderableCoords()

    let rowCount = 0
    let colCount = 0

    for (let row = renderableCoord.startRow; row < renderableCoord.endRow; row++) {
      colCount = 0

      for (let col = renderableCoord.startCol; col < renderableCoord.endCol; col++) {
        if (this._terrainLayer[row][col] != null) {
          const imageSource = this._terrainLayer[row][col]

          let posX = (this._tileSize * rowCount) + this._viewPortTempOffsetX
          let posY = (this._tileSize * colCount) + this._viewPortTempOffsetY

          if (this._viewPortPositionX >= DEFAULT_VIEWPORT_RENDER_OFFSET) posX -= (DEFAULT_VIEWPORT_RENDER_OFFSET * this._tileSize)
          if (this._viewPortPositionY >= DEFAULT_VIEWPORT_RENDER_OFFSET) posY -= (DEFAULT_VIEWPORT_RENDER_OFFSET * this._tileSize)

          const sizeX = this._tileSize
          const sizeY = this._tileSize

          this.canvasController.drawImage(
            imageSource,
            posY,
            posX,
            sizeX,
            sizeY
          )
        }

        colCount++
      }

      rowCount++
    }
  }


  drawGridLayer (): void {
    if (this.gridEvenTileMaterial && this.gridOddTileMaterial) {
      const renderableCoord = this._getWorldRenderableCoords()

      let rowCount = 0
      let colCount = 0

      for (let row = renderableCoord.startRow; row < renderableCoord.endRow; row++) {
        colCount = 0

        for (let col = renderableCoord.startCol; col < renderableCoord.endCol; col++) {

          const posX = this._tileSize * colCount
          const posY = this._tileSize * rowCount
          const sizeX = this._tileSize
          const sizeY = this._tileSize
          const opacity = DEFAULT_TERRAIN_GRID_OPACITY
          let tile

          if (row % 2 === 0) {
            if (col % 2 === 0 ) {
              tile = this.gridEvenTileMaterial
            } else {
              tile = this.gridOddTileMaterial
            }

          } else {
            if (col % 2 === 0) {
              tile = this.gridOddTileMaterial
            } else {
              tile = this.gridEvenTileMaterial
            }
          }

          this.canvasController.drawImage(tile, posX, posY, sizeX, sizeY, opacity)
          colCount++
        }

        rowCount++
      }

    } else {
      throw new Error('No materials defined to represent the grid')
    }
  }


  drawGridCoordinates (): void {
    const renderableCoord = this._getWorldRenderableCoords()

    let rowCount = 0
    let colCount = 0

    for (let row = renderableCoord.startRow; row < renderableCoord.endRow; row++) {
      colCount = 0
      for (let col = renderableCoord.startCol; col < renderableCoord.endCol; col++) {
        const posX = this._tileSize * colCount
        const posY = this._tileSize * rowCount
        const text = `(${row},${col})`
        const textSize = this.canvasController.measureText(text, 'Arial', 10)
        const textPosX = Math.round((posX + (this._tileSize / 2)) - (textSize.width / 2))
        const textPosY = Math.round((posY + (this._tileSize / 2)) + 2)

        this.canvasController.drawText(text, textPosX, textPosY, 'white', 'Arial', 10, 'black', 3)
        colCount++
      }

      rowCount++
    }
  }


  draw (): void {
    this.canvasController.clearContext()

    this.drawTerrainLayer()

    if (this._shouldDrawDebug) {

      this.drawDebugInfo()
      // Track FPS
      if ((performance.now() - this._lastRenderCall) > 1000) {
        this._framesPerSecond = this._frameCount
        this._frameCount = 0
        this._lastRenderCall = performance.now()

      } else {
        this._frameCount++
      }
    }
  }


  debug (): void {
    if (this._shouldDrawDebug) {
      this._shouldDrawDebug = false
      this.keyboardController.unsubscribe('debugControls')

    } else {
      this._shouldDrawDebug = true

      this.keyboardController.subscribe('debugControls', (evt) => {
        switch (evt.keyCode) {
          case 71:
            if (this._shouldDrawGrid === true) {
              this._shouldDrawGrid = false
            } else {
              this._shouldDrawGrid = true
            }
            break

          case 67:
            if (this._shouldDrawCoordinates === true) {
              this._shouldDrawCoordinates = false
            } else {
              this._shouldDrawCoordinates = true
            }
            break
        }
      }, 'keydown', 1)

    }
  }


  drawDebugInfo (): void {
    const debugboxWidth = 240
    const debugboxHeight = 240
    const debugboxColor = '#333333'
    const debugboxOpacity = 0.8

    const posX = this._viewPortWidth - (debugboxWidth + 10)
    const posY = 10

    const title = 'Debug Panel'
    const titleFont = 'Arial'
    const titleFontSize = '14'
    const titleColor = '#FFFFFF'
    const titleSize = this.canvasController.measureText(title, titleFont, titleFontSize )
    const titlePosX = posX + ((debugboxWidth / 2) - (titleSize.width / 2))
    const titlePosY = posY + (5 + titleSize.height)

    const FPSLabel = `Current FPS: ${this._framesPerSecond}`
    const FPSFont = 'Arial'
    const FPSFontSize = 11
    const FPSColor = '#CCCCCC'
    const FPSSize = this.canvasController.measureText(FPSLabel, FPSFont, FPSFontSize)
    const FPSPosX = posX + 10
    const FPSPosY = posY + (40 + FPSSize.height)

    const worldSizeLabel = `World Size: ${this._mapRows} rows X ${this._mapCols} cols`
    const worldSizeFont = 'Arial'
    const worldSizeFontSize = '11'
    const worldSizeColor = '#CCCCCC'
    const worldSizeSize = this.canvasController.measureText(worldSizeLabel, worldSizeFont, worldSizeFontSize)
    const worldSizePosX = posX + 10
    const worldSizePosY = FPSPosY + ( 5 + worldSizeSize.height)

    const tileSizeLabel = `Tile Size: ${this._tileSize}px`
    const tileSizeFont = 'Arial'
    const tileSizeFontSize = '11'
    const tileSizeColor = '#CCCCCC'
    const tileSizeSize = this.canvasController.measureText(tileSizeLabel, tileSizeFont, tileSizeFontSize)
    const tileSizePosX = posX + 10
    const tileSizePosY = worldSizePosY + ( 5 + tileSizeSize.height)

    const viewportPXSizeLabel = `Viewport: ${this._viewPortWidth}px width X ${this._viewPortHeight}px height`
    const viewportPXSizeFont = 'Arial'
    const viewportPXSizeFontSize = '11'
    const viewportPXSizeColor = '#CCCCCC'
    const viewportPXSizeSize = this.canvasController.measureText(viewportPXSizeLabel, viewportPXSizeFont, viewportPXSizeFontSize)
    const viewportPXSizePosX = posX + 10
    const viewportPXSizePosY = tileSizePosY + ( 5 + viewportPXSizeSize.height)

    const viewportTileSizeLabel = `Viewport: ${this._viewPortMaxRows} rows X ${this._viewPortMaxCols} cols`
    const viewportTileSizeFont = 'Arial'
    const viewportTileSizeFontSize = '11'
    const viewportTileSizeColor = '#CCCCCC'
    const viewportTileSizeSize = this.canvasController.measureText(viewportTileSizeLabel, viewportTileSizeFont, viewportTileSizeFontSize)
    const viewportTileSizePosX = posX + 10
    const viewportTileSizePosY = viewportPXSizePosY + ( 5 + viewportTileSizeSize.height)

    const renderArea = this._getWorldRenderableCoords()

    const renderAreaLabel = `Rendering from: ${renderArea.startRow},${renderArea.startCol} to ${renderArea.endRow},${renderArea.endCol} (row,col)`
    const renderAreaFont = 'Arial'
    const renderAreaFontSize = '11'
    const renderAreaColor = '#CCCCCC'
    const renderAreaSize = this.canvasController.measureText(renderAreaLabel, renderAreaFont, renderAreaFontSize)
    const renderAreaPosX = posX + 10
    const renderAreaPosY = viewportTileSizePosY + ( 5 + renderAreaSize.height)

    const isViewPortMovingLabel = `Processing movement: ${String(this._isViewPortProcessingMovement)}`
    const isViewPortMovingFont = 'Arial'
    const isViewPortMovingFontSize = '11'
    const isViewPortMovingColor = '#CCCCCC'
    const isViewPortMovingSize = this.canvasController.measureText(isViewPortMovingLabel, isViewPortMovingFont, isViewPortMovingFontSize)
    const isViewPortMovingPosX = posX + 10
    const isViewPortMovingPosY = renderAreaPosY + ( 5 + isViewPortMovingSize.height)

    const gridStatusLabel = `(G)rid: ${this._shouldDrawGrid ? 'On' : 'Off'}`
    const gridStatusFont = 'Arial'
    const gridStatusFontSize = '11'
    const gridStatusColor = '#CCCCCC'
    const gridStatusSize = this.canvasController.measureText(gridStatusLabel, gridStatusFont, gridStatusFontSize)
    const gridStatusPosX = posX + 10
    const gridStatusPosY = isViewPortMovingPosY + ( 25 + gridStatusSize.height)

    const coordinatesLabel = `(C)oordinates: ${this._shouldDrawCoordinates ? 'On' : 'Off'}`
    const coordinatesFont = 'Arial'
    const coordinatesFontSize = '11'
    const coordinatesColor = '#CCCCCC'
    const coordinatesSize = this.canvasController.measureText(coordinatesLabel, coordinatesFont, coordinatesFontSize)
    const coordinatesPosX = posX + 10
    const coordinatesPosY = gridStatusPosY + ( 5 + gridStatusSize.height)


    if (this._shouldDrawGrid) this.drawGridLayer()
    if (this._shouldDrawCoordinates) this.drawGridCoordinates()

    this.canvasController.drawRect(posX, posY, debugboxWidth, debugboxHeight, debugboxColor, debugboxOpacity)
    this.canvasController.drawText(title, titlePosX, titlePosY, titleColor, titleFont, titleFontSize)
    this.canvasController.drawText(FPSLabel, FPSPosX, FPSPosY, FPSColor, FPSFont, FPSFontSize)
    this.canvasController.drawText(worldSizeLabel, worldSizePosX, worldSizePosY, worldSizeColor, worldSizeFont, worldSizeFontSize)
    this.canvasController.drawText(tileSizeLabel, tileSizePosX, tileSizePosY, tileSizeColor, tileSizeFont, tileSizeFontSize)
    this.canvasController.drawText(viewportPXSizeLabel, viewportPXSizePosX, viewportPXSizePosY, viewportPXSizeColor, viewportPXSizeFont, viewportPXSizeFontSize)
    this.canvasController.drawText(viewportTileSizeLabel, viewportTileSizePosX, viewportTileSizePosY, viewportTileSizeColor, viewportTileSizeFont, viewportTileSizeFontSize)
    this.canvasController.drawText(renderAreaLabel, renderAreaPosX, renderAreaPosY, renderAreaColor, renderAreaFont, renderAreaFontSize)
    this.canvasController.drawText(isViewPortMovingLabel, isViewPortMovingPosX, isViewPortMovingPosY, isViewPortMovingColor, isViewPortMovingFont, isViewPortMovingFontSize)

    this.canvasController.drawText(gridStatusLabel, gridStatusPosX, gridStatusPosY, gridStatusColor, gridStatusFont, gridStatusFontSize)
    this.canvasController.drawText(coordinatesLabel, coordinatesPosX, coordinatesPosY, coordinatesColor, coordinatesFont, coordinatesFontSize)

  }


}

export default World
