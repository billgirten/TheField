import * as constants from './constants.js';
import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';

let socketIO = null;

export const registerSocketEvents = socket => {
    socketIO = socket;

    socket.on("connect", () => {
        store.setSocketId(socket.id);
        ui.updatePersonalCode(socket.id);
    });

    socket.on('pre-offer', (data) => {
        webRTCHandler.handlePreOffer(data);
    });

    socket.on('pre-offer answer', (data) => {
        webRTCHandler.handlePreOfferAnswer(data);
    });

    socket.on('webRTC signaling', (data) => {
        switch(data.type) {
            case constants.webRTCSignaling.OFFER:
                webRTCHandler.handleWebRTCOffer(data);
                break;
            case constants.webRTCSignaling.ANSWER:
                webRTCHandler.handleWebRTCAnswer(data);
                break;
            case constants.webRTCSignaling.ICE_CANDIDATE:
                webRTCHandler.handleWebRTCCandidate(data);
                break;
            default:
                return;
        }
    });

    socket.on('user hang-up', () => {
        console.log('user HUNG UP');
        webRTCHandler.handleConnectedUserHangUp();
    });
};


export const sendPreOffer = data => {
    socketIO.emit('pre-offer', data);
};

export const sendPreOfferAnswer = preOfferAnswer => {
    socketIO.emit('pre-offer answer', preOfferAnswer)
};

export const sendDataUsingWebRTCSignaling = data => {
    socketIO.emit('webRTC signaling', data);
};

export const sendUserHangUp = data => {
    socketIO.emit('user hang-up', data);
};