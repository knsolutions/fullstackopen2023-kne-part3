const express = require('express')
const app = express()

let persons = [
    {
        name: "Arto Hellas",
        person: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        person: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        person: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        person: "39-23-6423122",
        id: 4
    }
]

app.get('/', (req, res) => {
  res.send('<h1>Pääsivu</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = person(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/person/:id', (request, response) => {
    const id = person(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})