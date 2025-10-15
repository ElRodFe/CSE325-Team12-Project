let mediaRecorder;
let audioChunks = [];

window.startRecording = async function() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.start();
    } catch (error) {
        console.error('Error accessing microphone:', error);
    }
};

window.stopRecording = function() {
    return new Promise((resolve) => {
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = await uploadAudio(audioBlob);
            resolve(audioUrl);
        };
        
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
};

async function uploadAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    return result.audioUrl;
}