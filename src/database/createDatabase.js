import pg from "pg"
import dotenv from "dotenv"

dotenv.config({ quiet: true })

const { Client } = pg

const createDatabase = async () => {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres'
    })

    await client.connect()

    const dbName = process.env.DB_NAME

    const res = await client.query(
        `SELECT 1 FROM pg_database WHERE datname='${dbName}'`
    )

    if (res.rowCount === 0) {
        console.log(`Creating database ${dbName}`)
        await client.query(`CREATE DATABASE ${dbName}`)
    } else {
        console.log(`Database ${dbName} already exists`)
    }

    await client.end()
}

createDatabase()