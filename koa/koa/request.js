const url = require('url')
let request = {
  get url() {
    // console.log(this.req)
    return this.req.url;
  },
  get path() {
    return url.parse(this.req.url).pathname
  },
  get query() {
    return url.parse(this.req.url).query
  }
}

module.exports = request