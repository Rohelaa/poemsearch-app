// muuttaa säe-taulukon merkkijono muotoon
// lisää jokaisen taulukon alkion jälkeen rivinvaihdon, jotta
// säkeet renderöityvät oikein
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

// funktio, joka järjestää runoja sisältävän taulukon runon nimen (title)
// perusteella aakkosjärjestykseen
const sortPoemsByTitle = (array) => {
  // vertailufunktio
  // syötetään parametrina sort-metodille 
  // järjestää runot aakkosjärjestykseen
  function compare(a, b) {
    if (a.title < b.title) {
      return -1 
    } 
    if (a.title > b.title) {
      return 1
    }
    return 0
  }
  
  const sortedArraY = array.sort(compare)
  return sortedArraY
}

export default { 
  turnLinesArrayToString, 
  addDateToObject,
  getRandomObjectFromArray,
  sortPoemsByTitle
}