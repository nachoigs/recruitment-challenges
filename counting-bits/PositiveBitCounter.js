function Count(input) {
  if (input < 0) {
    // throw new RangerError("Please, input must be a positive number");
    throw new RangeError()
  }
  // Array for the results of the function (with the number of 1's and the position)
  var result = []
  // To store the count of 1's and the position of the current bit checked
  var countsum = 0
  var pos = 0
  // For storing what's left in our number through the function
  var left = input

  while (left > 0) {
    if (left % 2 === 1) {
      countsum++
      result.push(pos)
    }
    pos++
    left >>= 1
  }
  result.unshift(countsum)
  return result
}

module.exports = { Count }
