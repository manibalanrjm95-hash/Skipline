import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, QrCode, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ExitVerification = () => {
    const navigate = useNavigate();
    const { orderDetails, clearCart } = useStore();

    const handleDone = () => {
        clearCart();
        navigate('/');
    };

    return (
        <div className="m3-scaffold flex flex-col justify-center items-center">
            <div className="m3-content flex flex-col items-center text-center">
                <div className="mb-12">
                    <div className="w-24 h-24 bg-md-sys-color-secondary-container rounded-full flex items-center justify-center mb-8 mx-auto text-md-sys-color-on-secondary-container animate-bounce shadow-md">
                        <CheckCircle2 size={56} />
                    </div>
                    <h1 className="display-small text-md-sys-color-on-surface mb-2">Order Confirmed!</h1>
                    <p className="body-large text-md-sys-color-on-surface-variant">Your payment was successful and verified.</p>
                </div>

                {/* M3 Exit Pass Card */}
                <div className="m3-card card-elevated w-full border-2 border-md-sys-color-outline-variant relative overflow-hidden bg-md-sys-color-surface">
                    <div className="absolute top-0 left-0 w-full h-2 bg-md-sys-color-primary"></div>

                    <div className="flex flex-col items-center py-6 px-4">
                        <div className="p-4 bg-md-sys-color-surface-variant rounded-[24px] mb-8 shadow-inner">
                            <QrCode size={180} />
                        </div>

                        <div className="w-full space-y-4 text-left">
                            <div className="flex justify-between items-center border-b border-md-sys-color-outline-variant pb-2">
                                <span className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest">Order ID</span>
                                <span className="title-medium font-bold text-md-sys-color-on-surface">#{(orderDetails?.id || 'ALPHA-001').slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-md-sys-color-outline-variant pb-2">
                                <span className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest">Entry Time</span>
                                <span className="title-medium font-bold text-md-sys-color-on-surface">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest">Status</span>
                                <span className="title-medium font-bold text-md-sys-color-primary flex items-center gap-2">
                                    <ShieldCheck size={20} /> CLEARED FOR EXIT
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 p-4 mt-8 bg-md-sys-color-surface-variant/30 rounded-2xl items-start text-left">
                    <div className="w-10 h-10 bg-md-sys-color-surface rounded-full flex items-center justify-center shrink-0 shadow-sm">
                        <ShoppingBag size={20} className="text-md-sys-color-primary" />
                    </div>
                    <p className="body-small text-md-sys-color-on-surface-variant">
                        Show this QR code at the <strong>SkipLine Exit Gate</strong> for quick verification.
                    </p>
                </div>

                <button
                    className="m3-btn btn-filled h-16 mt-12 mb-8 shadow-lg font-bold tracking-widest"
                    onClick={handleDone}
                >
                    DONE / START NEW
                </button>
            </div>
        </div>
    );
};

export default ExitVerification;
