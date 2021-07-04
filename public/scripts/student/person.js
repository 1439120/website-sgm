/* global fetch alert */

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

fetch('/login/' + getStudId((window.location.href)) + '/api') // Returns a Promise for the GET request
  .then(function (response) {
    if (response.ok) { return response.json() } // Return the response parse as JSON if code is
  })
  .then(function (data) {
    // Name of person
    document.getElementById('full-name').innerHTML = data[0].s_fname + ' '
    // Their contact information
    // phone
    const phoneCall = document.createElement('div')
    phoneCall.innerHTML = '<i class="fa fa-phone fa-flip-horizontal"></i>' + ' +27' + data[0].s_number + ' '
    document.getElementById('details').appendChild(phoneCall)
    // email
    const email = document.createElement('div')
    email.innerHTML = '<i class="fa fa-envelope" aria-hidden="true"></i>' + ' ' + data[0].s_email + ' '
    document.getElementById('details').appendChild(email)

    if (data[0].about !== undefined)document.getElementById('message-about').innerHTML = data[0].about

    // updating the links for routing
    document.getElementById('account').href = '/login/' + getStudId(removeLast(window.location.href))
    document.getElementById('groups-route').href = '/login/' + getStudId(removeLast(window.location.href)) + '/group'
    document.getElementById('calendar-route').href = '/calendar/' + getStudId(removeLast(window.location.href))
    document.getElementById('notification').href = '/calendar/' + getStudId(removeLast(window.location.href)) + '/notification'
  })
  .catch(function (e) { // Process error for request
    alert(e) // Displays a browser alert with the error message.
  })

// get the rating here
fetch('/rate/rating/' + getStudId((window.location.href))) // Returns a Promise for the GET request
  .then(function (response) {
    if (response.ok) { return response.json() } // Return the response parse as JSON if code is
  })
  .then(function (data) {
    // whats the average votes
    let sum = 0
    let total = 0
    let avg = 0
    if (data.length > 0) {
      sum = data[0].five * 5 + data[0].four * 4 + data[0].three * 3 + data[0].two * 2 + data[0].one * 1
      total = data[0].five + data[0].four + data[0].three + data[0].two + data[0].one
      avg = Math.floor(sum / total)
    }

    const rating = document.getElementById('rating')
    for (let i = 1; i <= 5; i++) {
      // they are checked
      if (i <= avg) {
        const star = document.createElement('i')
        star.className = 'fa fa-star checked'
        rating.appendChild(star)
      } else {
        const star = document.createElement('i')
        star.className = 'fa fa-star'
        rating.appendChild(star)
      }
    }
    document.getElementById('total-votes').innerHTML = `${avg} average based on ${total} reviews.`

    // update the bars
    let arrObject = [0, 0, 0, 0, 0]
    if (data.length > 0) {
      arrObject = [data[0].five, data[0].four, data[0].three, data[0].two, data[0].one]
    }
    for (let i = 1; i <= 5; i++) {
      const bar = document.getElementById('bar-' + i.toString())
      bar.setAttribute('style', `--size: ${arrObject[5 - i] / total * 100}%;`)

      const nums = document.getElementById('right-bar-' + i.toString())
      nums.innerHTML = arrObject[5 - i]
    }
  })
  .catch(function (e) { // Process error for request
    alert(e) // Displays a browser alert with the error message.
  })

