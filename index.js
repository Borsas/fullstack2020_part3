const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
      {
        "name": "Dan Abramov",
        "number": "143251346134613461346",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
  ]

app.get("/api/persons", (req, resp) => {
    resp.json(persons)
})

app.post("/api/persons", (req, resp) => {
    let newPerson = req.body

    if (!(newPerson.name && newPerson.number)){
        return resp.status(400).json({
            error: "Name or number missing"
        })
    }

    if (persons.find(person => person.name === newPerson.name)){
        return resp.status(400).json({
            error: "Name must be unique"
        })
    }

    const id = Math.floor(Math.random() *10000000)
    newPerson.id = id

    persons = persons.concat(newPerson)
    resp.json(newPerson)
})

app.get("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        resp.json(person)
    } else {
        resp.status(404).end()
    }
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})