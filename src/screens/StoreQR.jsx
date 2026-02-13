import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, CheckCircle, Info, Loader2, QrCode } from 'lucide-react';

const StoreQR = () => {
    const navigate = useNavigate();
    const { cartTotal, currentOrderId, updateOrderStatus, STATUS } = useStore();
    const [loading, setLoading] = useState(false);

    const handleConfirmPayment = async () => {
        if (!currentOrderId) return;
        setLoading(true);
        const result = await updateOrderStatus(currentOrderId, STATUS.AWAITING_VERIFICATION);
        if (result.success) {
            navigate('/exit');
        } else {
            alert('Failed to update status. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="app-container mesh-bg flex flex-col h-screen">
            <div className="screen-padding flex-1 flex flex-col items-center justify-center animate-fade">
                <button
                    className="absolute top-8 left-6 p-2 bg-white rounded-full shadow-sm text-grey-900"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="bg-white p-8 rounded-[40px] shadow-xl border border-grey-100 flex flex-col items-center gap-6 mb-10 w-full max-w-xs relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

                    <div className="text-center">
                        <p className="caption text-grey-400 font-bold mb-1">PAYING</p>
                        <h2 className="text-4xl text-grey-900 font-extrabold">₹{Number(cartTotal).toFixed(2)}</h2>
                    </div>

                    <div className="p-4 bg-grey-50 rounded-3xl border-2 border-dashed border-grey-200">
                        <QrCode size={180} className="text-grey-900" />
                    </div>

                    <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full">
                        <Info size={16} fill="currentColor" className="text-primary" />
                        <span className="text-xs font-bold">Scan Store QR at Counter</span>
                    </div>
                </div>

                <button
                    className="btn btn-primary w-full max-w-xs py-5 text-lg shadow-lg flex items-center justify-center gap-3 mb-6"
                    onClick={handleConfirmPayment}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                            <CheckCircle size={24} />
                            I Have Paid
                        </>
                    )}
                </button>

                <p className="caption text-grey-400 font-bold max-w-[200px] text-center leading-relaxed opacity-70">
                    Click above after completing the payment in your custom UPI app.
                </p>
            </div>
        </div>
    );
};

export default StoreQR;
