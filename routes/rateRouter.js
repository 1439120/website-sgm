// const path = require('path')
const express = require('express')
const db = require('../public/scripts/db')

const ToNum = (val) => {
  if (val === '1') {
    return { name: 'one', value: 1 }
  } else if (val === '2') {
    return { name: 'two', value: 2 }
  } else if (val === '3') {
    return { name: 'three', value: 3 }
  } else if (val === '4') {
    return { name: 'four', value: 4 }
  } else if (val === '5') {
    return { name: 'five', value: 5 }
  }
}

const router = express.Router()

// GET THE RATING FROM THIS STUDENT
router.get('/rating/:sid', function (req, res) {
  db.pools
    .then((pool) => {
      // find out the value
      return pool.request()
        .query(`SELECT * FROM RATINGS
            WHERE s_id = '${req.params.sid}';`)
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

// ask to join this group
router.post('/api/:sid/:id/:gid', function (req, res) {
  (async function () {
    try {
      const pool = await db.pools
      const result0 = await pool.request()
        // Rate student
        .query(`UPDATE RATINGS
        SET ${ToNum(req.body.rate).name} = ${ToNum(req.body.rate).name} + 1
        WHERE s_id = '${req.params.sid}';`)

      if (!(result0.rowsAffected > 0)) {
        // add the student to rate
        const result1 = await pool.request()
          .query(`INSERT INTO
            RATINGS (s_id)
            VALUES('${req.params.sid}');`)

        if (result1.rowsAffected > 0) {
          const result2 = await pool.request()
            .query(`UPDATE RATINGS
                SET ${ToNum(req.body.rate).name} = ${ToNum(req.body.rate).name} + 1
                WHERE s_id = '${req.params.sid}';`)

          if (result2.rowsAffected > 0) console.log('student rated successfully')
        }
        // res.redirect('/group/vgroup/' + req.params.gid + '/' + req.params.id)
      } else {
        console.log('student rated')
      }
    } catch (err) {
      res.send({
        Error: err
      })
      console.log(err)
    }
    res.redirect('/group/vgroup/' + req.params.gid + '/' + req.params.id)
  })()
})

module.exports = router
