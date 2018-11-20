// @flow
type Olie = {
  oi: number
}

class Squirkle {
  name: string
  genre: 'male' | 'female'
  generation: number
  size: number
  health: number
  energy: number

  constructor(): void {
    // console.log(generateRandomName())
    this.name = random.first()
    console.log('name is', this.name)
  }

}

export default Squirkle
