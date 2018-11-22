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
// APP START
// ================================
let terrainTiles = {}
const mapRows = 50
const mapCols = 50

const ticker = new Ticker()
const world = new World(mapRows, mapCols)
const keyBoard = new KeyboardController()

const movementFlags = {
  up: false,
  left: false,
  down: false,
  right: false
}

// ================================
// SUBSCRIPTIONS
// ================================

AssetLoader.loadAssets(TerrainTiles, assetLoaderStatus)
  .then ((loadedAssets) => {
    terrainTiles = loadedAssets
    init()
  })

function assetLoaderStatus (report) {
  console.log(report)
}


// Debug Window Activation
keyBoard.subscribe('debuggerToggle', (evt) => {
  if (evt.keyCode === 68 && evt.altKey) {
      world.debug()
  }
}, 'keydown', 1)


// Movement
keyBoard.subscribe('movement', (evt) => {
  switch (evt.keyCode) {
    case 37:
      // ARROW KEY LEFT
      movementFlags.left = true
      break

    case 39:
      // ARROW KEY RIGHT
      movementFlags.right = true
      break

    case 38:
      // ARROW KEY UP
      movementFlags.up = true
      break

    case 40:
      // ARROW KEY DOWN
      movementFlags.down = true
      break
  }
}, 'keydown', 1)

keyBoard.subscribe('movement', (evt) => {
  switch (evt.keyCode) {
    case 37:
      // ARROW KEY LEFT
      movementFlags.left = false
      break

    case 39:
      // ARROW KEY RIGHT
      movementFlags.right = false
      break

    case 38:
      // ARROW KEY UP
      movementFlags.up = false
      break

    case 40:
      // ARROW KEY DOWN
      movementFlags.down = false
      break
  }
}, 'keyup', 1)


// ================================
// FUNCTIONS
// ================================

function updateWorldPosition (movementObj: Object) {
  const currentViewPortPosition = world.getViewPortPosition()
  let posX = currentViewPortPosition.x
  let posY = currentViewPortPosition.y

  if (movementObj.left) posY--
  if (movementObj.right) posY++
  if (movementObj.up) posX--
  if (movementObj.down) posX++

  world.setViewPortPosition(posX, posY)
}


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

    main()
}


function main (): void {
  updateWorldPosition(movementFlags)
  world.draw()
  setTimeout(main , 4)
}
