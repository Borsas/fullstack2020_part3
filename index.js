require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Persons = require("./models/persons")

// Middleware
app.use(cors())
app.use(express.static("build"))
app.use(express.json())
morgan.token("postbody", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : null
})
app.use(morgan(":method :url :status :res[content-length] :response-time ms :postbody"))


app.get("/api/persons", (req, resp) => {
    Persons.find({}).then(persons => {
        resp.json(persons)
    })
})

app.post("/api/persons", (req, resp, next) => {
    let newPerson = req.body

    const person = new Persons({
        name: newPerson.name,
        number: newPerson.number
    })

    person.save()
    .then(savedPerson => {
        resp.json(savedPerson)
    })
    .catch(err => next(err))
})

app.get("/api/persons/:id", (req, resp, next) => {
    const id = req.params.id
    Persons.findById(id)
    .then(person => {
        if (person){
            resp.json(person)
        } else {
            resp.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, resp, next) => {
    const id = req.params.id
    Persons.findByIdAndDelete(id)
    .then(() => {
        resp.status(204).end()
    })
    .catch(err => next(err))
})

app.put("/api/persons/:id", (req, resp, next) => {
    const id = req.params.id
    const body = req.body

    const person = {
        number: body.number
    }
    Persons.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
        if (updatedPerson){
            resp.json(updatedPerson)
        } else {
            resp.status(400).end()
        }
    })
    .catch(error => next(error))
})

app.get("/info", (req, resp, next) => {
    const date = new Date()
    Persons.collection.countDocuments()
    .then(count => {
        resp.send(`
        <div>Phonebook has info for ${count} people</div>
        <br>
        <div>${date}</div>
    `)
    })
    .catch(error => next(error))
})

const handleErrors = (error, req, resp, next) => {
    console.log(error)

    if (error.name === "CastError") {
        return resp.status(400).send({ error: "Malformed id" })
    } else if (error.name === "ValidationError") {
        return resp.status(400).json({ error: error })
    } else if (error.name === "MongoError") {
        return resp.status(400).send({ error: error })
    }
    next(error)
}

app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})