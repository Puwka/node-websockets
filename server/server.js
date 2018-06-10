import path from 'path'
import koa from 'koa'
import config from './config/default'
import serve from 'koa-static'

const clientPath = path.join(__dirname, '../client')
const port = process.env.PORT || config.server.port

const app = new koa()

app.use(serve(clientPath))

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
