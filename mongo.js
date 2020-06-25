const mongoose = require("mongoose")


const main = () => {
    const password = process.argv[2]
    const dbUrl = `mongodb+srv://borsas:${password}@cluster0-esuxy.mongodb.net/persons?retryWrites=true&w=majority`
    mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })

    personSchema.set("toObject", {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    const Person = mongoose.model("Person", personSchema)

    if (process.argv.length === 3) {
        getPersons(Person)
    } else {
        const newName = process.argv[3]
        const newNumber = process.argv[4]
        savePerson(newName, newNumber, Person)
    }
}

const getPersons = (Person) => {
    console.log("Phonebook:")
    Person
        .find({})
        .then(persons => {
            persons.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
}

const savePerson = (newName, newNumber, Person) => {
    const person = new Person({
        name: newName,
        number: newNumber
    })

    person.save().then(() => {
        console.log(`Added ${newName} ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>")
    process.exit(1)
} else {
    main()
}