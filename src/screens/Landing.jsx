import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="m3-scaffold justify-center items-center">
            <div className="m3-content flex flex-col items-center text-center max-w-sm">
                {/* M3 Logo Container (Filled Card) */}
                <div className="m3-card card-filled w-24 h-24 flex items-center justify-center mb-12 shadow-sm" style={{ borderRadius: '28px' }}>
                    <ShoppingBag size={48} className="text-primary" />
                </div>

                <div className="mb-12">
                    <h1 className="display-large text-grey-900 mb-4">
                        Skip the Line.
                    </h1>
                    <p className="body-large text-grey-700">
                        The world’s fastest checkout experience. Scan, Pay, and Go.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <button
                        className="m3-btn btn-filled state-layer w-full h-14 text-base"
                        onClick={() => navigate('/entry')}
                    >
                        Start Shopping
                        <ArrowRight size={20} />
                    </button>

                    <button
                        className="m3-btn btn-outlined state-layer w-full h-14 text-base"
                        onClick={() => navigate('/admin/login')}
                    >
                        Admin Portal
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8 left-0 w-full text-center">
                <p className="label-medium text-grey-400">v2.0.0 • Material 3 Expressive</p>
            </div>
        </div>
    );
};

export default Landing;
