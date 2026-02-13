import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QrCode, Download, Share2, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

const ExitVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId || 'ORD-98210';

    return (
        <div className="app-container mesh-bg flex flex-col items-center">
            <div className="screen-padding w-full flex-1 flex flex-col items-center animate-fade">
                <div className="text-center mb-10">
                    <div className="tag tag-success glass px-4 py-2 mb-4 font-bold inline-flex items-center gap-2">
                        <CheckCircle size={16} /> PAYMENT VERIFIED
                    </div>
                    <h1 className="mb-2">Final Step!</h1>
                    <p className="body-lg text-grey-500">Scan this code at the smart gate</p>
                </div>

                <div className="qr-container glass-dark mb-10 p-10 relative shadow-lg">
                    {/* QR Decorative Corners */}
                    <div className="absolute" style={{ top: '15px', left: '15px', width: '40px', height: '40px', borderLeft: '4px solid var(--color-primary)', borderTop: '4px solid var(--color-primary)', borderRadius: '12px 0 0 0' }}></div>
                    <div className="absolute" style={{ top: '15px', right: '15px', width: '40px', height: '40px', borderRight: '4px solid var(--color-primary)', borderTop: '4px solid var(--color-primary)', borderRadius: '0 12px 0 0' }}></div>
                    <div className="absolute" style={{ bottom: '15px', left: '15px', width: '40px', height: '40px', borderLeft: '4px solid var(--color-primary)', borderBottom: '4px solid var(--color-primary)', borderRadius: '0 0 0 12px' }}></div>
                    <div className="absolute" style={{ bottom: '15px', right: '15px', width: '40px', height: '40px', borderRight: '4px solid var(--color-primary)', borderBottom: '4px solid var(--color-primary)', borderRadius: '0 0 12px 0' }}></div>

                    <QrCode size={220} className="text-white opacity-95" />

                    <div className="absolute flex flex-col items-center justify-center p-3 bg-primary rounded-xl shadow-lg" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '4px solid white' }}>
                        <Zap size={24} className="text-white" />
                    </div>
                </div>

                <div className="card-premium glass w-full flex flex-col gap-6 items-center mb-8">
                    <div className="flex flex-col items-center gap-1">
                        <p className="caption text-grey-500 font-extrabold">VERIFICATION IDENTIFIER</p>
                        <p className="h2 font-extrabold tracking-widest text-primary uppercase">{orderId}</p>
                    </div>

                    <div className="flex w-full gap-3 pt-4 border-t" style={{ borderStyle: 'dashed' }}>
                        <button className="btn btn-outline flex-1 gap-2 glass py-4">
                            <Download size={20} /> Receipt
                        </button>
                        <button className="btn btn-outline flex-1 gap-2 glass py-4">
                            <Share2 size={20} /> Share
                        </button>
                    </div>
                </div>

                <button
                    className="btn btn-primary w-full py-5 text-lg mt-auto shadow-lg"
                    onClick={() => navigate('/thanks')}
                >
                    Finish Shopping Journey
                </button>

                <div className="mt-6 flex items-center gap-2 opacity-40">
                    <ShieldCheck size={16} />
                    <span className="caption font-bold">LEGALLY VERIFIED TRANSACTION</span>
                </div>
            </div>
        </div>
    );
};

export default ExitVerification;
