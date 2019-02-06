const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('data', (req, res) => {
  const data = JSON.stringify(req.body)
  return data
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "045-1236543"
  },
  {
    "id": 2,
    "name": "Arto Järvinen",
    "number": "041-21423123"
  },
  {
    "id": 3,
    "name": "Lea Kutvonen",
    "number": "040-4323234"
  },
  {
    "id": 4,
    "name": "Martti Tienari",
    "number": "09-784232"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === '') {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (body.number === '') {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  }

  const newPerson = persons.find(person => person.name === body.name)

  if (newPerson !== undefined) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})