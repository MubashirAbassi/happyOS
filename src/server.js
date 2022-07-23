const express = require ('express')
const path = require ('path')
const bodyParser = require ('body-parser')
const hbs = require('hbs')
const session = require('express-session')
var port = process.env.PORT || 3000
const db = require('../db.js')
const userRoutes = require('../routers/userRoute.js')
const policyRoutes = require('../routers/policyRoute.js')
const app = express()


const publicDir = path.join(__dirname , '../public') //setting path to html file directory
const views_location = path.join(__dirname , '../templates/views')
const partials_location = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', views_location) //changing default folder directory of views to custom name (templates/views)
hbs.registerPartials(partials_location)

app.use(express.static(publicDir))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret : 'key1',
    resave : false,
    saveUninitialized : false
}))

app.use(userRoutes)
app.use(policyRoutes)

app.listen(port, function() {
    console.log('listening on port : ', port)
})
