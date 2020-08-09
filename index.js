const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./routes/routes')
const mongoose = require('mongoose')
const PORT = 4000

mongoose.connect('mongodb://localhost/Users', { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected")
});

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use('/', router)


app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})