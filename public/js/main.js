import * as constants from './constants.js';
import * as recordingUtils from './recordingUtils.js';
import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as wss from './wss.js';

const socket = io("/");

wss.registerSocketEvents(socket);

// thumbnail preview
webRTCHandler.getLocalPreview();

document.querySelector('#personal_code_copy_button').addEventListener('click', () => {
  navigator.clipboard && navigator.clipboard.writeText(store.getState().socketId);
});

document.querySelector('#personal_code_chat_button').addEventListener('click', () => {
  const callType = constants.callType.CHAT_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, document.querySelector('#personal_code_input').value);
});

document.querySelector('#personal_code_video_button').addEventListener('click', () => {
  const callType = constants.callType.VIDEO_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, document.querySelector('#personal_code_input').value);
});

document.querySelector('#mic_button').addEventListener('click', () => {
  const localStream = store.getState().localStream;
  const isMicEnabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !isMicEnabled;
  ui.updateMicButton(isMicEnabled);
});

document.querySelector('#camera_button').addEventListener('click', () => {
  const localStream = store.getState().localStream;
  const isCameraEnabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !isCameraEnabled;
  ui.updateCameraButton(isCameraEnabled);
});

document.querySelector('#screen_sharing_button').addEventListener('click', () => {
  const isScreenSharingActive = store.getState().isScreenSharingActive;
  webRTCHandler.toggleScreenSharing(isScreenSharingActive);
});

document.querySelector('#new_message_input').addEventListener('keydown', (event) => {
  const key = event.key;
  if(key === 'Enter') {
    ui.appendMessage(event.target.value, true);
    webRTCHandler.sendMessageUsingDataChannel(event.target.value);
    document.querySelector('#new_message_input').value = '';
  }
});

document.querySelector('#send_message_button').addEventListener('click', () => {
  ui.appendMessage(document.querySelector('#new_message_input').value, true);
  webRTCHandler.sendMessageUsingDataChannel(document.querySelector('#new_message_input').value);
  document.querySelector('#new_message_input').value = '';
});

document.querySelector('#start_recording_button').addEventListener('click', () => {
  recordingUtils.startRecording();
  ui.showRecordingPanel();
  ui.showElement(document.querySelector('#pause_recording_button'));
  ui.showElement(document.querySelector('#stop_recording_button'));
  document.querySelector('#stop_recording_button').innerHTML = 'Pause/Stop recording';
});

document.querySelector('#pause_recording_button').addEventListener('click', () => {
  recordingUtils.pauseRecording();
  ui.hideElement(document.querySelector('#pause_recording_button'));
  ui.showElement(document.querySelector('#resume_recording_button'));
  document.querySelector('#stop_recording_button').innerHTML = 'Resume recording';
});

document.querySelector('#resume_recording_button').addEventListener('click', () => {
  recordingUtils.resumeRecording();
  ui.hideElement(document.querySelector('#resume_recording_button'));
  ui.showElement(document.querySelector('#pause_recording_button'));
  document.querySelector('#stop_recording_button').innerHTML = 'Pause/Stop recording';
});

document.querySelector('#stop_recording_button').addEventListener('click', () => {
  recordingUtils.stopRecording();
  ui.resetRecordingButtons();
  document.querySelector('#stop_recording_button').innerHTML = 'Pause/Stop recording';
});

document.querySelector('#hang_up_button').addEventListener('click', () => {
  webRTCHandler.handleHangUp();
});

document.querySelector('#finish_chat_call_button').addEventListener('click', () => {
  webRTCHandler.handleHangUp();
});
