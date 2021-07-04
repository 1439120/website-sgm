const path = require('path')
const express = require('express')
const db = require('../public/scripts/db')
const { v4: uuidv4 } = require('uuid')

/** ********************************** Creating a group */
const router = express.Router()
router.get('/create/:id', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'group', 'create.html'))
})
/** ******************* Posting the group name */
// create and join a group
router.post('/api/create/:sid', function (req, res) {
  // Make a query to the database
  const groupid = uuidv4()
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`INSERT INTO GROUPS (g_id, g_name, descript, d_created)
        VALUES ('${groupid}', '${req.body.gname}', '${req.body.descr}', GETDATE());`)
    })
    .then(result => {
      if (result.rowsAffected >= 1) console.log('Group account created succesffuly: ')
      // console.log(result)
      // res.redirect('/login/' + req.params.sid + '/group')
      db.pools
        .then((pool) => {
          return pool.request()
            .query(`INSERT INTO STUDGROUPS (g_id, s_id, m_status, m_votes, t_votes)
      VALUES ('${groupid}', '${req.params.sid}', 'master', 0, 0);`)
        })
        .then(result2 => {
          console.log('Joined group successfully')
          res.redirect('/login/' + req.params.sid + '/group')
        })
        .catch(err => {
          res.render(path.join('./error/error'), { error: 'Request failed: already joined this group' })
          res.redirect('/login/' + req.params.sid + '/group')
          console.log(err)
        })
    })
    .catch(err => {
      res.send({
        Error: err
      })
      console.log(err)
    })
})

/** ************************ page for typing on the group */
// post a message on a certain group
router.post('/api/:g_id/:s_id', function (req, res) {
  (async function () {
    try {
      const pool = await db.pools
      const result1 = await pool.request()
        // .input('input_parameter', sql.Int, value)
        .query(`INSERT INTO MESSAGES (g_id, m_message, m_link, m_date, s_id)
        VALUES ('${req.params.g_id}', '${req.body.comment}', '${req.body.link}', 
        GETDATE(), '${req.params.s_id}');`)
      console.log(result1)

      const result2 = await pool.request()
        .query(`INSERT INTO HISTORY (g_id, s_id, mssg, d_time)
        VALUES ('${req.params.g_id}', '${req.params.s_id}', 'shared a message on the group.', 
        GETDATE());`)
      console.log(result2)
      res.redirect(`/group/vgroup/${req.params.g_id}/${req.params.s_id}`)
    } catch (err) {
      res.send({
        Error: err
      })
      console.log(err)
    }
  })()
})

// get all messages on that group
router.get('/api/messages/:g_id', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM MESSAGES WHERE g_id = '${req.params.g_id}';`)
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
// router to view groups
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'group', 'view.html'))
})
/** ************ List group api */
router.get('/api/list', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query('SELECT * FROM GROUPS;')
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

/** ****************** group api ****************** */
router.get('/api/:id', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT * FROM GROUPS WHERE g_id = '${req.params.id}';`)
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

// Delete group
router.get('/:id/delete', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`DELETE FROM GROUPS WHERE g_id = '${req.params.id}';`)
    })
    .then(result => {
      console.log('Deleted group successfully')
      res.redirect('/group')
    })
    .catch(err => {
      res.send({
        Error: err
      })
      console.log(err)
    })
})

// check this, i only need the student id
// view group deatils using html
router.get('/vgroup/:id/:uid', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'group', 'view-content.html'))
})

// post an a meeting on the group
// stores the events on the database
router.post('/vgroup/:gid/:uid', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`INSERT INTO groupevents (g_id, e_title, e_date, e_start, e_end, e_descript, e_location, s_id)
    VALUES ('${req.params.gid}', '${req.body.title}', '${req.body.date}', '${req.body.time1}'
    , '${req.body.time2}', '${req.body.descr}', '${req.body.link}', '${req.params.uid}');`)
    })
    .then(result => {
      console.log('Event added to calendar')
      res.redirect('/calendar/' + req.params.uid)
    })
    .catch(err => {
      res.send({
        Error: err
      })
      console.log(err)
    })
})

// add a student to the group // joining a group
router.post('/add/:gid/:sid', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`INSERT INTO STUDGROUPS (g_id, s_id, m_status, m_votes, t_votes)
              VALUES ('${req.params.gid}', '${req.params.sid}', 'member', 0, 0);`)
    })
    .then(result => {
      console.log('Student added to group successfully')
      res.redirect('/login/' + req.params.sid + '/group')
    })
    .catch(err => {
      res.send({
        Error: err
      })
      console.log(err)
    })
})

// ask to join this group
router.get('/ask-to-join/:gid/:sid', function (req, res) {
  (async function () {
    try {
      const pool = await db.pools
      const result00 = await pool.request()
      // GET ALL MEMBERS OF THIS GROUP
        .query(`INSERT INTO STUDGROUPS (g_id, s_id, m_status, m_votes, t_votes)
              VALUES ('${req.params.gid}', '${req.params.sid}', 'waiting', 0, 0);`)
      if (result00.rowsAffected > 0) console.log('student asked to join this group')

      const result0 = await pool.request()
      // GET ALL MEMBERS OF THIS GROUP
        .query(`SELECT * from STUDGROUPS  WHERE g_id = '${req.params.gid}' AND m_status != 'waiting';`)
      // console.log(result0)

      const result1 = await pool.request()
      // UPDATE THE HISTORY
        .query(`INSERT INTO HISTORY (g_id, s_id, mssg, d_time)
            VALUES('${req.params.gid}', '${req.params.sid}', 'Student asked to join this group', 
            GETDATE());`)
      console.log(result1)

      // SEND THE NOTIFICATION TO ALL THE STUDENTS ON THE GROUP
      for (let i = 0; i < result0.recordset.length; i++) {
        const result2 = await pool.request()
          .query(`INSERT INTO NOTIFICATIONS ( s_id, g_id, mssg, i_date, from_id)
              VALUES ('${result0.recordset[i].s_id}', '${req.params.gid}',
              'A student asked to join your group' , GETDATE()  ,'${req.params.sid}');`)
        console.log(result2)
      }
    } catch (err) {
      res.send({
        Error: err
      })
      console.log(err)
    }
    res.redirect(`/login/${req.params.sid}/group`)
  })()
})
// ask to terminate a member
router.get('/ask-to-terminate/:gid/:sid/:forid', function (req, res) {
  (async function () {
    try {
      const pool = await db.pools

      // up votes
      const result0 = await pool.request()
        .query(`UPDATE STUDGROUPS
      SET t_votes = t_votes + 1
      WHERE s_id = '${req.params.forid}' AND g_id = '${req.params.gid}';`)

      // GET THE NEW VOTES
      const result11 = await pool.request()
        .query(`SELECT t_votes from STUDGROUPS  WHERE g_id = '${req.params.gid}' AND s_id = '${req.params.forid}';`)

      // get total number of members
      const result00 = await pool.request()
        .query(`SELECT * from STUDGROUPS  WHERE g_id = '${req.params.gid}' AND m_status != 'waiting';`)

      let nomem = false
      if (result11.recordset[0].t_votes >= result00.rowsAffected / 2 && result11.recordset[0].t_votes >= 1) {
        // delete the members
        nomem = true
        const result1 = await pool.request()
          .query(`DELETE STUDGROUPS  WHERE g_id = '${req.params.gid}' AND s_id = '${req.params.forid}';`)
        console.log('Student terminated')
      }

      if (!nomem) {
        // SEND THE NOTIFICATION TO ALL THE STUDENTS ON THE GROUP EXCEPT FOR HIM AND YOURSELF if not removed
        for (let i = 0; i < result00.recordset.length; i++) {
          const result2 = await pool.request()
            .query(`INSERT INTO NOTIFICATIONS ( s_id, g_id, mssg, i_date, from_id)
              VALUES ('${result00.recordset[i].s_id}', '${req.params.gid}',
              'A member asked to terminate this memeber' , GETDATE()  ,'${req.params.forid}');`)
          console.log(result2)
        }
      }
    } catch (err) {
      res.send({
        Error: err
      })
      console.log(err)
    }
    res.redirect(`/login/${req.params.sid}/group`)
  })()
})

// send invite to student to join a group
router.post('/invite/:gid/:sid', function (req, res) {
  (async function () {
    try {
      const pool = await db.pools
      const result1 = await pool.request()
        // .input('input_parameter', sql.Int, value)
        .query(`SELECT * from STUDENTS  WHERE s_email = '${req.body.email}';`)
      console.log(result1)
      if (result1.recordset.length > 0) {
        const result2 = await pool.request()
          .query(`INSERT INTO NOTIFICATIONS ( s_id, g_id, mssg, i_date, link)
            VALUES ('${result1.recordset[0].s_id}', '${req.params.gid}', 'You have been invited to join this group'
            , GETDATE() ,'/group/add/${req.params.gid}/${result1.recordset[0].s_id}');`)
        console.log(result2)
      } else {
        console.log('No account with that email found')
      }

      res.redirect(`/group/vgroup/${req.params.gid}/${req.params.sid}`)
    } catch (err) {
      res.send({
        Error: err
      })
      console.log(err)
    }
  })()
})

// GET MEMBERS OF THIS GROUP
router.get('/members/:gid', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`SELECT b.s_fname, b.s_email, b.s_id
          FROM STUDGROUPS a JOIN STUDENTS b
          ON a.s_id = b.s_id 
          WHERE g_id = '${req.params.gid}' AND m_status != 'waiting';`)
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

// view this person profile
router.get('/vgroup/:id/:uid/:forid', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'student', 'person.html'))
})

module.exports = router
