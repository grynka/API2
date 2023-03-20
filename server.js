const app = require('./app')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const connection = mongoose.connect(process.env.HOST)

connection
  .then(() => {
    app.listen(process.env.PORT, function () {
      console.log(`Database connection successful ${process.env.PORT}`)
    })
  })
  .catch((err) =>{
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1)}
  )
