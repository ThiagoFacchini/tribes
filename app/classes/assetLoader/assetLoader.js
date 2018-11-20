// @flow
import { isFunction } from 'lodash'

let startTime, endTime
let index = 0
const assetsObj = {}


function loadImage (assetsArr: Array<string>, callbackFn: Function, updateFn?: Function) {
  if (index < assetsArr.length) {
    const image = new Image()
    const imgSource = Object.values(assetsArr[index])
    image.src = imgSource

    image.onload = () => {
      const objKey = Object.keys(assetsArr[index])
      const objValue = image

      assetsObj[objKey] = objValue
      index++

      if (updateFn != null && isFunction(updateFn)) {
        updateFn(`Loading asset ${index} out of ${assetsArr.length}`)
      }

      loadImage(assetsArr, callbackFn, updateFn)
    }

  } else {
    endTime = (new Date).getTime()
    console.log(`Assets loaded in ${endTime - startTime} ms.`)
    callbackFn(assetsObj)
  }
}

const loadAssets = (assetsArr: Array<string>, updateFn?: Function) => {
    return new Promise( function(resolve, reject) {
    startTime = (new Date).getTime()
    loadImage(assetsArr, resolve, updateFn)
  })
}

const AssetLoader = {
  loadAssets: loadAssets,
}

export default AssetLoader
