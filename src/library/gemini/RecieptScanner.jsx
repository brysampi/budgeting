import React, { useState, useRef, useEffect } from 'react';
import { analyzeReceipt } from './aiServices';
import { Icons } from '../../assets/Icons';
import { categoriesStore } from '../zustand/storage';
// Shared helper function to handle API calls
const processImage = async (base64, type, setLoading, onDataExtracted) => {
  setLoading(true);

  const storedCategories = categoriesStore.getState().data || [];
  const fetchedData = [];
  for (const store of storedCategories) {
    fetchedData.push({ id: store.id, name: store.category });
  }
  try {
    const result = await analyzeReceipt(base64, type, fetchedData);
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

export const UploadImage = ({ onImageSelected, loading = false, setLoading }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelected({
        base64: reader.result.split(',')[1],
        type: file.type,
        url: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={loading}
        ref={fileInputRef}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="w-full h-44 rounded-2xl bg-[var(--color-theme-secondary)] p-6 flex flex-col justify-between hover:bg-[var(--color-theme-tertiary)] transition-all group border border-[var(--color-theme-tertiary-light)] relative overflow-hidden shadow-sm active:scale-[0.98]"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-theme-important)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[var(--color-theme-important)]/10 transition-colors pointer-events-none" />

        <div className="w-12 h-12 rounded-xl bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icons.LuUpload size={24} className="text-[var(--color-theme-important)]" />
        </div>

        <div className="flex flex-col items-start mt-4">
          <span className="text-sm font-bold text-[var(--color-light)]">Upload Receipt</span>
          <span className="text-[10px] text-[var(--color-theme-secondary-text)] font-semibold uppercase tracking-wider mt-1">Select File</span>
        </div>
      </button>
    </div>
  );
};

export const CameraView = ({ onImageSelected, cameraActive = false, setCameraActive, loading = false, setLoading }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const stream = await startCamera();
        if (!isMounted && stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error(err);
      }
    };

    init();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        alert("Camera access requires HTTPS connection.");
        return null;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Browser doesn't support camera access.");
        return null;
      }

      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      setCameraActive(false);
      alert(`Camera error: ${err.message}`);
      return null;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
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

    const dataUrl = canvas.toDataURL('image/jpeg');
    const base64 = dataUrl.split(',')[1];
    stopCamera();
    onImageSelected({ base64, type: 'image/jpeg', url: dataUrl });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-w-md sm:aspect-[3/4] sm:rounded-3xl overflow-hidden bg-[var(--color-theme-secondary)] shadow-2xl border-white/10 sm:border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />

        {/* Camera Overlay Elements */}
        <div className="absolute inset-0 border-[24px] border-black/40 pointer-events-none">
          <div className="w-full h-full border-2 border-dashed border-white/30 rounded-lg"></div>
        </div>

        {/* Back Button */}
        <button
          onClick={stopCamera}
          className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all border border-white/10 active:scale-95"
        >
          <Icons.LuArrowLeft size={24} />
        </button>

        {/* Controls */}
        <div className="absolute bottom-10 inset-x-0 flex items-center justify-center gap-8">
          <button
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-1.5 shadow-2xl active:scale-90 transition-all group"
          >
            <div className="w-full h-full rounded-full border-4 border-black/5 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[var(--color-theme-important)] group-hover:scale-95 transition-transform"></div>
            </div>
          </button>
        </div>

        {/* <div className="absolute bottom-4 inset-x-0 flex justify-center">
          <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            Align receipt within frame
          </span>
        </div> */}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default function ReceiptScanner({ onDataExtracted }) {
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleAiData = (data) => {
    if (onDataExtracted) {
      onDataExtracted(data);
    }
  };

  const handleImageSelected = (imageData) => {
    setPreview(imageData);
  };

  const handleConfirmImage = async () => {
    await processImage(preview.base64, preview.type, setLoading, handleAiData);
    setPreview(null);
  };

  const handleRetake = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {loading ? (
        <div className="w-full h-[320px] rounded-2xl border-2 border-dashed border-[var(--color-theme-important)]/30 bg-[var(--color-theme-important)]/5 flex flex-col items-center justify-center gap-6 p-8 relative overflow-hidden">
          {/* Animated background glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-theme-important)]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-theme-important)]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse delay-700" />

          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[var(--color-theme-important)]/10 flex items-center justify-center shadow-inner">
              <Icons.LuLoader size={36} className="text-[var(--color-theme-important)] animate-spin" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-theme-important)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--color-theme-important)]"></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center animate-bounce-slow">
            <div className="flex items-center gap-2">
              <Icons.LuSparkles className="text-[var(--color-theme-important)]" size={18} />
              <h3 className="text-xl font-bold text-[var(--color-light)]">Analyzing Receipt</h3>
              <Icons.LuSparkles className="text-[var(--color-theme-important)]" size={18} />
            </div>
            <p className="text-sm text-[var(--color-theme-secondary-text)] font-medium max-w-[200px]">
              Extracting items, merchant, and totals with AI...
            </p>
          </div>
        </div>
      ) : preview ? (
        <div className="flex flex-col gap-6 animate-fade-in text-[var(--color-light)]">
          <div className="flex flex-col gap-2 items-center text-center">
            <h3 className="text-xl font-bold">Image Preview</h3>
            <p className="text-sm text-[var(--color-theme-secondary-text)]">Check if the receipt is clear before analyzing.</p>
          </div>
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--color-theme-secondary)] border border-[var(--color-theme-tertiary-light)] shadow-sm">
            <img src={preview.url} alt="Receipt Preview" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRetake}
              className="px-6 py-4 rounded-xl font-bold bg-[var(--color-theme-secondary)] text-[var(--color-theme-secondary-text)] hover:bg-[var(--color-theme-tertiary)] hover:text-[var(--color-light)] transition-all w-1/3 flex items-center justify-center border border-[var(--color-theme-tertiary-light)]"
            >
              Retake
            </button>
            <button
              onClick={handleConfirmImage}
              className="flex-1 py-4 rounded-xl font-bold bg-[var(--color-theme-important)] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              <Icons.LuSparkles size={18} />
              Analyze
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCameraActive(true)}
                className="h-44 rounded-2xl bg-[var(--color-theme-secondary)] p-6 flex flex-col justify-between hover:bg-[var(--color-theme-tertiary)] transition-all group border border-[var(--color-theme-tertiary-light)] relative overflow-hidden shadow-sm active:scale-[0.98]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-theme-important)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[var(--color-theme-important)]/10 transition-colors" />

                <div className="w-12 h-12 rounded-xl bg-[var(--color-theme-important)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icons.LuCamera size={24} className="text-[var(--color-theme-important)]" />
                </div>
                <div className="flex flex-col items-start mt-4">
                  <span className="text-sm font-bold text-[var(--color-light)]">Scan with Camera</span>
                  <span className="text-[10px] text-[var(--color-theme-secondary-text)] font-semibold uppercase tracking-wider mt-1">Instant Scan</span>
                </div>
              </button>

              <UploadImage
                onImageSelected={handleImageSelected}
                loading={loading}
                setLoading={setLoading}
              />
            </div>

            <div className="flex items-center gap-2 px-1 opacity-60">
              <div className="h-px flex-1 bg-[var(--color-theme-tertiary-light)]"></div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-theme-secondary-text)]">Powered by Gemini AI</span>
              <div className="h-px flex-1 bg-[var(--color-theme-tertiary-light)]"></div>
            </div>
          </div>

          {cameraActive && (
            <CameraView
              onImageSelected={handleImageSelected}
              cameraActive={cameraActive}
              setCameraActive={setCameraActive}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}
