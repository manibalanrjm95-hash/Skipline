import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Zap } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="app-container justify-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 -left-16 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="screen-padding flex flex-col items-center text-center relative z-10">
                <div className="mb-12 relative">
                    <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-lg border border-white/50 mb-8 mx-auto relative z-10">
                        <ShoppingBag size={40} className="text-primary" strokeWidth={2.5} />
                    </div>
                    {/* Floating elements behind logo */}
                    <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-2xl shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
                        <Zap size={20} className="text-warning" fill="currentColor" />
                    </div>
                </div>

                <div className="mb-12">
                    <h1 className="text-display text-grey-900 mb-6">
                        Skip the <span className="text-primary">Line.</span>
                    </h1>
                    <p className="body-lg text-grey-500 max-w-xs mx-auto leading-relaxed">
                        The fastest way to shop. <br />Scan, Pay, and Go in seconds.
                    </p>
                </div>

                <div className="w-full max-w-xs flex flex-col gap-5">
                    <button
                        className="btn btn-primary w-full py-5 text-lg shadow-primary hover:scale-105 transition-transform"
                        onClick={() => navigate('/entry')}
                    >
                        Start Shopping <ArrowRight size={24} />
                    </button>

                    <button
                        className="btn btn-ghost w-full py-3 text-sm font-semibold tracking-wide"
                        onClick={() => navigate('/admin/login')}
                    >
                        Admin Portal
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8 left-0 w-full text-center">
                <p className="caption text-grey-300">v1.3.0 • Helixion UI</p>
            </div>
        </div>
    );
};

export default Landing;
