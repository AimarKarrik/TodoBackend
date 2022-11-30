# todo-backend

## Setup
Add correct database credentials and dialect to `config/database.json`.
It should work with all dialects supported by sequelize but only tested with mySQL.

Create the mySQL database with `sequelize db:create` if it doesn't exist.
```bash
    sequelize db:create
```

Run migrations.
```bash
    sequelize db:migrate
```

Start the server.
```bash
    npm start
```
## Querying
