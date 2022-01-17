/* 설치한 express 모듈 불러오기 */
const express = require('express')

/* 설치한 socket.io 모듈 불러오기 */
const socket = require('socket.io')

/* Node.js 기본 내장 모듈 불러오기 */
const http = require('http')

/* Node.js 기본 내장 모듈 불러오기 */
const fs = require('fs')
const { is } = require('express/lib/request')

/* express 객체 생성 */
const app = express()

/* express http 서버 생성 */
const server = http.createServer(app)

/* 생성된 서버를 socket.io에 바인딩 */
const io = socket(server)

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

/* Get 방식으로 / 경로에 접속하면 실행 됨 */
app.get('/', function(request, response) {
  fs.readFile('./static/index.html', function(err, data) {
    if(err) {
      response.send('에러')
    } else {
      response.writeHead(200, {'Content-Type':'text/html'})
      response.write(data)
      response.end()
    }
  })
})

io.sockets.on('connection', function(socket) {
  // 새로운 유저 접속시 타 소켓에 전파
  socket.on('newUser', function(name) {
    console.log(name + ' is connected.')
    // 소켓에 이름 저장
    socket.name = name
    // 모든 소켓에 전파
    io.sockets.emit('update', {
      type: 'connect',
      name: 'SERVER',
      message: name + ' is connected.'
    })
  })
  // 전송한 메시지 받기
  socket.on('message', function(data) {
    //받은 데이터에 누가 보냈는지 이름추가
    data.name = socket.name
    console.log(data)
    // 보낸사람 제외 나머지 유저에게 메시지 전송
    socket.broadcast.emit('update', data);
  })
  
  socket.on('disconnect', function() {
    console.log(socket.name + ' is disconnected.')
    socket.broadcast.emit('update', {
      type: 'disconnect',
      name: 'SERVER',
      message: socket.name + ' is disconnected.' 
    })
  })
})


/* 서버를 8080 포트로 listen */
server.listen(8080, function() {
  console.log('서버 실행 중..')
})

