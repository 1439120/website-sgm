'use strict'

// Check for a valid email address
function validateEmail (email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// username cannot have spaces
function validUsername (uname) {
  return !/\s/.test(uname)
}

module.exports = {
  validEm: validateEmail,
  validUname: validUsername
}
