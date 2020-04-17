const turnLinesArrayToString = (array) => {
  let LinesString = ''
  array.forEach(line => {
    LinesString += line + '\n'
  })
  return LinesString
}

export default { turnLinesArrayToString }