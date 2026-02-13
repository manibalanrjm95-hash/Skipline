import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Package, Plus, Search, AlertCircle, CheckCircle, Camera, CameraOff, Keyboard, Zap, X } from 'lucide-react';
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
        <div className="app-container flex flex-col h-screen overflow-hidden">
            {/* Camera Viewport (Top Half) */}
            <div className={`relative w-full ${showManual ? 'h-[40vh]' : 'h-[55vh]'} transition-all duration-300 ease-out flex-shrink-0 bg-black`}>
                <video
                    ref={videoRef}
                    playsInline
                    muted
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: cameraActive ? 'block' : 'none',
                    }}
                />

                {/* Overlay Header */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20 bg-gradient-to-b from-black/50 to-transparent">
                    <button
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
                        onClick={() => { stopCamera(); navigate(-1); }}
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <button
                        className={`px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 text-sm font-bold ${cameraActive ? 'bg-white/20 text-white' : 'bg-red-500/80 text-white'}`}
                        onClick={() => cameraActive ? stopCamera() : startCamera()}
                    >
                        {cameraActive ? <><Camera size={16} /> Live</> : <><CameraOff size={16} /> Off</>}
                    </button>
                </div>

                {/* Scan Frame */}
                {cameraActive && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/50 rounded-3xl overflow-hidden z-10">
                        <div className="w-full h-1 bg-primary shadow-[0_0_20px_rgba(255,68,0,0.8)] animate-[scanLine_2s_infinite_ease-in-out]"></div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-xl"></div>
                    </div>
                )}

                {/* Hidden canvas for QR detection */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {!cameraActive && !cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                        <CameraOff size={48} className="mb-4 opacity-50" />
                        <p className="font-medium">Camera Paused</p>
                    </div>
                )}
            </div>

            {/* Bottom Sheet Control (Draggable feel) */}
            <div className="flex-1 bg-white rounded-t-[32px] -mt-8 relative z-30 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Drag Handle */}
                <div className="w-full h-8 flex items-center justify-center flex-shrink-0">
                    <div className="w-12 h-1.5 bg-grey-200 rounded-full"></div>
                </div>

                {/* Feedback Toast Inline */}
                {status && (
                    <div className={`mx-6 mb-4 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${status.type === 'success' ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <p className="font-bold text-sm">{status.message}</p>
                    </div>
                )}

                {/* Toggle & Manual Input */}
                <div className="px-6 mb-6 flex-shrink-0">
                    {!showManual ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-h2 text-grey-900 leading-tight">Quick Add</h3>
                                <p className="body-sm text-grey-500">Scan code or select below</p>
                            </div>
                            <button
                                className="w-12 h-12 rounded-full bg-grey-100 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                                onClick={() => setShowManual(true)}
                            >
                                <Keyboard size={24} />
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleScan} className="animate-fade-in">
                            <div className="flex items-center justify-between mb-2">
                                <span className="caption text-primary">MANUAL ENTRY</span>
                                <button type="button" onClick={() => setShowManual(false)} className="p-1 rounded-full bg-grey-100"><X size={16} /></button>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-400" size={20} />
                                    <input
                                        autoFocus
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        placeholder="Product Code..."
                                        className="input-field pl-12 py-3 text-base"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary px-4 rounded-xl">
                                    <Plus size={24} />
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto px-6 pb-24">
                    <div className="flex flex-col gap-3">
                        {products.map(p => (
                            <button
                                key={p.id}
                                className={`card-floating group hover:border-primary/30 transition-all ${!p.barcode_enabled ? 'opacity-50 grayscale' : ''}`}
                                onClick={() => processCode(p.product_code)}
                                disabled={!p.barcode_enabled}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary">
                                        <Zap size={18} fill="currentColor" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-grey-900">{p.product_name}</p>
                                        <p className="text-xs text-grey-500 font-medium">₹{p.price}</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-grey-100 flex items-center justify-center text-grey-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Plus size={16} />
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
