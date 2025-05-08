# Node.js Express Application Structure Guide

## Overview

This document outlines a recommended structure for Node.js/Express applications following a layered architecture pattern.

## Project Structure

```
project-root/
├── index.js                  # Application entry point
├── routers/                  # Route definitions
│   └── personRouter.js
├── services/                 # Business logic
│   └── personService.js
├── repositories/             # Data access
│   └── personRepository.js
├── models/                   # Data models (for DB)
│   └── person.js
├── data/                     # JSON files (if used)
├── config/                   # Configuration files
│   └── db.js
├── prisma/                   # Connection To remote DB (schemas and setup)
└── utils/                    # Helper functions
```

## Layer Responsibilities

### 1. Entry Point (index.js)
- Initializes the Express application
- Sets up middleware
- Connects routers
- Starts the server

```javascript
const express = require('express');
const personRouter = require('./routers/personRouter');

const app = express();
app.use(express.json());
app.use('/api/persons', personRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### 2. Router Layer
- Defines API endpoints
- Extracts data from requests
- Validates request data
- Calls appropriate service functions
- Returns responses

```javascript
const express = require('express');
const personService = require('../services/personService');

const router = express.Router();
// Entry point http://localhost:3010/api/persons
// -- CRUD --

// GET all persons
router.get('/', async (req, res) => {
  try {
    const filters = req.query; // url query ?name=John&age=>30 ...
    const persons = await personsService.getAllPersons(filters);
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (update) a person
router.put('/:id', async (req, res) => {
  try {
    const personToUpdate = req.body; // getting objects from the body (converted from json by middleware app.use(express.json());)
    const idOfPersonToUpdate = req.params.id; // getting from the url (:/id)
    const updatedPerson = await personsService.updatePerson(idOfPersonToUpdate, personToUpdate);
    res.json(updatedPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
```

### 3. Service Layer
- Contains business logic
- Coordinates between multiple repositories if needed
- Performs data validation and transformations
- Handles business rules

```javascript
const personRepository = require('../repositories/personRepository');

const personsService = {
    getAllPersons: async (filters = {}) => {
    // cascade filters to db
    return await personRepository.findAll(filters);
  }

  getAllCities: async (filters = {}) => {
    // Validate data
    // Apply business rules
    const persons = await personsRepo.getAllPersons(filters);
    return [...new Set(persons.map(person => person.city))];
  }
}

module.exports = PersonService;
```

### 4. Repository Layer
- Abstracts data access
- Handles CRUD operations
- Can work with different data sources:
  - Database (**via models**)
  - JSON files
  - External APIs/web services

```javascript
// _______ Option1:  In DB - Via model _______ 
const PersonModel = require('../models/personModel');
const personsRepo = { 
  findAll: async (filters) => {
    return personModel.findAll(filters)
    /** in personModel 
     *     return prisma.person.findMany({
                where: filters
            });
     */
  }
}
module.exports = personsRepo;

// ________ Option2: In JSON _______
let jf = require('jsonfile');
const FILE = './data/persons.json'; // the relative path from the main runnable file (index.js)

const personsRepo = {
  getUsers: async (filters) => {
    return jf.readFile(FILE);
  },
  
  setUsers: async(personData) => {
    const person = new Person(personData);
    return await person.save();
  }
}
module.exports = personsRepo

// _______ Option3:  in web service  _______ 
const axios = require('axios')
const USERS_URL = 'https://jsonPlaceholder.typicode.com/users';

const personsRepo = {
getUserById: async (id) => {
    return axios.get(`${USERS_URL}/${id}`);
}
}
module.exports = personsRepo
```

### 5. Model Layer

- ONLY used with databases
- ONLY layer allowed to interact with database
- Handles ORM/Prisma operations
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PersonModel = {
  findAll: async (filters) => {
    return prisma.person.findMany({ where: filters });
  },
  
  findById: async (id) => {
    return prisma.person.findUnique({ where: { id: parseInt(id) }});
  }
};
```
## Best Practices

1. **Separation of Concerns**: Each layer has a specific responsibility.
2. **Error Handling**: Implement consistent error handling across layers.
3. **Configuration**: Keep configuration separate from code.
4. **Middleware**: Use middleware for cross-cutting concerns like authentication and logging.

## Flow of a Request

1. Client sends request to an endpoint
2. Router receives the request and extracts data
3. Router calls appropriate service method
4. Service implements business logic
5. Service uses repository for data access
6. Repository interacts with the data source
7. Data flows back up through the layers
8. Router sends response to client

This architecture provides a clean separation of concerns, making the application easier to maintain, test, and extend.