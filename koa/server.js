// var http = require("http");

// http.createServer(function(request, response) {
//   response.writeHead(200, {'Content-type': 'text/plain'});
//   response.end('Hello World')
// }).listen(8889)

const Koa = require('./koa/application')
const app = new Koa()

app.use((ctx, next) => {
  console.log(1)
  next()
  console.log(2)
})
app.use((ctx, next) => {
  console.log(3)
  next()
  console.log(4)
})
app.use((ctx, next) => {
  console.log(5)
  next()
  console.log(6)
})

app.listen(8889)