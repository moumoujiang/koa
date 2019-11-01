### 核心点
1. listen http的语法糖， 使用http.createServer()监听端口
2. ctx 上下文机制（绕）
3. use 中间件（洋葱模型）

### 文件
1. application.js 入口文件
2. context.js 是上下文对象相关
3. request.js 是请求对象相关
4. response.js 是响应对象相关