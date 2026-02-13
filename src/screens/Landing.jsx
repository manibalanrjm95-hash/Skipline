import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Zap } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="app-container justify-center relative overflow-hidden">
            {/* Helixion V4 Mesh Background */}
            <div className="mesh-bg"></div>

            {/* Parallax Floating Elements */}
            <div className="absolute top-[10%] right-[-5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[20%] left-[-10%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>

            <div className="screen-padding flex flex-col items-center text-center relative z-10 animate-fade-in">
                <div className="mb-12 relative group">
                    <div className="w-28 h-28 bg-white rounded-[40px] flex items-center justify-center shadow-xl border border-white/80 mb-8 mx-auto relative z-10 transform transition-transform group-hover:scale-110 duration-500">
                        <ShoppingBag size={48} className="text-primary" strokeWidth={2.5} />
                    </div>
                    {/* Floating elements behind logo */}
                    <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg animate-bounce border border-grey-100/50" style={{ animationDuration: '3s' }}>
                        <Zap size={24} className="text-warning" fill="currentColor" />
                    </div>
                </div>

                <div className="mb-16">
                    <h1 className="text-display text-grey-900 mb-6 tracking-tight">
                        Skip the <span className="text-primary relative inline-block">Line.
                            <span className="absolute bottom-1 left-0 w-full h-2 bg-primary/10 -z-10 rounded-full"></span>
                        </span>
                    </h1>
                    <p className="body-lg text-grey-600 max-w-xs mx-auto leading-relaxed">
                        The world’s fastest checkout experience. <br />Scan, Pay, and Go.
                    </p>
                </div>

                <div className="w-full max-w-xs flex flex-col gap-6">
                    <button
                        className="btn btn-primary magnetic-btn w-full py-6 text-xl shadow-xl hover:shadow-primary transition-all rounded-[24px]"
                        onClick={() => navigate('/entry')}
                    >
                        Start Shopping <ArrowRight size={24} strokeWidth={3} />
                    </button>

                    <div className="glass-card p-4 mt-4 cursor-pointer magnetic-btn" onClick={() => navigate('/admin/login')}>
                        <p className="text-sm font-bold text-grey-500 uppercase tracking-widest">Admin Portal</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-0 w-full text-center opacity-40">
                <p className="caption text-grey-400 font-extrabold tracking-[0.2em]">v1.4.0 • Helixion V4 Signature</p>
            </div>
        </div>
    );
};

export default Landing;
