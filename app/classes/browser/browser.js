// @flow


function _getWidth() {
  return Math.max(
    // $FlowFixMe
    document.documentElement.clientWidth,
    window.innerWidth
  )
}

function _getHeight() {
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  )
}

const Browser = {
  getWidth: () => _getWidth(),
  getHeight: () => _getHeight()
}

export default Browser
