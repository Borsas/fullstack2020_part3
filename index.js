const express = require("express")
const app = express()

app.use(express.json())

const persons = [
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

app.get("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        resp.json(person)
    } else {
        resp.status(404).end()
    }
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