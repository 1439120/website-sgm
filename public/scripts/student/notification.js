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
  // document.getElementById('invite-student').action = '/group/invite/' + getStudId(removeLast(window.location.href)) + '/' + getStudId(window.location.href)
  // document.getElementById('form-text').action = '/group/api/' + getStudId(removeLast(window.location.href)) + '/' + getStudId(window.location.href)
  document.getElementById('home').href = '/login/' + getStudId(removeLast(window.location.href))
  document.getElementById('groups-route').href = '/login/' + getStudId(removeLast(window.location.href)) + '/group'
  document.getElementById('calendar-route').href = '/calendar/' + getStudId(removeLast(window.location.href))
})

fetch(window.location.href + '/api') // Returns a Promise for the GET request
  .then(function (response) {
    if (response.ok) { return response.json() } // Return the response parse as JSON if code is
  })
  .then(function (data) {
    const maincontent = document.getElementById('main-content')
    data.forEach(element => {
      const line1 = document.createElement('hr')
      maincontent.appendChild(line1)
      const person = document.createElement('p')
      person.innerHTML = element.g_name // + '(' + element.s_email + ')'
      maincontent.appendChild(person)
      const date = document.createElement('p')
      date.innerHTML = element.i_date
      maincontent.appendChild(date)
      if (element.from_id !== null) {
        fetch('/login/' + element.from_id + '/api')
          .then(function (response) {
            if (response.ok) { return response.json() } // Return the response parse as JSON if code is
          })
          .then(function (data3) {
            const date = document.createElement('p')
            date.innerHTML = data3[0].s_fname + ' (' + data3[0].s_email + ')'
            maincontent.appendChild(date)
            const yesnoForm = document.createElement('form')
            yesnoForm.setAttribute('method', 'post')

            const label = document.createElement('label')
            label.innerHTML = 'Yes or No?'
            const select = document.createElement('select')
            select.setAttribute('id', 'yesno')
            select.setAttribute('name', 'yesno')
            const option2 = document.createElement('option')
            option2.innerHTML = 'ADD'
            option2.value = 'Yes'
            select.appendChild(option2)
            const option3 = document.createElement('option')
            option3.innerHTML = 'REMOVE'
            option3.value = 'No'
            select.appendChild(option3)
            // use a link to submit the form
            const ali = document.createElement('input')
            ali.type = 'submit'
            yesnoForm.action = '/calendar/vote/' + element.g_id + '/' + element.s_id + '/' + element.from_id
            ali.value = 'submit'
            ali.className = 'btn btn-link'
            yesnoForm.appendChild(select)
            yesnoForm.appendChild(ali)
            maincontent.appendChild(yesnoForm)
            const line2 = document.createElement('hr')
            maincontent.appendChild(line2)
          })
          .catch(function (e) { // Process error for request
            alert(e) // Displays a browser alert with the error message.
          })
      }
      const mssg = document.createElement('p')
      mssg.innerHTML = element.mssg
      maincontent.appendChild(mssg)
      if (element.link !== null) {
        const mssg = document.createElement('p')
        mssg.innerHTML = 'Click this link '

        /// Create a form synamically
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', element.link)

        // Create an input element for Full Name
        const FN = document.createElement('input')
        FN.setAttribute('type', 'submit')
        FN.setAttribute('value', 'Group Link')
        FN.setAttribute('class', 'btn btn-secondary')

        form.appendChild(FN)
        mssg.appendChild(form)
        maincontent.appendChild(mssg)
      }
    })
    const line2 = document.createElement('hr')
    maincontent.appendChild(line2)
  })
  .catch(function (e) { // Process error for request
    alert(e) // Displays a browser alert with the error message.
  })
