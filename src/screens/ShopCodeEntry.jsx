import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, MapPin, AlertCircle, Loader2, Store, ChevronRight } from 'lucide-react';

const ShopCodeEntry = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginShop } = useStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code) {
            setError('Please enter a shop code');
            return;
        }

        setError('');
        setLoading(true);

        const result = await loginShop(code.toUpperCase());
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="app-container justify-center relative">
            <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-grey-200 to-transparent -z-10"></div>

            <div className="screen-padding w-full">
                <button
                    className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-grey-900 mb-8 hover:scale-105 transition-transform"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6 text-primary border border-grey-100">
                        <Store size={32} />
                    </div>
                    <h2 className="text-h1 text-grey-900 mb-3">Which Store?</h2>
                    <p className="body-md text-grey-500">Enter the unique code found at the store entrance.</p>
                </div>

                <div className="card-premium relative overflow-hidden">
                    {/* Decor */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                        <div className="flex flex-col gap-3">
                            <label className="caption ml-1">Store Code</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="SL-00-000"
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value.toUpperCase());
                                        setError('');
                                    }}
                                    className={`input-field text-center tracking-widest text-2xl uppercase ${error ? 'border-error bg-error-bg/10' : 'focus:border-primary'}`}
                                    autoFocus
                                    maxLength={10}
                                />
                                {error && (
                                    <div className="absolute -bottom-8 left-0 w-full text-center flex items-center justify-center gap-2 text-error animate-slide-up">
                                        <AlertCircle size={16} />
                                        <span className="text-sm font-bold">{error}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary w-full py-4 text-lg shadow-lg"
                                disabled={loading || !code}
                            >
                                {loading ? <Loader2 size={24} className="animate-spin" /> : 'Enter Shop'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Nearby Store Pill */}
                <div className="mt-12 flex justify-center">
                    <button
                        className="card-floating hover:scale-105 transition-transform group pr-2"
                        onClick={() => setCode('SL-TN-001')}
                    >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
                            <MapPin size={20} />
                        </div>
                        <div className="text-left mr-4">
                            <p className="text-sm font-bold text-grey-900">Nearby: Urapakkam</p>
                            <p className="text-xs text-grey-500 font-medium">SL-TN-001</p>
                        </div>
                        <ChevronRight size={18} className="text-grey-300 group-hover:text-primary transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopCodeEntry;
