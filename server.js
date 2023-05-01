const app = require('./app')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const connection = mongoose.connect(process.env.HOST)

connection
  .then(() => {
    app.listen(3000, function () {
      console.log(`Database connection successful ${3000}`)
    })
  })
  .catch((err) =>{
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1)}
  )
