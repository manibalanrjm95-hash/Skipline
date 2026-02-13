import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="m3-scaffold justify-center items-center">
            <div className="m3-content flex flex-col items-center text-center">
                {/* M3 Logo Container */}
                <div className="m3-card card-filled w-24 h-24 flex items-center justify-center mb-12 rounded-[28px] text-md-sys-color-primary">
                    <ShoppingBag size={48} />
                </div>

                <h1 className="display-medium text-md-sys-color-on-surface mb-4">Skip the Line.</h1>
                <p className="body-large text-md-sys-color-on-surface-variant max-w-[280px] mb-12">
                    The world’s fastest checkout experience. <br />Scan, Pay, and Go.
                </p>

                <div className="w-full max-w-[320px] flex flex-col gap-4">
                    <button
                        className="m3-btn btn-filled h-14 text-base font-bold shadow-md"
                        onClick={() => navigate('/entry')}
                    >
                        START SHOPPING
                    </button>

                    <button
                        className="m3-btn btn-tonal h-14 text-base font-bold"
                        onClick={() => navigate('/admin/login')}
                    >
                        ADMIN PORTAL
                    </button>
                </div>
            </div>

            <div className="absolute bottom-10 left-0 w-full text-center">
                <p className="label-medium text-md-sys-color-on-surface-variant opacity-50 tracking-widest">v2.1.0 • MATERIAL 3 EXPRESSIVE</p>
            </div>
        </div>
    );
};

export default Landing;
