const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// register view engine
app.set('view engine', 'ejs')

// tell Express to use bodyParser for JSON and URL encoded form bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// loading routes
const homeRouter = require('./routes/homeRouter.js')
const groupRouter = require('./routes/groupRouter.js')
const calendarRouter = require('./routes/calendarRouter.js')
const loginRouter = require('./routes/loginRouter.js')
const rateRouter = require('./routes/rateRouter.js')

// mounting our routes
app.use('/', homeRouter)
app.use('/group', groupRouter)
app.use('/calendar', calendarRouter)
app.use('/login', loginRouter)
app.use('/rate', rateRouter)

app.use('/cdn', express.static('public'))

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
