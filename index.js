let express = require('express')
let bodyParser = require('body-parser')
let app = express()

let mainRoutes = require('./mainRoutes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(mainRoutes)

let port = process.env.PORT || 3000
app.listen(port, ()=> {
    console.log("Listening on port 3000")
})