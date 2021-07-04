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
  document.getElementById('invite-student').action = '/group/invite/' + getStudId(removeLast(window.location.href)) + '/' + getStudId(window.location.href)
  document.getElementById('form-text').action = '/group/api/' + getStudId(removeLast(window.location.href)) + '/' + getStudId(window.location.href)
  document.getElementById('home').href = '/login/' + getStudId(window.location.href)
  document.getElementById('groups-route').href = '/login/' + getStudId(window.location.href) + '/group'
  document.getElementById('calendar-route').href = '/calendar/' + getStudId(window.location.href)
  document.getElementById('main-content').href = '/calendar/vgroup/history/' + getStudId(removeLast(window.location.href))
})

fetch('/group/api/messages/' + getStudId(removeLast(window.location.href))) // Returns a Promise for the GET request
  .then(function (response) {
    if (response.ok) { return response.json() } // Return the response parse as JSON if code is
  })
  .then(function (data) {
    fetch('/group/api/' + getStudId(removeLast(window.location.href)))
      .then(function (response) {
        if (response.ok) { return response.json() } // Return the response parse as JSON if code is
      })
      .then(function (data2) {
        // updating the links for routing
        document.getElementById('heading').innerHTML = data2[0].g_name
      })
      .catch(function (e) { // Process error for request
        alert(e) // Displays a browser alert with the error message.
      })

    data.forEach(element => {
      fetch('/login/' + element.s_id + '/api') // Returns a Promise for the GET request
        .then(function (response) {
          if (response.ok) { return response.json() } // Return the response parse as JSON if code is
        })
        .then(function (data2) {
          const div1 = document.createElement('div')
          div1.className = 'prev-comments'
          const div2 = document.createElement('div')
          div2.className = 'single-item'
          const h41 = document.createElement('h4')
          h41.innerHTML = data2[0].s_fname
          div2.appendChild(h41)
          const h42 = document.createElement('h4')
          h42.innerHTML = data2[0].s_email
          div2.appendChild(h42)
          const link = document.createElement('a')
          link.href = element.m_link
          link.innerHTML = 'Link'
          div2.appendChild(link)
          const p = document.createElement('p')
          link.href = element.m_link
          p.innerHTML = element.m_message
          div2.appendChild(p)
          div1.appendChild(div2)
          document.getElementById('display-comments-here').appendChild(div1)
        })
        .catch(function (e) { // Process error for request
          alert(e) // Displays a browser alert with the error message.
        })
    })
  })
  .catch(function (e) { // Process error for request
    alert(e) // Displays a browser alert with the error message.
  })

fetch('/group/members/' + getStudId(removeLast(window.location.href))) // Returns a Promise for the GET request
  .then(function (response) {
    if (response.ok) { return response.json() } // Return the response parse as JSON if code is
  })
  .then(function (data) {
    const list = document.createElement('ul')
    data.forEach((element) => {
      const elem = document.createElement('li')
      elem.innerHTML = `<a href="${window.location.href + '/' + element.s_id}">${element.s_fname}</a>` + ' (' + element.s_email + ') '
      elem.className = 'font-weight-bold'
      // add a link to terminate the members
      const alink = document.createElement('a')
      alink.innerHTML = 'terminate member'
      alink.href = `/group/ask-to-terminate/${getStudId(removeLast(window.location.href))}/${getStudId(window.location.href)}/${element.s_id}`
      const det = document.createElement('details')
      const sum = document.createElement('summary')
      sum.innerHTML = 'Rate Student'
      sum.setAttribute('style', 'color: blue;')

      /** *********************************** */
      const starcont = document.createElement('form')
      starcont.className = 'star-container'
      starcont.setAttribute('method', 'post')
      starcont.setAttribute('action', '/rate/api/' + element.s_id + '/' + getStudId(window.location.href) + '/' + getStudId(removeLast(window.location.href)))
      const startdiv = document.createElement('div')
      startdiv.className = 'star-widget'
      const starradio = document.createElement('input')
      starradio.type = 'radio'
      starradio.name = 'rate'
      starradio.value = '5'
      starradio.id = 'rate-5' + element.s_fname
      const starlabel = document.createElement('label')
      // starlabel.for = 'rate-5'
      starlabel.setAttribute('for', 'rate-5' + element.s_fname)
      starlabel.className = 'fas fa-star'
      startdiv.appendChild(starradio)
      startdiv.appendChild(starlabel)

      const starradio2 = document.createElement('input')
      starradio2.type = 'radio'
      starradio2.name = 'rate'
      starradio2.value = '4'
      starradio2.id = 'rate-4' + element.s_fname
      const starlabel2 = document.createElement('label')
      // starlabel2.for = 'rate-4'
      starlabel2.setAttribute('for', 'rate-4' + element.s_fname)
      starlabel2.className = 'fas fa-star'
      startdiv.appendChild(starradio2)
      startdiv.appendChild(starlabel2)

      const starradio3 = document.createElement('input')
      starradio3.type = 'radio'
      starradio3.name = 'rate'
      starradio3.value = '3'
      starradio3.id = 'rate-3' + element.s_fname
      const starlabel3 = document.createElement('label')
      // starlabel3.for = 'rate-3'
      starlabel3.setAttribute('for', 'rate-3' + element.s_fname)
      starlabel3.className = 'fas fa-star'
      startdiv.appendChild(starradio3)
      startdiv.appendChild(starlabel3)

      const starradio4 = document.createElement('input')
      starradio4.type = 'radio'
      starradio4.name = 'rate'
      starradio4.value = '2'
      starradio4.id = 'rate-2' + element.s_fname
      const starlabel4 = document.createElement('label')
      // starlabel4.for = 'rate-2'
      starlabel4.setAttribute('for', 'rate-2' + element.s_fname)
      starlabel4.className = 'fas fa-star'
      startdiv.appendChild(starradio4)
      startdiv.appendChild(starlabel4)

      const starradio5 = document.createElement('input')
      starradio5.type = 'radio'
      starradio5.name = 'rate'
      starradio5.value = '1'
      starradio5.id = 'rate-1' + element.s_fname
      const starlabel5 = document.createElement('label')
      // starlabel5.for = 'rate-1'
      starlabel5.setAttribute('for', 'rate-1' + element.s_fname)
      starlabel5.className = 'fas fa-star'
      startdiv.appendChild(starradio5)
      startdiv.appendChild(starlabel5)
      // button to submit
      const butt = document.createElement('input')
      butt.className = 'btn btn-secondary btn-lg btn-block'
      butt.value = 'submit'
      butt.type = 'submit'
      /** **************************************** */
      starcont.appendChild(startdiv)
      starcont.appendChild(butt)
      det.appendChild(starcont)
      det.appendChild(sum)
      elem.appendChild(det)
      elem.appendChild(alink)
      list.appendChild(elem)
      // add hr
      const hr = document.createElement('hr')
      list.appendChild(hr)
    })
    document.getElementById('g-members').appendChild(list)
  })
  .catch(function (e) { // Process error for request
    alert(e) // Displays a browser alert with the error message.
  })
