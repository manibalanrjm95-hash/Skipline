import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, CreditCard, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const { cartTotal } = useStore();

    const methods = [
        {
            id: 'qr',
            title: 'Scan Store QR',
            desc: 'Scan the physical UPI QR at shelf',
            icon: QrCode,
            color: 'var(--color-primary)',
            bg: 'var(--color-primary-glow)',
            path: '/payment-qr'
        },
        {
            id: 'pos',
            title: 'Pay at Counter',
            desc: 'Cash or POS at the entrance',
            icon: CreditCard,
            color: 'var(--color-secondary)',
            bg: 'var(--color-secondary-glow)',
            path: '/payment-counter'
        }
    ];

    return (
        <div className="app-container mesh-bg flex flex-col">
            <div className="screen-padding flex-1 animate-fade">
                <div className="flex items-center gap-4 mb-8">
                    <button className="btn p-3 bg-white rounded-md shadow-sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={24} className="text-grey-900" />
                    </button>
                    <h2 className="font-bold">Payment Method</h2>
                </div>

                <div className="card-premium glass flex flex-col gap-4 mb-10 border-l-4 border-l-primary">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="caption text-grey-500 font-extrabold">TOTAL PAYABLE</p>
                            <h1 className="text-primary">₹{Number(cartTotal || 0).toFixed(2)}</h1>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded-2xl">
                            <Zap size={24} className="text-primary" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="caption text-grey-500 font-bold ml-1 uppercase tracking-wider">Choose how to pay</p>
                    {methods.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => navigate(m.path)}
                            className="card-premium glass flex items-center gap-5 p-6 hover:translate-x-2 transition-transform border-none text-left w-full group"
                        >
                            <div className="p-4 rounded-2xl" style={{ background: m.bg, color: m.color }}>
                                <m.icon size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-grey-900 font-extrabold">{m.title}</h3>
                                <p className="body-sm text-grey-500 font-medium">{m.desc}</p>
                            </div>
                            <ChevronRight size={20} className="text-grey-300 group-hover:text-primary transition-colors" />
                        </button>
                    ))}
                </div>

                <div className="mt-10 p-5 bg-grey-100 bg-opacity-50 rounded-2xl border border-dashed border-grey-300 text-center">
                    <p className="caption text-grey-500 font-bold italic">No physical cash is accepted via app.<br />Please verify payment with staff after transfer.</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;
