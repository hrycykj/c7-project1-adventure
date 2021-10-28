const express = require('express')
const adventureRouter = require('./routes/adventureRoutes')

const app = express()
const port = 3000

app.use(adventureRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})