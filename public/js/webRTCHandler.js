import * as constants from './constants.js';
import * as store from './store.js'
import * as ui from './ui.js';
import * as wss from './wss.js';

let connectedUserDetails;
let peerConnection;
let dataChannel;

const defaultConstraints = {
    audio: true,
    video: true
};

const webRTCConfig = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:13902'
        }
    ]
}

export const getLocalPreview = () => {
    navigator.mediaDevices.getUserMedia(defaultConstraints).then((stream) => {
        ui.updateLocalVideo(stream);
        ui.showVideoCallButtons();
        store.setCallState(constants.callState.CALL_AVAILABLE);
        store.setLocalStream(stream);
    }).catch((err) => {
        console.error('An error occurred when attempting to access camera and/or microphone', err);
    })
};

export const sendPreOffer = (callType, calleePersonalCode) => {
    connectedUserDetails = {
        callType,
        socketId: calleePersonalCode
    };

    if (callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE) {        
        const data = {
            callType,
            calleePersonalCode
        };
        ui.showOutgoingCallDialog(callingDialogRejectHandler);
        store.setCallState(constants.callState.CALL_UNAVAILABLE);
        wss.sendPreOffer(data);
    }
};

export const handlePreOffer = (data) => {
    const { callType, callerSocketId } = data;

    if(!checkCallPotential(callType)) {
        return sendPreOfferAnswer(constants.preOfferAnswer.CALLEE_UNAVAILABLE, callerSocketId);
    }
    connectedUserDetails = {
        socketId: callerSocketId,
        callType,
    }

    store.setCallState(constants.callState.CALL_UNAVAILABLE);

    if (callType === constants.callType.CHAT_PERSONAL_CODE || constants.callType.VIDEO_PERSONAL_CODE) {
        ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
    }
};

const acceptCallHandler = () => {
    createPeerConnection();
    sendPreOfferAnswer(constants.preOfferAnswer.CALLEE_ACCEPTED);
    ui.showCallElements(connectedUserDetails.callType);
};

const rejectCallHandler = () => {
    setIncomingCallsAvailable();
    sendPreOfferAnswer(constants.preOfferAnswer.CALLEE_REJECTED);
};

const callingDialogRejectHandler = () => {
    const data = {
        connectedUserSocketId: connectedUserDetails.socketId
    };
    closePeerConnectionAndResetState();
    wss.sendUserHangUp(data);
};

const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {
    const socketId = callerSocketId ? callerSocketId : connectedUserDetails.socketId;
    const data = {
        callerSocketId: socketId,
        preOfferAnswer
    };
    ui.zapAllDialogs();
    wss.sendPreOfferAnswer(data);
};

const createPeerConnection = () => {
    peerConnection = new RTCPeerConnection(webRTCConfig);
    dataChannel = peerConnection.createDataChannel('chat');
    peerConnection.ondatachannel = event => {
        const eventDataChannel = event.channel;
        eventDataChannel.onopen = () => {
        };
        eventDataChannel.onmessage = event => {
            const incomingMessage = JSON.parse(event.data);
            ui.appendMessage(incomingMessage);
        };
    };
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            // send ice candidates to other peer
            wss.sendDataUsingWebRTCSignaling({
                connectedUserSocketId: connectedUserDetails.socketId,
                type: constants.webRTCSignaling.ICE_CANDIDATE,
                candidate: event.candidate
            });
        }
    };
    peerConnection.onconnectionstatechange = (event) => {
        if (peerConnection.connectionState === 'connected') {
        }
    };
    // receiving peer's remote tracks
    const remoteStream = new MediaStream();
    store.setRemoteStream(remoteStream);
    ui.updateRemoteVideo(remoteStream);
    peerConnection.ontrack = (event) => {
        remoteStream.addTrack(event.track);
    };
    // add local stream to peer's connection
    if(connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE) {
        const localStream = store.getState().localStream;
        for (const track of localStream.getTracks()) {
            peerConnection.addTrack(track, localStream);
        }
    }
};

export const handlePreOfferAnswer = incomingPreOfferAnswer => {
    const { preOfferAnswer } = incomingPreOfferAnswer;
    ui.zapAllDialogs();
    switch (preOfferAnswer) {
        case constants.preOfferAnswer.CALLEE_NOT_FOUND:
            setIncomingCallsAvailable();
            ui.showInfoDialog(preOfferAnswer);
            break;
        case constants.preOfferAnswer.CALLEE_ACCEPTED:
            ui.showCallElements(connectedUserDetails.callType);
            createPeerConnection();
            sendWebRTCOffer();
            break;
        case constants.preOfferAnswer.CALLEE_REJECTED:
            setIncomingCallsAvailable();
            ui.showInfoDialog(preOfferAnswer);
            break;
        case constants.preOfferAnswer.CALLEE_UNAVAILABLE:
            setIncomingCallsAvailable();
            ui.showInfoDialog(preOfferAnswer);
            break;    
        default:
            return;
    }
};

const sendWebRTCOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.OFFER,
        offer: offer
    });
};

export const handleWebRTCOffer = async data => {
    await peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ANSWER,
        answer: answer
    });
};

const checkCallPotential = callType => {
    const callState = store.getState().callState;
    if(callState === constants.callState.CALL_AVAILABLE) {
        return true;
    }
    if((callType === constants.VIDEO_PERSONAL_CODE)
            && callState === constants.callState.CALL_AVAILABLE_CHAT_ONLY) {
        return false;
    }
    return false;
};

const setIncomingCallsAvailable = () => {
    const localStream = store.getState().localStream;
    if(localStream) {
        store.setCallState(constants.callState.CALL_AVAILABLE);
    } else {
        store.setCallState(constants.callState.CALL_AVAILABLE_CHAT_ONLY);
    }
};

export const handleWebRTCAnswer = async data => {
    await peerConnection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async data => {
    try {
        await peerConnection.addIceCandidate(data.candidate);
    } catch(error) {
        console.error('There was an error in attempting to add a received ICE candidate', error);
    }
};

export const sendMessageUsingDataChannel = message => {
    const stringifiedMessage = JSON.stringify(message);
    dataChannel.send(stringifiedMessage);
};

export const toggleScreenSharing = async isScreenSharingActive => {
    if(isScreenSharingActive) {
        const localStream = store.getState().localStream;
        // replace track the person is sending
        const senders = peerConnection.getSenders();
        const sender = senders.find(sender => sender.track.kind === localStream.getVideoTracks()[0].kind);
        if(sender) {
            sender.replaceTrack(localStream.getVideoTracks()[0]);
        }
        store.getState().screenSharingStream.getTracks().forEach(track => track.stop());
        store.setIsScreenSharingActive(!isScreenSharingActive);
        ui.updateLocalVideo(localStream);
    } else {
        try {
            const screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });
            store.setScreenSharingStream(screenSharingStream);
            // replace track the person is sending
            const senders = peerConnection.getSenders();
            const sender = senders.find(sender => sender.track.kind === screenSharingStream.getVideoTracks()[0].kind);
            if(sender) {
                sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
            }
            store.setIsScreenSharingActive(!isScreenSharingActive);
            ui.updateLocalVideo(screenSharingStream);
        } catch(err) {
            console.error('An error occurred when attempting to toggle screen sharing', err);
        }
    }
};

export const handleHangUp = () => {
    const data = {
        connectedUserSocketId: connectedUserDetails.socketId
    };
    wss.sendUserHangUp(data);
    closePeerConnectionAndResetState();
};

export const handleConnectedUserHangUp = () => {
    closePeerConnectionAndResetState();
};

export const closePeerConnectionAndResetState = () => {
    peerConnection?.close();
    peerConnection = null;
    if(connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE) {
        store.getState().localStream.getAudioTracks()[0].enabled = true;
        store.getState().localStream.getVideoTracks()[0].enabled = true;
    }
    ui.updateUIAfterHangUp(connectedUserDetails.callType);
    setIncomingCallsAvailable();
    connectedUserDetails = null;
};