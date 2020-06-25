require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Persons = require("./models/persons")

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('postbody', (req, res)=> {
    return req.method === "POST" ? JSON.stringify(req.body) : null
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :postbody'))


app.get("/api/persons", (req, resp) => {
    Persons.find({}).then(persons => {
        resp.json(persons)
    })
})

app.post("/api/persons", (req, resp) => {
    let newPerson = req.body

    if (!(newPerson.name && newPerson.number)){
        return resp.status(400).json({
            error: "Name or number missing"
        })
    }

    const person = new Persons({
        name: newPerson.name,
        number: newPerson.number
    })

    person.save()
    .then(savedPerson => {
        resp.json(savedPerson)
    })
})

app.get("/api/persons/:id", (req, resp) => {
    const id = req.params.id
    Persons.findById(id)
    .then(person => {
        resp.json(person)
    })
})

app.delete("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    resp.status(204).end()
})

app.get("/info", (req, resp) => {
    const date = new Date()
    resp.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br>
    <div>${date}</div>
    `)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})