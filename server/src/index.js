//@flow
const TimeController = require('./libs/timeController.js')


console.log('---------')
console.log(TimeController.getTIckCount())
console.log(TimeController.incrementTickCount())
console.log(TimeController.getTIckCount())
console.log(TimeController.incrementTickCount())
console.log(TimeController.getTIckCount())
TimeController.start()
console.log(' ')
