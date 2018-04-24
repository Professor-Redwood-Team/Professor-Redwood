const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const client = require('./src/client')
const config = require('./config/secrets.json')
const SwitchRouter = require('./routes/switch')

const { token } = config.discord;
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/switch', SwitchRouter)
client.login(token);


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})