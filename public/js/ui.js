import * as constants from './constants.js';
import * as elements from './elements.js';
import * as store from './store.js';
import * as ui from './ui.js';

export const updatePersonalCode = personalCode => document.querySelector('#personal_code_paragraph').innerHTML = personalCode;

export const showIncomingCallDialog = (callType, acceptCallHandler, rejectCallHandler) => {
    const callTypeInfo = callType === constants.callType.CHAT_PERSONAL_CODE ? 'Chat' : 'Video';
    const incomingCallDialog = elements.getIncomingCallDialog(callTypeInfo, acceptCallHandler, rejectCallHandler);
    zapAllDialogs();
    dialog.appendChild(incomingCallDialog);
};

export const showOutgoingCallDialog = rejectCallHandler => {
    const outgoingCallDialog = elements.getOutgoingCallDialog(rejectCallHandler);
    zapAllDialogs();
    dialog.appendChild(outgoingCallDialog);
};

export const showInfoDialog = preOfferAnswer => {
    let infoDialog = null;
    switch (preOfferAnswer) {
        case constants.preOfferAnswer.CALLEE_NOT_FOUND:
            infoDialog = elements.getInfoDialog('Person not found', 'Double-check the Personal Code.');
            break;
        case constants.preOfferAnswer.CALLEE_ACCEPTED:
            // infoDialog = elements.getInfoDialog('Person not found', 'Double-check your personal code');
            break;
        case constants.preOfferAnswer.CALLEE_REJECTED:
            infoDialog = elements.getInfoDialog('Connection refused', 'The person refused your connection.');
            break;
        case constants.preOfferAnswer.CALLEE_UNAVAILABLE:
            infoDialog = elements.getInfoDialog('Cannot connect to person', 'Person is probably busy. Please try again later.');
            break;    
        default:
            return;
    }
    if (infoDialog) {
        const dialog = document.querySelector('#dialog');
        dialog.appendChild(infoDialog);
        setTimeout(() => {
            ui.zapAllDialogs();
        }, 4000);
    }
};

export const zapAllDialogs = () => {
    document.querySelector('#dialog').replaceChildren();
};

export const updateMicButton = isMicActive => {
    if (isMicActive) {
        document.querySelector('#mic_button_image').src = './utils/images/micOff.png';
    } else {
        document.querySelector('#mic_button_image').src = './utils/images/mic.png';
    }
};

export const updateCameraButton = isCameraActive => {
    if (isCameraActive) {
        document.querySelector('#camera_button_image').src = './utils/images/cameraOff.png';
    } else {
        document.querySelector('#camera_button_image').src = './utils/images/camera.png';
    }
};

export const updateLocalVideo = stream => {
    const localVideo = document.querySelector('#local_video');
    localVideo.srcObject = stream;
    localVideo.addEventListener('loadmetadata', () => {
        localVideo.play();
    });
};

export const updateRemoteVideo = stream => {
    const remoteVideo = document.querySelector('#remote_video');
    remoteVideo.srcObject = stream;
    remoteVideo.addEventListener('loadmetadata', () => {
        remoteVideo.play();
    });
};

export const showCallElements = callType => {
    if (callType === constants.callType.CHAT_PERSONAL_CODE) {
        showChatCallElements();
    }
    if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
        showVideoCallElements();
    }
};

const showChatCallElements = () => {
    showElement(document.querySelector('#finish_chat_button_container'));
    showElement(document.querySelector('#new_message'));
    disableDashboard();
};

const hideChatCallElements = () => {
    hideElement(document.querySelector('#finish_chat_button_container'));
    hideElement(document.querySelector('#new_message'));
    enableDashboard();
};

const showVideoCallElements = () => {
    showElement(document.querySelector('#call_buttons'));
    hideElement(document.querySelector('#video_placeholder'));
    showElement(document.querySelector('#remote_video'));
    showElement(document.querySelector('#new_message'));
    disableDashboard();
};

const hideVideoCallElements = () => {
    hideElement(document.querySelector('#call_buttons'));
    hideElement(document.querySelector('#new_message'));
    enableDashboard();
};

export const appendMessage = (message, isRightMessage = false) => {
    document.querySelector('#messages_container').appendChild(isRightMessage
        ? elements.getRightMessage(message)
        : elements.getLeftMessage(message));
};

export const clearAllMessages = () => {
    document.querySelector('#messages_container').replaceChildren();
};

export const showVideoCallButtons = () => {
    showElement(document.querySelector('#personal_code_video_button'));
}

export const showRecordingPanel = () => {
    showElement(document.querySelector('#video_recording_buttons'));
    hideElement(document.querySelector('#start_recording_button'));
};

export const resetRecordingButtons = () => {
    showElement(document.querySelector('#start_recording_button'));
    hideElement(document.querySelector('#video_recording_buttons'));
};

const enableDashboard = () => {
    document.querySelector('#personal_controls_container').classList.remove('display_none');
};

const disableDashboard = () => {
    document.querySelector('#personal_controls_container').classList.add('display_none');
};

export const hideElement = (element) => {
    if (!element.classList.contains('display_none')) {
        element.classList.add('display_none');
    }
};

export const showElement = (element) => {
    if (element.classList.contains('display_none')) {
        element.classList.remove('display_none');
    }
};

export const updateUIAfterHangUp = callType => {
    enableDashboard();
    if(callType === constants.callType.VIDEO_PERSONAL_CODE) {
        hideElement(document.querySelector('#call_buttons'));
    } else {
        hideElement(document.querySelector('#finish_chat_button_container'));
    }
    hideElement(document.querySelector('#new_message'));
    clearAllMessages();
    zapAllDialogs();
    updateMicButton(false);
    updateCameraButton(false);
    // document.querySelector('#personal_code_input').value = ''; - just in case we want a QUICK re-connect
    showElement(document.querySelector('#video_placeholder'));
    hideElement(document.querySelector('#remote_video'));
};