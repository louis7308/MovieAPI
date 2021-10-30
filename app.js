const socketio = require('socket.io')
const express = require('express')
const http = require('http')
const fs = require('fs');

//좌석정보 초기값 { 0 : 통로 , 1 : 예약가능 좌석, 2 : 예약완료 좌석}
let seats = [
    [1,1,0,1,1,0,0,0,0,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,0,1,1,1,1,1,1,1,1,0,1,1]
]

const app = express();

app.get('/', (req, res, next) => {
    fs.readFile('HTMLpage.html', (err, data) => {
        res.send(data.toString())
    })
})

app.get('/seats', (req, res, next) => {
    console.log('서버에서 남은 좌석 현황 로그')
    res.send(seats)
})

let server = http.createServer(app);
server.listen(3000, () => {
    console.log('서버가 3000번 포트에서 대기중')
})

const io = sockeio.listen(server)
io.sockets.on('connect', (socket) => {
    // 소켓 서버에 reserve 이벤트 설정
    socket.on('reserve', (data) => {
        // 클라이언트가 reserver 이벤트를 호출하면 함께
        // 전송된 좌석좌표(x, y)값을 예약상태 (1 -> 2)로 변경
        seats[data.y][data.x] = 2;
        // 실시간으로 모든 클라이언트 들에게 reserver 이벤트를 호출하여 예약 완료된
        // 좌석 정보를 실시간으로 보내줌
        io.sockets.emit('reserver', data);
    })
})