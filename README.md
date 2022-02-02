# poc-teacher-has-available

> POC to check the teachers availability to teach

## env variables

```bash
REDIS_HOST='localhost'
REDIS_PORT=6379
REDIS_PASSWORD=''
PORT=3001
```

## Database

We use SQLite database for this example.
You can use any database you want.
You don't need to configure anything, just run the server.

## Installation and usage

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
