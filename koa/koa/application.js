// 入口文件
const http = require("http")
let Stream = require('stream') // 引入stream
const EventEmitter = require('events') // 事件模块（发布订阅）
const context = require('./context') // 上下文对象
const request = require('./request') // 请求对象
const response = require('./response') // 响应对象

// 定义Koa
class Koa extends EventEmitter {
  constructor() {
    super();
    // this.fn = null;
    this.middlewares = [];
    // 将三个模块挂载到实例上
    this.context = context;
    this.request = request;
    this.response = response;
  }

  // 中间件方法
  use(fn) {
    // this.fn = fn;
    this.middlewares.push(fn)
  }

  // 洋葱模型
  compose(middlewares, ctx) {
    function dispatch(index) {
      if(index >= middlewares.length) {
        return Promise.resolve()
      }  
      let middleware = middlewares[index];
      return Promise.resolve(middleware(ctx, () => dispatch(index+1)))
    }
    return dispatch(0)
  }

  // 处理上下文对象
  createCotext(req, res) {
    // 使用Object.create()方法是为了继承this.context但在增加属性时不影响原对象
    const ctx = Object.create(this.context);
    const request = ctx.request = Object.create(this.request);
    const response = ctx.response = Object.create(this.response)
    // 重点 交叉引用
    ctx.req = request.req = response.req = req;
    ctx.res = request.res = response.res = res;
    request.ctx = response.ctx = ctx;
    request.response = response;
    response.resquest = request;

    return ctx;
  }

  // 处理请求的函数
  handleRequest(req, res) {
    res.statusCode = 404; // 默认404
    let ctx = this.createCotext(req, res);
    // 调用用户给的回调， 并将ctx（上下文对象）给用户使用
    // this.fn(ctx);
    let fn = this.compose(this.middlewares, ctx)
    fn.then(() => {
      if(typeof ctx.body == 'object') {
        res.setHeader('Content-Type', 'application/json;charset=utf8');
        res.end(JSON.stringify(ctx.body))
      }else if(ctx.body instanceof Stream){ // 如果是流
        ctx.body.pipe(res)
      }else if(typeof ctx.body == 'string' || Buffer.isBuffer(ctx.body)) {
        res.setHeader('Content-Type', 'text/html;charset=utf8');
        res.end(ctx.body)
      }else{
        res.end('Not found');
      }
    }).catch(err => {
      this.emit('error', err);
      res.statusCode = 500;
      res.end('server error');
    })
  }
  

  // 监听端口
  listen(...args) {
    let server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }
}

module.exports = Koa;