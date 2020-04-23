const turnLinesArrayToString = (array) => {
  let LinesString = ''
  array.forEach(line => {
    LinesString += line + '\n'
  })
  return LinesString
}

const addDateToObject = (object) => {
  const objectWithDate = object
  objectWithDate.date = new Date()
  return objectWithDate
}

const getRandomObjectFromArray = (array) => {
    const randomIndex = (Math.floor(Math.random() * array.length))
    let randomObject = array[randomIndex]
    return randomObject
  }

export default { 
  turnLinesArrayToString, 
  addDateToObject,
  getRandomObjectFromArray
}