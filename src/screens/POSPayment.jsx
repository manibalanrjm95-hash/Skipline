import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import ProductQR from '../components/ProductQR';

const POSPayment = () => {
    const navigate = useNavigate();
    const { cartTotal, currentOrderId, updateOrderStatus, STATUS } = useStore();
    const [loading, setLoading] = useState(false);

    const handleStaffScanned = async () => {
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
                    <h2 className="font-bold">Pay at Counter</h2>
                </div>

                <div className="flex flex-col items-center text-center gap-6 mt-4">
                    <div className="bg-white p-6 rounded-[40px] shadow-lg border-4 border-secondary border-opacity-20">
                        <ProductQR productCode={currentOrderId || 'NO-ORDER'} size={240} />
                    </div>

                    <div className="max-w-xs">
                        <h3 className="font-extrabold text-grey-900 mb-2">Show this to Staff</h3>
                        <p className="body-sm text-grey-500 font-medium">Please proceed to the billing counter and show this QR. Staff will collect cash/POS payment of ₹{Number(cartTotal || 0).toFixed(2)}.</p>
                    </div>

                    <div className="w-full card-premium glass flex items-center gap-4 p-5">
                        <div className="bg-secondary p-3 rounded-xl text-white">
                            <CreditCard size={24} />
                        </div>
                        <div className="text-left">
                            <p className="body-sm font-extrabold text-grey-900">Order ID</p>
                            <p className="caption font-bold text-secondary uppercase tracking-widest">{currentOrderId?.slice(-8) || 'GENERATING...'}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <button
                        className="btn btn-secondary w-full py-5 text-lg shadow-lg text-white"
                        onClick={handleStaffScanned}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : 'Staff Has Scanned'}
                    </button>
                    <div className="flex items-center justify-center gap-2 text-grey-400">
                        <CheckCircle size={16} />
                        <p className="caption font-bold">MANUAL POS FINALIZATION</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POSPayment;
