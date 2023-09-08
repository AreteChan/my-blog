const express = require('express')
const router = require('./routes')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const AppError = require('./utils/appError')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

// cors解决跨域
// const corsOption = {
//   origin: true,   
//   credentials: true // 允许跨域携带cookie
// }
// app.use(cors(corsOption))

const swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Swagger API for Node.js',
  },
  host: 'localhost:5000',
  basePath: '/',
}

const options = {
  swaggerDefinition,
  // apis: ['./routes/*.js'], // 写有注解的router的存放地址
  apis: ['app.js']
}

const swaggerSpec = swaggerJSDoc(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.get('/api-docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})


/**,
 * @swagger
 * /url:
 *   get:
 *      tags:
 *      - 这里是TAG
 *      description: 这里是描述
 *      summary: 这里是摘要
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: 这里是响应的描述
 *          schema:
 *            ref: #/definitions/Order
 *        400:
 *          description: Invalid ID supplied
 *        404:
 *          description: Order not found
 * */
 app.get("/url", function (req, res, next) {
  res.send("test");
});


dotenv.config({ path: './config.env' })

// 解析json数据 
app.use(express.json({ limit: '10kb' }))
app.use(express.static('uploads'))
app.use(cookieParser())

// 连接数据库
const DB = process.env.DB
mongoose.connect(DB)
  .then(con => {
  // console.log(con.connections)
  console.log('DB connection successful!')
}).catch(err => {
  console.log('DB connection failed!', err)
})




// 路由
app.use('/api', router)


// 错误url处理
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})
// 全局错误处理
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err
  })
})


app.listen('5000', () => {
  console.log('app running at port 5000')
})