const Connection = require('pg').Pool

const connection = new Connection({
    user: "postgres",
    password: "admin",
    database: "db_contacts",
    host: "localhost",
    port: "5432"
})

module.exports = connection