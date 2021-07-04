const removeLast = (link) => {
  if (link === undefined || link === null || link.length === 0) return false
  let i = link.length - 1
  while (link[i] !== '/' && i >= 0) {
    i--
  }
  if (i > 0) {
    return link.slice(0, i)
  } else {
    return false
  }
}

const getStudId = (clink) => {
  if (clink === undefined || clink === null || clink.length === 0) return false
  let res = ''
  let x = clink.length - 1

  while (clink[x] !== '/' && x > 0) {
    res = res + clink[x]
    x = x - 1
  }

  if (x === 0) return clink

  const splitString = res.split('')
  const reverseArray = splitString.reverse()
  const joinArray = reverseArray.join('')
  return joinArray
}

module.exports = {
  removeLast: removeLast,
  getlast: getStudId
}
