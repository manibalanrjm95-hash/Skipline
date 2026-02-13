import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="app-container mesh-bg overflow-hidden flex flex-col">
            {/* Abstract background elements */}
            <div className="absolute" style={{ top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'var(--color-primary-glow)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }}></div>
            <div className="absolute" style={{ bottom: '20%', left: '-10%', width: '250px', height: '250px', background: 'var(--color-secondary-glow)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }}></div>

            <div className="flex-1 flex flex-col justify-center items-center screen-padding relative animate-fade" style={{ zIndex: 1 }}>
                <div className="logo-container bg-primary mb-8 pulse-soft">
                    <ShoppingBag size={48} color="white" strokeWidth={2.5} />
                </div>

                <div className="text-center mb-12">
                    <h1 className="mb-4">Skip the Line,<br /><span className="text-primary">Shop with Ease.</span></h1>
                    <p className="body-lg opacity-80">Experience the future of retail with our instant self-checkout solution.</p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <button
                        className="btn btn-primary w-full py-5 text-lg"
                        onClick={() => navigate('/entry')}
                    >
                        Get Started <ArrowRight size={20} />
                    </button>

                    <button
                        className="btn btn-outline w-full py-5 text-lg glass"
                        onClick={() => navigate('/admin')}
                    >
                        Admin Portal
                    </button>
                </div>

                <div className="mt-12 flex items-center gap-8 opacity-60">
                    <div className="flex flex-col items-center gap-1">
                        <Zap size={20} className="text-primary" />
                        <span className="caption">Instant</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <ShieldCheck size={20} className="text-secondary" />
                        <span className="caption">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <ShoppingBag size={20} className="text-success" />
                        <span className="caption">Contactless</span>
                    </div>
                </div>
            </div>

            <p className="caption text-grey-400 text-center absolute w-full pb-8" style={{ bottom: 0 }}>
                Powered by SkipLine Engine V3.0
            </p>
        </div>
    );
};

export default Landing;
