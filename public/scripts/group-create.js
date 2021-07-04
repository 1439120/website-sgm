const getStudId = (clink) => {
  let res = ''
  let x = clink.length - 1

  while (clink[x] !== '/') {
    res = res + clink[x]
    x = x - 1
  }

  const splitString = res.split('')
  const reverseArray = splitString.reverse()
  const joinArray = reverseArray.join('')
  return joinArray
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('group-create-form').action = '/group/api/create/' + getStudId(window.location.href)
  document.getElementById('book-link').href = '/login/' + getStudId(window.location.href) + '/group'
})
