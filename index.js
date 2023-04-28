const databaseConfig = require('./config/database')
const expressConfig = require('./config/express')
const routesConfig = require('./config/routes')

const app = require('express')()
const port = 3000

start()

async function start() {
    await databaseConfig(app)
    expressConfig(app)
    routesConfig(app)

    app.listen(port, () => console.log(`Listening at ${port}`))
}