import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="max-app-width flex flex-col justify-center items-center page-padding text-center">
            {/* Branding */}
            <div className="mb-12">
                <div className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center mb-8 mx-auto">
                    <ShoppingBag size={40} className="text-primary" />
                </div>
                <h1 className="h1 text-text-primary mb-4">Skip the Line.</h1>
                <p className="body text-text-secondary max-w-xs mx-auto">
                    The world’s fastest checkout experience. <br />Scan, Pay, and Go.
                </p>
            </div>

            <div className="w-full flex flex-col gap-4 max-w-xs">
                <button
                    className="btn-v2 btn-v2-primary"
                    onClick={() => navigate('/entry')}
                >
                    Start Shopping
                </button>

                <button
                    className="btn-v2 btn-v2-outline"
                    onClick={() => navigate('/admin/login')}
                >
                    Admin Portal
                </button>
            </div>

            <div className="absolute bottom-10 left-0 w-full">
                <p className="label text-text-secondary uppercase tracking-[0.2em] opacity-40">v2.0.0 • Skipline UI System</p>
            </div>
        </div>
    );
};

export default Landing;
