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
        <div className="m3-scaffold items-center">
            <header className="m3-top-app-bar w-full">
                <button
                    className="w-10 h-10 flex items-center justify-center state-layer rounded-full"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft size={24} />
                </button>
            </header>

            <main className="m3-content w-full max-w-sm flex flex-col items-center">
                <div className="mb-10 text-center flex flex-col items-center">
                    <div className="m3-card card-filled w-16 h-16 flex items-center justify-center mb-6 text-primary">
                        <Store size={32} />
                    </div>
                    <h2 className="headline-medium text-grey-900 mb-2">Find your store</h2>
                    <p className="body-large text-grey-600">Enter the identifier for this location.</p>
                </div>

                <div className="m3-card card-elevated w-full relative overflow-hidden p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="space-y-2">
                            <label className="label-medium text-grey-500 uppercase tracking-widest ml-1">Store Identity</label>
                            <input
                                type="text"
                                placeholder="SL-00-000"
                                className={`m3-text-field text-center text-3xl font-bold uppercase ${error ? 'border-error' : ''}`}
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.toUpperCase());
                                    setError('');
                                }}
                                autoFocus
                                maxLength={10}
                            />
                            {error && (
                                <div className="flex items-center justify-center gap-2 text-md-sys-color-error mt-2">
                                    <AlertCircle size={14} />
                                    <span className="label-medium font-bold">{error}</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="m3-btn btn-filled w-full h-14 shadow-lg"
                            disabled={loading || !code}
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : 'ACCESS STORE'}
                        </button>
                    </form>
                </div>

                {/* Nearby Store Suggestion as a Chip/Card */}
                <div className="mt-12 w-full">
                    <p className="label-medium text-grey-500 text-center mb-4 uppercase tracking-widest">Closest to you</p>
                    <button
                        className="m3-card card-outlined w-full flex items-center gap-4 state-layer"
                        onClick={() => setCode('SL-TN-001')}
                    >
                        <div className="w-12 h-12 bg-md-sys-color-primary-container rounded-lg flex items-center justify-center text-primary">
                            <MapPin size={24} />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                            <p className="title-small text-grey-900 font-bold truncate">SkipLine Urapakkam</p>
                            <p className="label-medium text-grey-500 uppercase tracking-wider">SL-TN-001</p>
                        </div>
                        <ChevronRight size={20} className="text-grey-300" />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ShopCodeEntry;
