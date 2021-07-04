/* global fetch alert FullCalendar */
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

// variable for storing the calendar
let calendar

// onload display an empty calendar
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar')
  // i need to fetch event data according to the group
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: '2021-06-07',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: []
  })

  calendar.render()
})

// fetch all the groups for the student
fetch('/login/' + getStudId(window.location.href) + '/group/api') // Returns a Promise for the GET request
  .then(function (response) {
    if (response.ok) { return response.json() } // Return the response parse as JSON if code is
  })
  .then(function (data) {
    // update the links
    document.getElementById('home').href = '/login/' + getStudId(window.location.href)
    document.getElementById('group-router').href = '/login/' + getStudId(window.location.href) + '/group'
    document.getElementById("notification").href = '/calendar/' + getStudId(window.location.href) + '/notification'
    //
    data.forEach(element => {
      fetch('/calendar/' + element.g_id + '/groupevents')
        .then(function (response) {
          if (response.ok) { return response.json() } // Return the response parse as JSON if code is
        })
        .then(data2 => {
          data2.forEach((elem2) => {
            const newevent = {}
            newevent.title = elem2.e_title + '\nclik to access link'
            newevent.start = elem2.e_date + 'T' + elem2.e_start
            newevent.end = elem2.e_date + 'T' + elem2.e_end
            newevent.url = elem2.e_location
            calendar.addEvent(newevent)
          })
        }).catch(e => {
          alert(e)
        })
    })
  })
  .catch(function (e) { // Process error for request
    alert(e) // Displays a browser alert with the error message.
  })
