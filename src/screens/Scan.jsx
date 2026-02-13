import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Package, Plus, Search, AlertCircle, CheckCircle, Camera, CameraOff, Keyboard } from 'lucide-react';
import jsQR from 'jsqr';
import BottomNav from '../components/BottomNav';

const Scan = () => {
    const { products, addToCart } = useStore();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [status, setStatus] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [showManual, setShowManual] = useState(false);
    const timerRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const scanIntervalRef = useRef(null);
    const lastScannedRef = useRef('');

    const showFeedback = useCallback((type, message) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStatus({ type, message });
        timerRef.current = setTimeout(() => setStatus(null), 2500);
    }, []);

    const processCode = useCallback((scannedCode) => {
        // Prevent duplicate rapid scans
        if (lastScannedRef.current === scannedCode) return;
        lastScannedRef.current = scannedCode;
        setTimeout(() => { lastScannedRef.current = ''; }, 3000);

        const result = addToCart(scannedCode);
        const product = products.find(p => p.product_code.toUpperCase() === scannedCode.trim().toUpperCase());
        if (result.success) {
            showFeedback('success', `Added ${product?.product_name || scannedCode}!`);
        } else {
            showFeedback('error', result.error);
        }
    }, [addToCart, products, showFeedback]);

    // Scan QR codes from the camera video feed
    const startScanning = useCallback(() => {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

        scanIntervalRef.current = setInterval(() => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (qrCode && qrCode.data) {
                processCode(qrCode.data);
            }
        }, 250); // Scan 4 times per second
    }, [processCode]);

    const startCamera = useCallback(async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setCameraActive(true);
                startScanning();
            }
        } catch (err) {
            console.error('Camera error:', err);
            setCameraError(err.name === 'NotAllowedError'
                ? 'Camera access denied. Please allow camera permissions.'
                : err.name === 'NotFoundError'
                    ? 'No camera found. Use manual entry or tap products below.'
                    : 'Unable to access camera.'
            );
            setCameraActive(false);
        }
    }, [startScanning]);

    const stopCamera = useCallback(() => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    }, []);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const handleScan = (e) => {
        e.preventDefault();
        if (!code.trim()) {
            showFeedback('error', 'Please enter a product code');
            return;
        }
        processCode(code);
        setCode('');
    };

    return (
        <div className="app-container mesh-bg flex flex-col">
            <div className="screen-padding flex-1 animate-fade flex flex-col" style={{ overflow: 'hidden' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button className="btn p-3 bg-white rounded-md shadow-sm" onClick={() => { stopCamera(); navigate(-1); }}>
                            <ArrowLeft size={24} className="text-grey-900" />
                        </button>
                        <h2 className="font-bold">Scan Products</h2>
                    </div>
                    <button
                        className={`btn p-3 rounded-lg shadow-sm ${cameraActive ? 'bg-success text-white' : 'bg-grey-100 text-grey-700'}`}
                        onClick={() => cameraActive ? stopCamera() : startCamera()}
                    >
                        {cameraActive ? <Camera size={20} /> : <CameraOff size={20} />}
                    </button>
                </div>

                {/* Camera Feed + QR Detection */}
                <div className="relative mb-6 shadow-lg overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', height: '220px', background: 'var(--grey-900)' }}>
                    <video
                        ref={videoRef}
                        playsInline
                        muted
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-lg)',
                            display: cameraActive ? 'block' : 'none',
                        }}
                    />
                    {/* Hidden canvas for QR detection — never visible */}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {!cameraActive && !cameraError && (
                        <div className="absolute flex flex-col items-center justify-center gap-4" style={{ inset: 0 }}>
                            <CameraOff size={40} className="text-grey-400" />
                            <p className="body-sm text-grey-400 font-medium text-center px-6">Camera off. Tap the camera icon or use manual entry.</p>
                        </div>
                    )}

                    {cameraError && (
                        <div className="absolute flex flex-col items-center justify-center gap-4 p-6" style={{ inset: 0 }}>
                            <AlertCircle size={40} className="text-warning" />
                            <p className="body-sm text-grey-400 font-medium text-center">{cameraError}</p>
                            <button className="btn btn-primary py-2 px-6" onClick={startCamera}>Retry</button>
                        </div>
                    )}

                    {/* Scan overlay corners */}
                    {cameraActive && (
                        <>
                            <div className="absolute" style={{ top: '16px', left: '16px', width: '28px', height: '28px', borderLeft: '3px solid var(--color-primary)', borderTop: '3px solid var(--color-primary)' }}></div>
                            <div className="absolute" style={{ top: '16px', right: '16px', width: '28px', height: '28px', borderRight: '3px solid var(--color-primary)', borderTop: '3px solid var(--color-primary)' }}></div>
                            <div className="absolute" style={{ bottom: '16px', left: '16px', width: '28px', height: '28px', borderLeft: '3px solid var(--color-primary)', borderBottom: '3px solid var(--color-primary)' }}></div>
                            <div className="absolute" style={{ bottom: '16px', right: '16px', width: '28px', height: '28px', borderRight: '3px solid var(--color-primary)', borderBottom: '3px solid var(--color-primary)' }}></div>
                            <div style={{
                                position: 'absolute', width: '100%', height: '3px',
                                background: 'var(--color-primary)',
                                boxShadow: '0 0 15px var(--color-primary), 0 0 30px var(--color-primary)',
                                animation: 'scanLine 2.5s infinite ease-in-out',
                            }}></div>
                        </>
                    )}
                </div>

                {/* Feedback Toast */}
                {status && (
                    <div className={`flex items-center gap-3 p-4 rounded-lg mb-4 animate-fade ${status.type === 'success' ? 'bg-success-light text-success' : 'bg-error-light text-error'}`}>
                        {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        <p className="body-sm font-bold">{status.message}</p>
                    </div>
                )}

                {/* Manual Entry Toggle */}
                <button
                    className="flex items-center gap-2 mb-4 self-start"
                    onClick={() => setShowManual(!showManual)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0' }}
                >
                    <Keyboard size={18} className="text-primary" />
                    <span className="body-sm font-bold text-primary">{showManual ? 'Hide manual entry' : 'Enter code manually'}</span>
                </button>

                {showManual && (
                    <form onSubmit={handleScan} className="flex gap-3 mb-6 animate-fade">
                        <div className="flex-1 bg-grey-100 rounded-lg flex items-center px-4 border border-white">
                            <Search size={20} className="text-grey-400 mr-2" />
                            <input
                                type="text"
                                placeholder="e.g. SLP-001"
                                className="border-none bg-transparent py-3"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                style={{ height: 'auto', fontSize: '15px' }}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary p-3 rounded-lg">
                            <Plus size={24} />
                        </button>
                    </form>
                )}

                {/* Scrollable Product List */}
                <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '16px' }}>
                    <p className="caption text-grey-500 font-bold mb-3">TAP TO ADD</p>
                    <div className="flex flex-col gap-3">
                        {products.map(p => (
                            <button
                                key={p.id}
                                className={`card glass flex items-center justify-between p-4 transition-all ${!p.barcode_enabled ? 'opacity-40 grayscale pointer-events-none' : 'hover:bg-white'}`}
                                onClick={() => processCode(p.product_code)}
                                disabled={!p.barcode_enabled}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-light border">
                                        <Package size={20} className="text-secondary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="body-sm font-bold">{p.product_name}</p>
                                        <p className="caption text-grey-500 font-medium">₹{p.price} • {p.product_code}</p>
                                    </div>
                                </div>
                                <div className="p-2 rounded-md bg-grey-100 text-grey-700">
                                    <Plus size={18} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default Scan;
