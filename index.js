const express = require('express')
const app = express()

app.use(express.json());


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


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
    const date = new Date()
    res.type('text/html');
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log(body)

    if (!body.name || !body.person) {
        return response.status(400).json({ 
          error: 'name missing or person missing' 
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }

    const person = {
        name: body.name,
        person: body.person,
        id: Math.floor(Math.random() * 1000)
    }
    console.log(person)

    persons = persons.concat(person)

    response.json(person)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})