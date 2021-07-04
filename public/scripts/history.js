/* global fetch alert */

const removeLast = (link) => {
  let i = link.length - 1
  while (link[i] !== '/' && i >= 0) {
    i--
  }
  if (i > 0) {
    return link.slice(0, i)
  } else {
    return null
  }
}

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

document.addEventListener('DOMContentLoaded', () => {
  // document.getElementById('home').href = '/login/' + getStudId(window.location.href)
  // document.getElementById('groups-route').href = '/login/' + getStudId(window.location.href) +'/group'
  // document.getElementById('calendar-route').href = '/calendar/' + getStudId(window.location.href)
  // document.getElementById('main-content').href = '/calendar/vgroup/history/' + getStudId(removeLast(window.location.href))
})

fetch('/calendar/api/' + getStudId(window.location.href) + '/history') // Returns a Promise for the GET request
  .then(function (response) {
    if (response.ok) { return response.json() } // Return the response parse as JSON if code is
  })
  .then(function (data) {
    // Name of person
    const maincontent = document.getElementById('main-content')
    data.forEach(element => {
      const line1 = document.createElement('hr')
      maincontent.appendChild(line1)
      const person = document.createElement('p')
      person.innerHTML = element.s_fname + '(' + element.s_email + ')'
      maincontent.appendChild(person)
      const date = document.createElement('p')
      date.innerHTML = element.d_time
      maincontent.appendChild(date)
      const mssg = document.createElement('p')
      mssg.innerHTML = element.s_fname + ' ' + element.mssg
      maincontent.appendChild(mssg)
    })
    const line2 = document.createElement('hr')
    maincontent.appendChild(line2)
  })
  .catch(function (e) { // Process error for request
    alert(e) // Displays a browser alert with the error message.
  })
