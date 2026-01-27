import React, { useState, useRef } from 'react';
import { analyzeReceipt } from './aiServices';

export default function ReceiptScanner({ onDataExtracted }) {
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    videoRef.current?.srcObject?.getTracks().forEach(track => track.stop());
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    stopCamera();
    await processImage(base64, 'image/jpeg');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => processImage(reader.result.split(',')[1], file.type);
    reader.readAsDataURL(file);
  };

  const processImage = async (base64, type) => {
    setLoading(true);
    try {
      const result = await analyzeReceipt(base64, type);
      console.log('result', result)
      alert(JSON.stringify(result))
      onDataExtracted(result);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px' }}>
      {loading && <p>✨ Analyzing Receipt...</p>}

      <div style={{ display: 'flex', gap: '10px' }}>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <button onClick={cameraActive ? stopCamera : startCamera}>
          {cameraActive ? 'Close Camera' : 'Open Camera'}
        </button>
      </div>

      {cameraActive && (
        <div style={{ marginTop: '15px' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: '8px' }} />
          <button onClick={capturePhoto} style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
            📸 Snap Photo
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}