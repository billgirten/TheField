import * as constants from './constants.js';

let state = {
    socketId: null,
    localStream: null,
    remoteStream: null,
    screenSharingStream: null,
    isScreenSharingActive: false,
    callState: constants.callState.CALL_AVAILABLE_CHAT_ONLY
};

export const getState = () => state;

export const setSocketId = socketId => state = { ...state, socketId };
export const setLocalStream = localStream => state = { ...state, localStream };
export const setRemoteStream = remoteStream => state = { ...state, remoteStream };
export const setScreenSharingStream = screenSharingStream => state = { ...state, screenSharingStream };
export const setIsScreenSharingActive = isScreenSharingActive => state = { ...state, isScreenSharingActive };
export const setCallState = callState => state = { ...state, callState };
