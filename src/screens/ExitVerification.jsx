import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

const ExitVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentOrderId, STATUS } = useStore();
    const [order, setOrder] = React.useState(null);

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
                navigate('/thanks');
            }
        } catch (err) {
            console.error('Initial fetch error:', err);
        }
    }, [orderId, navigate, STATUS]);

    React.useEffect(() => {
        checkStatus();

        const channel = supabase
            .channel(`order-status-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`
                },
                (payload) => {
                    setOrder(payload.new);
                    if (payload.new.status === STATUS.EXITED) {
                        navigate('/thanks');
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId, checkStatus, STATUS]);

    if (!order) {
        return (
            <div className="app-container mesh-bg flex items-center justify-center h-screen">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    const isVerified = order.status === STATUS.VERIFIED || order.status === STATUS.EXITED;

    return (
        <div className="app-container mesh-bg flex flex-col items-center h-screen">
            <div className="screen-padding w-full flex-1 flex flex-col items-center justify-center animate-fade">

                {/* Status Header */}
                <div className="text-center mb-10">
                    <div className={`tag ${isVerified ? 'bg-success text-white' : 'bg-warning text-warning-content animate-pulse'} px-4 py-2 mb-4 font-bold inline-flex items-center gap-2 rounded-full shadow-md`}>
                        {isVerified ? <CheckCircle size={16} /> : <Loader2 size={16} className="animate-spin" />}
                        {isVerified ? 'PAYMENT VERIFIED' : 'VERIFYING PAYMENT'}
                    </div>
                </div>

                {/* Exit QR Card */}
                <div className="relative mb-10">
                    <div className="bg-white p-6 rounded-[32px] shadow-2xl relative z-10">
                        <QrCode size={200} className={`transition-all duration-500 ${isVerified ? 'text-grey-900 opacity-100' : 'text-grey-300 opacity-50 blur-sm'}`} />
                        {!isVerified && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <p className="text-center font-bold text-grey-500 bg-white/80 px-4 py-2 rounded-xl backdrop-blur-sm">Wait for Approval</p>
                            </div>
                        )}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-md border border-grey-100 flex items-center gap-2 whitespace-nowrap">
                            <span className="font-mono font-bold text-lg text-grey-900 tracking-wider">#{orderId.slice(-4)}</span>
                        </div>
                    </div>
                    {/* Glow effect when verified */}
                    {isVerified && <div className="absolute inset-0 bg-success blur-2xl opacity-20 rounded-full animate-pulse z-0"></div>}
                </div>

                <div className="text-center max-w-xs mb-10">
                    <h2 className="text-2xl font-extrabold text-grey-900 mb-2">{isVerified ? 'You exist good to go!' : 'Show to Staff'}</h2>
                    <p className="body-lg text-grey-500">
                        {isVerified ? 'Show this QR code at the exit gate to leave.' : 'Please show your screen to the store staff for verification.'}
                    </p>
                </div>

                {/* Order Summary */}
                <div className="w-full bg-white/60 backdrop-blur-lg rounded-2xl p-4 flex justify-between items-center border border-white/50">
                    <div>
                        <p className="caption text-grey-500 font-bold">TOTAL PAID</p>
                        <p className="text-xl font-extrabold text-grey-900">₹{order.total_amount.toFixed(2)}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-grey-300"></div>
                    <div>
                        <p className="caption text-grey-500 font-bold">ITEMS</p>
                        <p className="text-xl font-extrabold text-grey-900 text-right">{typeof order.items === 'string' ? JSON.parse(order.items).length : order.items.length}</p>
                    </div>
                </div>

            </div>

            <div className="py-6 flex items-center gap-2 opacity-30">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">SkipLine Secure Exit</span>
            </div>
        </div>
    );
};

export default ExitVerification;
