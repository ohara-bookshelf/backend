## Pre-requisites

- Docker with docker compose installed
- env file with the following variables
  - GAUTH_CLIENT_ID
  - DATABASE_URL
  - SESSION_SECRET
  - JWT_SECRET

## Installation

```bash
$ npm start:init:dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# pre e2e tests
$ pretest:e2e

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
