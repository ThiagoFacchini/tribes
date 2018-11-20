// @flow
import First from './names.first'
import Last from './names.last'

const FIRSTNAME_MALE_MIN = 0
const FIRSTNAME_MALE_SIZE = 99
const FIRSTNAME_FEMALE_MIN = 100
const FIRSTNAME_FEMALE_SIZE = 99

const LASTNAME_MIN = 0
const LASTNAME_SIZE = Last.length


function _randomize (nameType: 'first' | 'last', nameArr: Array<string>, genre?: string): string {
  let min, max

  if (nameType === 'first') {
    min = FIRSTNAME_FEMALE_MIN
    max = FIRSTNAME_FEMALE_SIZE

    if (genre === 'male') {
      min = FIRSTNAME_MALE_MIN
      max = FIRSTNAME_MALE_SIZE
    }
  } else {
    min = LASTNAME_MIN
    max = LASTNAME_SIZE
  }

  let rnd = Math.floor((Math.random() * max) + min)
  return nameArr[rnd]
}

const Names = {
  getFirstName: (genre?: string = 'male') => _randomize('first', First, genre),
  getLastName: () => _randomize('last', Last)
}

Object.freeze(Names)

export default Names
