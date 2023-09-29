require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require("./models/person")

const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(cors())
app.use(express.static('dist'))
app.use(express.json());

//app.use(requestLogger);

//app.use(morgan('tiny'))

morgan.token('postdata', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    return null;
});

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const morganFormat = ':method :url :status :res[content-length] - :response-time ms :postdata';

app.use(morgan(morganFormat, {
    skip: (req, res) => req.method !== 'POST'
}));

/*
app.use((request, response, next) => {
    if (request.method === 'POST') {
        console.log('POST ',
        JSON.stringify(request.url),
        response.statusCode,
        JSON.stringify(request.body).length,
        JSON.stringify(request.body));
    }
    next();
});
*/


app.get('/', (req, res) => {
    res.static('index.html')
})


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
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

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name missing or person missing' 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })


    person.save().then(savedPerson => {
        response.json(savedPerson)
    })


    //console.log(person)
    /*
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }
    */
    
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})