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

fetch('/group/api/list') // Returns a Promise for the GET request
  .then(function (response) {
    // Check if the request returned a valid code
    if (response.ok) { return response.json() } // Return the response parse as JSON if code is

    // else { throw 'Failed to load classlist: response code invalid!' }
  })
  .then(function (data) {
    data.forEach(function (group) {
      const type = 'td'
      const glist = document.getElementById('gtable')
      const row = document.createElement('tr')
      // adding all coulumns to that roq
      const col1 = document.createElement('p')
      col1.innerHTML = group.g_name
      row.appendChild(col1)
      // adding column description of the group
      const col2 = document.createElement(type)
      col2.innerHTML = group.descript
      row.appendChild(col2)
      // adding column date created
      const col3 = document.createElement(type)
      col3.innerHTML = group.d_created
      row.appendChild(col3)
      // Delete row
      // const col4 = document.createElement('i')
      // col4.className = 'fas fa-trash-alt'
      const link = document.createElement('a')
      link.innerHTML = 'Join'
      link.className = 'delete-icon'
      // link.href = removeLast(window.location.href) + '/' + group.g_id + '/join'
      link.href = '/group/ask-to-join/' + group.g_id + '/' + getStudId(removeLast(window.location.href))
      // link.appendChild(col4)
      row.appendChild(link)
      glist.appendChild(row)
    })

    // search starts here
    const table = document.getElementById('gtable')
    document.querySelector('#SearchBox').addEventListener('input', function () {
      const dataElement = document.getElementById('SearchBox').value

      const filterData = data.filter(element => {
        console.log(element.g_name)
        const lowerCaseElement = dataElement.toLowerCase()
        const lowerCaseGname = element.g_name.toLowerCase()
        // return lowerCaseElement === lowerCaseGname
        return lowerCaseGname.includes(lowerCaseElement)
      })

      while (table.childNodes.length > 2) {
        table.removeChild(table.lastChild)
      }

      filterData.forEach(function (group) {
        const type = 'td'
        const glist = document.getElementById('gtable')
        const row = document.createElement('tr')
        // adding all coulumns to that roq
        const col1 = document.createElement('p')
        col1.innerHTML = group.g_name
        row.appendChild(col1)
        // adding column description of the group
        const col2 = document.createElement(type)
        col2.innerHTML = group.descript
        row.appendChild(col2)
        // adding column date created
        const col3 = document.createElement(type)
        col3.innerHTML = group.d_created
        row.appendChild(col3)
        // Delete row
        // const col4 = document.createElement('i')
        // col4.className = 'fas fa-trash-alt'
        const link = document.createElement('a')
        link.innerHTML = 'Join'
        link.className = 'delete-icon'
        // link.href = removeLast(window.location.href) + '/' + group.g_id + '/join'
        link.href = '/group/ask-to-join/' + group.g_id + '/' + getStudId(removeLast(window.location.href))
        // link.appendChild(col4)
        row.appendChild(link)
        glist.appendChild(row)
      })

      filterData.clear()
    })
      .catch(function (e) { // Process error for request
        alert(e) // Displays a browser alert with the error message.
      })
  })

fetch(window.location.href + '/api')
  .then(function (response) {
    if (response.ok) { return response.json() }
  })
  .then(function (data) {
    document.getElementById('home').href = removeLast(window.location.href)
    document.getElementById('calendar-route').href = '/calendar/' + getStudId(removeLast(window.location.href))
    document.getElementById('create-group-link').href = '/group/create/' + getStudId(removeLast(window.location.href))
    document.getElementById('notification').href = '/calendar/' + getStudId(removeLast(window.location.href)) + '/notification'
    const groups = document.getElementById('row1')
    data.forEach(element => {
      fetch('/group/api/' + element.g_id) // Returns a Promise for the GET request
        .then(function (response) {
          if (response.ok) { return response.json() } // Return the response parse as JSON if code is
        })
        .then(function (data2) {
          // create the card div
          const card = document.createElement('div')
          card.className = 'card'
          const cardbody = document.createElement('div')
          cardbody.className = 'card-body'
          const title = document.createElement('h5')
          title.className = 'card-title text-center'
          title.innerHTML = data2[0].g_name
          cardbody.appendChild(title)
          const textbody = document.createElement('p')
          textbody.className = 'card-text'
          textbody.innerHTML = data2[0].descript
          cardbody.appendChild(textbody)
          const linkGroup = document.createElement('a')
          linkGroup.className = 'card-link text-center'
          linkGroup.href = '/group/vgroup/' + data2[0].g_id + '/' + getStudId(removeLast(window.location.href))
          linkGroup.innerHTML = 'Group Link'
          cardbody.appendChild(linkGroup)
          card.appendChild(cardbody)
          groups.appendChild(card)
        })
        .catch(function (e) { // Process error for request
          alert(e) // Displays a browser alert with the error message.
        })
    })
  })
  .catch(function (e) { // Process error for request
    alert(e) // Displays a browser alert with the error message.
  })
