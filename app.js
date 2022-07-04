const express = require('express');
const http = require('http');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'public/index.html');
});

let connectedPeers = [];

io.on('connection', (socket) => {
    connectedPeers.push(socket.id);
    console.log(connectedPeers);

    socket.on('pre-offer', (data) => {
        const { callType, calleePersonalCode } = data;
        const connectedPeer = connectedPeers.find((peerSocketId) => peerSocketId === calleePersonalCode);
        if(connectedPeer) {
            const data = {
                callerSocketId: socket.id,
                callType,
            };
            io.to(calleePersonalCode).emit('pre-offer', data);
        } else {
            const advisory = {
                preOfferAnswer: 'CALLEE_NOT_FOUND'
            }
            io.to(socket.id).emit('pre-offer answer', advisory);
        };
    })

    socket.on('pre-offer answer', (preOfferAnswer) => {
        const targetPeer = connectedPeers.filter(connectedPeer => connectedPeer === preOfferAnswer.callerSocketId);
        if(targetPeer) {
            io.to(preOfferAnswer.callerSocketId).emit('pre-offer answer', preOfferAnswer);
        };
    });

    socket.on('webRTC signaling', (data) => {
        const targetPeer = connectedPeers.filter(connectedPeer => connectedPeer === data.connectedUserSocketId);
        if(targetPeer) {
            io.to(data.connectedUserSocketId).emit('webRTC signaling', data);
        };
    });

    socket.on('user hang-up', (data) => {
        const targetPeer = connectedPeers.filter(connectedPeer => connectedPeer === data.connectedUserSocketId);
        if(targetPeer) {
            io.to(data.connectedUserSocketId).emit('user hang-up');
        };
    });

    socket.on('disconnect', () => {
        const remainingPeers = connectedPeers.filter(connectedPeer => connectedPeer !== socket.id);
        connectedPeers = remainingPeers;
        console.log(remainingPeers);
    });
});

server.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
});