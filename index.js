require("dotenv").config()
const express = require("express")
var morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

const app = express()

var process = require("process")

const PORT = process.env.PORT

/*
const requestLogger = (request, response, next) => {
    console.log("Method:", request.method)
    console.log("Path:  ", request.path)
    console.log("Body:  ", request.body)
    console.log("---")
    next()
}
*/

app.use(cors())
app.use(express.static("dist"))
app.use(express.json())

//app.use(requestLogger);

//app.use(morgan("tiny"))

morgan.token("postdata", (req) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    }
    return null
})

//app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

const morganFormat = ":method :url :status :res[content-length] - :response-time ms :postdata"

app.use(morgan(morganFormat, {
    skip: (req) => req.method !== "POST"
}))

/*
app.use((request, response, next) => {
    if (request.method === "POST") {
        console.log("POST ",
        JSON.stringify(request.url),
        response.statusCode,
        JSON.stringify(request.body).length,
        JSON.stringify(request.body));
    }
    next();
});
*/



app.get("/", (request, response) => {
    response.static("index.html")
})


app.get("/api/persons", (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
        .catch(error => next(error))
})

app.get("/api/info", (request, response, next) => {
    const date = new Date()
    response.type("text/html")

    Person.find({}).then(persons => {
        //console.log(persons.length)
        response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
    })
        .catch(error => next(error))

})

app.get("/api/persons/:id", (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
    /*
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: "malformatted id" })
    })
    */
        .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name missing or person missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })


    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
        .catch(error => next(error))


    //console.log(person)
    /*
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
          error: "name must be unique"
        })
    }
    */

})



app.delete("/api/persons/:id", (request, response, next) => {
    console.log("deleting Person", request.params.id)
    Person.findByIdAndRemove(request.params.id)
        .then( () => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body


    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: "query" })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
}


app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        console.log("Validation error")
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})