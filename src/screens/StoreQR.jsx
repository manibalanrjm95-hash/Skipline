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
        <div className="app-container mesh-bg flex flex-col">
            <div className="screen-padding flex-1 animate-fade">
                <div className="flex items-center gap-4 mb-8">
                    <button className="btn p-3 bg-white rounded-md shadow-sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} className="text-grey-900" />
                    </button>
                    <h2 className="font-bold">Scan Store QR</h2>
                </div>

                <div className="flex flex-col items-center text-center gap-6 mt-4">
                    <div className="bg-white p-8 rounded-[40px] shadow-lg border border-grey-100 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
                        <QrCode size={200} className="text-grey-900" strokeWidth={1} />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-primary text-white p-4 rounded-2xl shadow-xl flex flex-col items-center gap-2">
                                <Info size={24} />
                                <span className="caption font-extrabold">PHYSICAL QR ONLY</span>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-xs">
                        <h3 className="font-extrabold text-grey-900 mb-2">Scan & Pay ₹{Number(cartTotal || 0).toFixed(2)}</h3>
                        <p className="body-sm text-grey-500 font-medium">Please scan the physical UPI QR code available at the store shelf or entrance to complete your transfer.</p>
                    </div>

                    <div className="w-full card glass bg-opacity-40 flex flex-col gap-4 text-left p-6">
                        <div className="flex items-start gap-3">
                            <div className="bg-success bg-opacity-10 p-2 rounded-lg mt-1">
                                <CheckCircle size={18} className="text-success" />
                            </div>
                            <p className="body-sm text-grey-700 font-medium lines-tight">After completing the payment in your UPI app, click the button below to notify our staff.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <button
                        className="btn btn-primary w-full py-5 text-lg shadow-lg"
                        onClick={handleConfirmPayment}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : 'I Have Paid'}
                    </button>
                    <p className="caption text-center text-grey-400 font-bold">STAFF VERIFICATION REQUIRED AFTER CONFIRMATION</p>
                </div>
            </div>
        </div>
    );
};

export default StoreQR;
