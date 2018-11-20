// @flow

/**
 * Application entry point
 */

// Load application styles
import styles from './../assets/styles/index.scss'

import AssetLoader from './classes/assetLoader/assetLoader'
import Ticker from './classes/ticker/ticker'
import World from './classes/world/world'
import KeyboardController from './classes/keyboardController/keyboardController'

import { default as TerrainTiles }  from './resources/terrain/tiles'

// ================================
// START YOUR APP HERE
// ================================


// const canvasController = new CanvasController('canvas')
let terrainTiles

AssetLoader.loadAssets(TerrainTiles, updateTest)
  .then ((loadedAssets) => {
    terrainTiles = loadedAssets
    init()
  })

function updateTest (report) {
  console.log(report)
}

const mapRows = 50
const mapCols = 50

const ticker = new Ticker()
const world = new World(mapRows, mapCols)
const keyBoard = new KeyboardController()

// Debug
keyBoard.subscribe('debuggerToggle', (evt) => {
  if (evt.keyCode === 68 && evt.ctrlKey) {
      world.debug()
  }
}, 'keydown', 1)


// Movement
keyBoard.subscribe('movement', (evt) => {
  let currentViewPortPosition

  switch (evt.keyCode) {
    case 37:
      // LEFT
      currentViewPortPosition = world.getViewPortPosition()
      world.setViewPortPosition( currentViewPortPosition.x, (currentViewPortPosition.y - 1))
      break

    case 39:
      // RIGHT
      currentViewPortPosition = world.getViewPortPosition()
      world.setViewPortPosition( currentViewPortPosition.x, (currentViewPortPosition.y + 1))
      break

    case 38:
      // UP
      currentViewPortPosition = world.getViewPortPosition()
      world.setViewPortPosition((currentViewPortPosition.x - 1), currentViewPortPosition.y)
      break

    case 40:
      // DOWN
      currentViewPortPosition = world.getViewPortPosition()
      world.setViewPortPosition((currentViewPortPosition.x + 1), currentViewPortPosition.y)
      break
  }
}, 'keydown', 1)

function init() {
    world.gridOddTileMaterial = terrainTiles.grid1
    world.gridEvenTileMaterial = terrainTiles.grid2

    for (let i = 0; i < mapRows; i++) {
      for (let x = 0; x < mapCols; x++) {
        world.setTerrainTileMaterial(i,x ,terrainTiles.grass1)
      }
    }

    world.setTerrainTileMaterial(29, 0, terrainTiles.grid1)
    world.setTerrainTileMaterial(0, 29, terrainTiles.grid1)

    ticker.subscribe( 'Test', () => { console.log('high p')}, '1' )
    ticker.subscribe( 'Test', () => { console.log('low p')}, '5' )

    world.draw()
    // ticker.start()
    // world.isDebugOn = true
    // window.setTimeout( () => {
    //   ticker.stop()
    //
    // }, 5000)

    // window.setTimeout( () => {
    //   world.isDebugOn = false
    // }, 10000)

}
