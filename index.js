const express = require('express')
const app = express()
const port = 3000
const { accessLog, errorLog, setHeaders, validateUser } = require("./middleware/index");

app.use(accessLog);

app.get('/', setHeaders, (req, res) => {
  res.status(200).send(`<h1>Hello from ${req.hostname}</h1>`)
})

app.get('/private', validateUser, (req, res) => {
  res.status(200).send(`<h1>Welcome back, ${req.locals.user.name}</h1>`)
});

app.use(errorLog)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});