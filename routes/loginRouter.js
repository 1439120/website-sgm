const path = require('path')
const express = require('express')
const db = require('../public/scripts/db')
const { v4: uuidv4 } = require('uuid')
const validation = require('../public/scripts/user-validation')
const hash = require('object-hash')

let OnlinStatus = false

const router = express.Router()
router.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'login', 'sign-up.html'))
})

// CREATING AN ACCOUNT
router.post('/signup', function (req, res) {
  if (!validation.validEm(req.body.semail) || !validation.validUname(req.body.suname)) {
    res.render(path.join('./error/error'), { error: 'Request failed: Either the email or the username is invalid' })
  } else
  if (req.body.sfname.trim() === '') {
    res.render(path.join('./error/error'), { error: 'Request failed: Name cannot be empty' })
  } else
  if (req.body.spass !== req.body.scpass) {
    res.render(path.join('./error/error'), { error: 'Request failed: Password do not match' })
  } else if (req.body.spass.length < 8) {
    res.render(path.join('./error/error'), { error: 'Request failed: Password too short, mimimum 8 characters required' })
  } else {
    db.pools
      .then((pool) => {
        return pool.request()
          .query(`INSERT INTO STUDENTS (s_id, s_fname, s_uname, s_email, s_number, s_password, gender)
        VALUES ('${uuidv4()}', '${req.body.sfname}', '${req.body.suname}', '${req.body.semail}',
        '${req.body.snum}', '${hash(req.body.spass)}', '${req.body.gender}');`)
      })
      .then(result => {
        if (result.rowsAffected.length >= 1) console.log('Student account created succesffuly')

        res.redirect('/login')
      })
      .catch(err => {
        res.send({
          Error: err
        })
        console.log(err)
      })
  }
})

// get log in pages
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'login', 'log-in.html'))
})

router.get('/:id', function (req, res) {
  if (OnlinStatus) { res.sendFile(path.join(__dirname, '..', 'views', 'student', 'index.html')) } else { res.redirect('/login') }
})

router.post('/api', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT s_id, s_password FROM STUDENTS WHERE s_email = '${req.body.email}';`)
    })
    .then(result => {
      if (result.recordset.length >= 1) {
        if (result.recordset[0].s_password === hash(req.body.pass)) {
          console.log(result.recordset)
          OnlinStatus = true
          // res.sendFile(path.join(__dirname, '..', 'views', 'student', 'index.html'))
        } else {
          res.render(path.join('./error/error'), { error: 'Request failed: Password do not match' })
        }
      } else {
        res.render(path.join('./error/error'), { error: 'Request failed: No account found' })
      }

      res.redirect('/login/' + result.recordset[0].s_id)
    })
    .catch(err => {
      res.send({
        Error: err
      })
      console.log(err)
    })
})
// student api
router.get('/:id/api', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM STUDENTS WHERE s_id = '${req.params.id}';`)
    })
    .then(result => {
      res.send(result.recordset)
    })
    .catch(err => {
      res.send({
        Error: err
      })
      console.log(err)
    })
})

// get out
router.post('/logout', function (req, res) {
  OnlinStatus = false
  res.redirect('/')
})

// student groups
router.get('/:id/group', function (req, res) {
  if (OnlinStatus) {
    res.sendFile(path.join(__dirname, '..', 'views', 'student', 'groups.html'))
  } else { res.redirect('/login') }
})

// // Join a group
// router.get('/:sid/:gid/join', function (req, res) {
//   // first check how many groups you are on
//   db.pools
//     .then((pool) => {
//       return pool.request()
//         .query(`SELECT * FROM STUDGROUPS WHERE s_id = '${req.params.sid}' AND m_status = 'member';`)
//     })
//     .then(result => {
//       if (result.rowsAffected >= 10) {
//         res.render(path.join('./error/error'), { error: 'Request failed: You cant join more than 10 groups' })
//         res.redirect('/login/' + req.params.sid + '/group')
//       } else {
//         db.pools
//           .then((pool) => {
//             return pool.request()
//               .query(`INSERT INTO STUDGROUPS (g_id, s_id, m_status)
//           VALUES ('${req.params.gid}', '${req.params.sid}', 'waiting');`)
//           })
//           .then(result => {
//             console.log('Joined group successfully')
//             res.redirect('/login/' + req.params.sid + '/group')
//           })
//           .catch(err => {
//             res.render(path.join('./error/error'), { error: 'Request failed: already joined this group' })
//             res.redirect('/login/' + req.params.sid + '/group')
//             console.log(err)
//           })
//       }
//     })
//     .catch(err => {
//       res.send({
//         Error: err
//       })
//       console.log(err)
//     })
// })

// get joined group
router.get('/:sid/group/api', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM STUDGROUPS WHERE s_id = '${req.params.sid}' AND m_status != 'waiting';`)
    })
    .then(result => {
      res.send(result.recordset)
    })
    .catch(err => {
      res.send({
        Error: err
      })
      console.log(err)
    })
})

module.exports = router
