import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Store, MapPin, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

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
        <div className="m3-scaffold">
            <header className="page-padding pt-8 pb-4">
                <button
                    className="w-12 h-12 flex items-center justify-center text-md-sys-color-on-surface-variant state-layer rounded-full"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft size={24} />
                </button>
            </header>

            <main className="m3-content flex flex-col items-center">
                <div className="w-16 h-16 m3-card card-filled rounded-full flex items-center justify-center text-md-sys-color-primary mb-6">
                    <Store size={32} />
                </div>

                <div className="text-center mb-10">
                    <h1 className="headline-medium text-md-sys-color-on-surface">Find Store</h1>
                    <p className="body-large text-md-sys-color-on-surface-variant">Enter the shop code to start shopping.</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest px-1">Shop Code</label>
                        <input
                            type="text"
                            placeholder="e.g. SL-001"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value.toUpperCase());
                                setError('');
                            }}
                            className={`m3-text-field text-center font-bold tracking-widest ${error ? 'border-b-md-sys-color-error' : ''}`}
                            autoFocus
                        />
                        {error && (
                            <div className="flex items-center gap-2 text-md-sys-color-error px-1 mt-1">
                                <AlertCircle size={14} />
                                <span className="label-medium">{error}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="m3-btn btn-filled h-14 font-bold text-base shadow-md"
                        disabled={loading || !code}
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : 'ENTER SHOP'}
                    </button>
                </form>

                <div className="w-full mt-12 bg-md-sys-color-surface-variant/30 p-4 rounded-[28px]">
                    <p className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest mb-4 px-2">Nearby Stores</p>
                    <button
                        className="m3-card card-outlined w-full flex items-center justify-between state-layer"
                        onClick={() => setCode('SL-TN-001')}
                    >
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 bg-md-sys-color-surface-variant rounded-full flex items-center justify-center text-md-sys-color-secondary">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="title-medium text-md-sys-color-on-surface">SkipLine Urapakkam</p>
                                <p className="label-small text-md-sys-color-on-surface-variant uppercase">SL-TN-001</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-md-sys-color-outline" />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ShopCodeEntry;
