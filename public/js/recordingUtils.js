import * as store from './store.js';

let mediaRecorder;

const vp9Codec = 'video/webm; codecs=vp=9';
const vp9CodecOptions = { mimeType: vp9Codec };
const recordedChunks = [];

export const startRecording = () => {
    const remoteStream = store.getState().remoteStream;
    if(MediaRecorder.isTypeSupported(vp9Codec)) {
        mediaRecorder = new MediaRecorder(remoteStream, vp9CodecOptions);
    } else {
        mediaRecorder = new MediaRecorder(remoteStream);
    }
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
};

export const pauseRecording = () => {
    mediaRecorder.pause();
};

export const resumeRecording = () => {
    mediaRecorder.resume();
};

export const stopRecording = () => {
    mediaRecorder.stop();
};

const handleDataAvailable = event => {
    if(event.data.size > 0) {
        recordedChunks.push(event.data);
        downloadRecordedVideo();
    }
};

const downloadRecordedVideo = () => {
    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(videoBlob);
    const hyperlink = document.createElement('a');
    hyperlink.style = 'display: none';
    hyperlink.href = url;
    hyperlink.download = 'recording.webm';
    document.body.appendChild(hyperlink);
    hyperlink.click();
    window.URL.revokeObjectURL(url);
};
