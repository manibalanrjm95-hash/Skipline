import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, QrCode, ArrowRight, ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ExitVerification = () => {
    const navigate = useNavigate();
    const { orderDetails, clearCart } = useStore();
    const [isDone, setIsDone] = useState(false);

    const handleDone = () => {
        clearCart();
        navigate('/');
    };

    return (
        <div className="max-app-width flex flex-col justify-center items-center page-padding text-center">
            <div className="mb-12">
                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-8 mx-auto text-success animate-bounce shadow-sm border border-success/20">
                    <CheckCircle2 size={56} strokeWidth={1.5} />
                </div>
                <h1 className="h1 text-text-primary mb-2">Order Confirmed!</h1>
                <p className="body text-text-secondary">Your payment was successful and verified.</p>
            </div>

            <div className="w-full section-gap mb-12">
                {/* Exit Pass Card */}
                <div className="card-v2 border-2 border-secondary/20 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>

                    <div className="flex flex-col items-center py-6">
                        <div className="p-4 bg-bg-app border border-border rounded-2xl mb-6">
                            <QrCode size={160} className="text-text-primary" />
                        </div>

                        <div className="space-y-4 w-full">
                            <div className="flex justify-between items-center px-4">
                                <span className="label text-text-secondary uppercase">Order ID</span>
                                <span className="body font-bold text-text-primary">#{(orderDetails?.id || 'TEST').slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center px-4">
                                <span className="label text-text-secondary uppercase">Entry Time</span>
                                <span className="body font-bold text-text-primary">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="border-t border-dashed border-border mt-4 pt-4 flex justify-between items-center px-4">
                                <span className="label text-text-secondary uppercase">Status</span>
                                <span className="body font-bold text-success flex items-center gap-2">
                                    <ShieldCheck size={18} /> CLEARED FOR EXIT
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 text-left p-2">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-bg-app border border-border flex items-center justify-center shrink-0">
                            <ShoppingBag size={20} className="text-text-secondary" />
                        </div>
                        <p className="small text-text-secondary">
                            Show this QR code at the <strong>SkipLine Exit Gate</strong> for quick verification.
                        </p>
                    </div>
                </div>
            </div>

            <button
                className="btn-v2 btn-v2-primary max-w-xs"
                onClick={handleDone}
            >
                Done / Start New Session
            </button>

            <div className="mt-12 opacity-40">
                <p className="label font-bold text-text-secondary tracking-widest">THANK YOU FOR SHOPPING</p>
            </div>
        </div>
    );
};

export default ExitVerification;
