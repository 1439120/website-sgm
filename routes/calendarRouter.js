const path = require('path')
const express = require('express')
const db = require('../public/scripts/db')

const router = express.Router()

router.get('/:sid', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'student', 'calendar.html'))
})

// get the events according to the group they are in of this student
router.get('/:gid/groupevents', function (req, res) {
  // first get the groups the student joined
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM groupevents WHERE g_id = '${req.params.gid}';`)
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

// get notifications
router.get('/:sid/notification', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'student', 'notification.html'))
})

// get the notifications api
router.get('/:sid/notification/api', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT a.g_id, a.s_id, b.g_name, a.mssg, a.i_date, a.link, a.from_id
        FROM NOTIFICATIONS a JOIN GROUPS b
        ON a.g_id = b.g_id 
        WHERE a.s_id = '${req.params.sid}';`)
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

/** **************************** Group History ************************* */
router.get('/vgroup/history/:id', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'group', 'history.html'))
})

// Getting the history
router.get('/api/:g_id/history', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT a.g_id, b.s_fname, b.s_email, a.mssg, a.d_time
        FROM HISTORY a JOIN STUDENTS b
        ON a.s_id = b.s_id 
        WHERE a.g_id = '${req.params.g_id}';`)
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

// on the notifications vote in a member
router.post('/vote/:gid/:sid/:forid', function (req, res) {
  (async function () {
    try {
      const pool = await db.pools
      if (req.body.yesno === 'Yes') {
        // UPDATES VOTES FOR THAT STUDENT
        console.log('They chose yes')
        const result00 = await pool.request()
          .query(`UPDATE STUDGROUPS
              SET m_votes = m_votes + 1
              WHERE s_id = '${req.params.forid}' AND g_id = '${req.params.gid}';`)
        if (result00.rowsAffected === 0) {
          console.log('student not found')
          res.redirect('/login/' + req.params.sid)
        } else {
          // DELETE THE NOTIFICATION AFTER VOTING
          const result2 = await pool.request()
            .query(`DELETE NOTIFICATIONS
          WHERE s_id = '${req.params.sid}' AND g_id = '${req.params.gid}' AND from_id = '${req.params.forid}';`)
          // console.log(result2)
          console.log('notification removed')
        }
      } else {
        // UPDATES terminate votes
        console.log('They chose no')
        const result00 = await pool.request()
          .query(`UPDATE STUDGROUPS
              SET t_votes = t_votes + 1
              WHERE s_id = '${req.params.forid}' AND g_id = '${req.params.gid}';`)
        if (result00.rowsAffected === 0) {
          console.log('student not found')
          res.redirect('/login/' + req.params.sid)
        } else {
          // DELETE THE NOTIFICATION AFTER VOTING
          const result2 = await pool.request()
            .query(`DELETE NOTIFICATIONS
          WHERE s_id = '${req.params.sid}' AND g_id = '${req.params.gid}' AND from_id = '${req.params.forid}';`)
          // console.log(result2)
          console.log('notification removed')
        }
      }

      // GET ALL THE MEMBERS
      const result0 = await pool.request()
        .query(`SELECT * from STUDGROUPS  WHERE g_id = '${req.params.gid}' AND m_status != 'waiting';`)
      // console.log(result0)

      // GET THE NEW VOTES
      const result11 = await pool.request()
        .query(`SELECT m_votes, t_votes from STUDGROUPS  WHERE g_id = '${req.params.gid}' AND s_id = '${req.params.forid}';`)
      // console.log(result11)

      if (result11.rowsAffected === 0) console.log('student didnt send invitation')

      // ADD STUDENT IF THEY HAVE ENOUGH VOTES
      if (result11.recordset[0].m_votes >= result0.rowsAffected / 2 && result11.recordset[0].m_votes >= 1) {
        const result1 = await pool.request()
          .query(`UPDATE STUDGROUPS
            SET m_status = 'member'
            WHERE s_id = '${req.params.forid}' AND g_id = '${req.params.gid}' ;`)
        // console.log(result1)
        console.log('Student added to group')

        // delete the notification to all the students
        const result3 = await pool.request()
          .query(`DELETE NOTIFICATIONS
          WHERE g_id = '${req.params.gid}' AND from_id = '${req.params.forid}';`)
          // console.log(result2)
      }

      // delete student
      if (result11.recordset[0].t_votes >= result0.rowsAffected / 2 && result11.recordset[0].t_votes >= 1) {
        const result1 = await pool.request()
          .query(`DELETE STUDGROUPS
            WHERE s_id = '${req.params.forid}' AND g_id = '${req.params.gid}' ;`)
        // console.log(result1)
        console.log('Student DELETE to group')

        // delete the notification to all the students
        const result3 = await pool.request()
          .query(`DELETE NOTIFICATIONS
          WHERE g_id = '${req.params.gid}' AND from_id = '${req.params.forid}';`)
          // console.log(result2)
      }
      res.redirect(`/login/${req.params.sid}/group`)
    } catch (err) {
      res.send({
        Error: err
      })
      console.log(err)
    }
  })()
})
module.exports = router
