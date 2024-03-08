# Backend-Task

Task to build appropriate models/tables, seed database with a large jsonl file (over 20,00,000 lines), and write API for CRUD-ing the records.

## Teach Stack:

-   Node.js
-   Express.js
-   MySQL with Sequelize

## How to run the app?

### Installation

Pre-requisite: Node.js, NPM

```sh
# git clone this repo and run
$ npm install
```

### Development

> Make `.env` file before running the project. Use `.env.example` to see the required fields.

```sh
# to start development server use
$ npm run dev

# use the following commands to assist development
$ npm run lint:fix  # to lint and fix using eslint
$ npm run format    # to format the code using prettier
```

### Production

> Make `.env` file before running the project. Use `.env.example` to see the required fields.

```sh
# for production use
$ npm run build     # to build using webpack
$ npm run prod      # to start the production server
```

### Data Migration

> Make `.env` file before running the project. Use `.env.example` to see the required fields.

> Run with caution as `db.sync({ force: tru})` is used in migration script (find in helpers)

```sh
# run with caution
$ npm run migrate   # to migrate jsonl data to mysql database

# use -f="data.jsonl"   to tell file path
# use -b=200            to tell batch size for bulk inserting
# use -c=50             to set concurrency limit (must be <= DB_POOL_MAX)
# use -l=1              to turn on logging
```
