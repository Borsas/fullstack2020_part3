const express = require("express")
const app = express()

app.use(express.json())

const notes = {
    "persons": [
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
  }

app.get("/api/notes", (req, resp) => {
    resp.json(notes)
})

app.get("/info", (req, resp) => {
    const date = new Date()
    resp.send(`
    <div>Phonebook has info for ${notes.persons.length} people</div>
    <br>
    <div>${date}</div>
    `)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})