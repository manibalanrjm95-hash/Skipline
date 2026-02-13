import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QrCode, Download, Share2, CheckCircle, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

const ExitVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentOrderId, STATUS } = useStore();
    const [order, setOrder] = React.useState(null);
    const [polling, setPolling] = React.useState(true);

    const orderId = location.state?.orderId || currentOrderId;

    const checkStatus = React.useCallback(async () => {
        if (!orderId) return;
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (error) throw error;
            setOrder(data);

            if (data.status === STATUS.EXITED) {
                setPolling(false);
                navigate('/thanks');
            }
        } catch (err) {
            console.error('Polling error:', err);
        }
    }, [orderId, navigate, STATUS]);

    React.useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 3000);
        return () => clearInterval(interval);
    }, [checkStatus]);

    if (!order) {
        return (
            <div className="app-container mesh-bg flex items-center justify-center">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    const isVerified = order.status === STATUS.VERIFIED || order.status === STATUS.EXITED;

    return (
        <div className="app-container mesh-bg flex flex-col items-center">
            <div className="screen-padding w-full flex-1 flex flex-col items-center animate-fade">
                <div className="text-center mb-10">
                    <div className={`tag ${isVerified ? 'tag-success' : 'bg-warning'} text-white px-4 py-2 mb-4 font-bold inline-flex items-center gap-2 rounded-full`}>
                        {isVerified ? <CheckCircle size={16} /> : <Loader2 size={16} className="animate-spin" />}
                        {isVerified ? 'EXIT APPROVED' : 'WAITING FOR STAFF VERIFICATION'}
                    </div>
                    <h1 className="mb-2">{isVerified ? 'You’re All Set!' : 'Final Step!'}</h1>
                    <p className="body-lg text-grey-500">
                        {isVerified ? 'Thank you for shopping with SkipLine.' : 'Please wait for staff to verify your payment.'}
                    </p>
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

                <div className="card-premium glass w-full flex flex-col gap-6 items-center mb-8 border-l-4 border-l-primary">
                    <div className="flex flex-col items-center gap-1">
                        <p className="caption text-grey-500 font-extrabold uppercase tracking-widest">Order ID</p>
                        <p className="h2 font-extrabold tracking-widest text-primary uppercase">#{orderId.slice(-8)}</p>
                    </div>

                    <div className="flex w-full gap-3 pt-4 border-t" style={{ borderStyle: 'dashed' }}>
                        <div className="flex-1 text-center">
                            <p className="caption text-grey-400 font-bold mb-1 uppercase">Amount Paid</p>
                            <p className="body-sm font-extrabold text-grey-900">₹{order.total_amount.toFixed(2)}</p>
                        </div>
                        <div className="w-[1px] bg-grey-100 h-10"></div>
                        <div className="flex-1 text-center">
                            <p className="caption text-grey-400 font-bold mb-1 uppercase">Items</p>
                            <p className="body-sm font-extrabold text-grey-900">{typeof order.items === 'string' ? JSON.parse(order.items).length : order.items.length}</p>
                        </div>
                    </div>
                </div>

                {isVerified && (
                    <div className="bg-success bg-opacity-10 p-5 rounded-2xl border border-success border-opacity-20 text-center animate-bounce-soft">
                        <p className="caption text-success font-extrabold">GATE UNLOCKED • FEEL FREE TO EXIT</p>
                    </div>
                )}

                <div className="mt-auto flex items-center gap-2 opacity-40 py-8">
                    <ShieldCheck size={16} />
                    <span className="caption font-bold uppercase tracking-widest">SkipLine Core V1 Secure Exit</span>
                </div>
            </div>
        </div>
    );
};

export default ExitVerification;
