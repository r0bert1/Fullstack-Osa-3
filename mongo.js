const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb://fullstack:${password}@ds125125.mlab.com:25125/fullstack2019-puhelinluettelo`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]
  
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(response => {
    console.log(`lisätään ${name} numero ${number} luetteloon`);
    mongoose.connection.close();
  })
} else {
  console.log('puhelinluettelo:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}