# Edir

![Preview](README/github-preview.gif)


## Purpose

**Edir** is the modern approach of Ethiopian tradition which brings people together during funerals to help each other. The web app provides a modern way and shares Ethiopians people tradition with other cultures around the world. The platform is easy to access and can be customized for the specific needs of the culture. It allows people to cover their expenses during funeral ceremonies.

### Running the project

The project is structured into 2 workspaces:

- frontend
- backend

#### Frontend prerequisites

- [node ^20](https://nodejs.org/en)

#### Backend prerequisites

- [node ^20](https://nodejs.org/en)
- [postgresql](https://postgresql.org)

## Setup

1. `npm install`
2. Create a PostgreSQL database, or use an existing one from the previous exercises.
3. Setup `.env` files in `client` and `server` based on `.env.example` files.

## Tests

```bash
# using -w packageName is not required
# if you are already in the package directory

# front end unit and E2E tests
npm test -w client

# front end unit tests
npm run test:unit -w client

# front end E2E tests
npm run test:e2e -w client

# back end tests with an in-memory database
npm test -w server

# back end tests with a development database
npm run test:db -w server
```

## Running the server

In development mode:

```bash
npm run dev
```

In development mode:

```bash
npm run dev
```

### Technologies used

- [vue.js](https://vuejs.org/)
- [Node.js](https://nodejs.org/en)
- [postgresql.org](https://www.postgresql.org/)
