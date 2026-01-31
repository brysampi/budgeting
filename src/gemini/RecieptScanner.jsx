import React, { useState, useRef } from 'react';
import { analyzeReceipt } from './aiServices';

// Shared helper function to handle API calls
const processImage = async (base64, type, setLoading, onDataExtracted) => {
  setLoading(true);
  try {
    const result = await analyzeReceipt(base64, type);
    console.log('result', result);
    if (onDataExtracted) {
      onDataExtracted(result);
    }
    return result;
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

export const UploadImage = ({ onDataExtracted }) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => processImage(reader.result.split(',')[1], file.type, setLoading, onDataExtracted);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <strong>Upload Image</strong>
      {loading && <p>✨ Analyzing Receipt...</p>}
      <input type="file" accept="image/*" onChange={handleFileUpload} disabled={loading} />
    </div>
  );
};

export const CameraView = ({ onDataExtracted }) => {
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        alert("Camera access requires HTTPS connection.");
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Browser doesn't support camera access.");
        return;
      }

      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setCameraActive(false);
      alert(`Camera error: ${err.message}`);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    stopCamera();

    // Process the captured image
    processImage(base64, 'image/jpeg', setLoading, onDataExtracted);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <strong>Camera Capture</strong>
      {loading && <p>✨ Analyzing Receipt...</p>}

      {!cameraActive ? (
        <button onClick={startCamera} style={{ padding: '10px' }} disabled={loading}>
          Open Camera
        </button>
      ) : (
        <div style={{ marginTop: '15px' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: '8px' }} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={capturePhoto} style={{ flex: 1, padding: '10px' }}>
              📸 Snap Photo
            </button>
            <button onClick={stopCamera} style={{ flex: 1, padding: '10px', backgroundColor: '#ff4444', color: 'white' }}>
              Close Camera
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

// Default export if you still want to use the combined view somewhere
export default function ReceiptScanner({ onDataExtracted }) {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <UploadImage onDataExtracted={onDataExtracted} />
        <CameraView onDataExtracted={onDataExtracted} />
      </div>
    </div>
  );
}
