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
        <div className="max-app-width flex flex-col justify-center page-padding">
            {/* Minimal Header */}
            <div className="absolute top-8 left-5">
                <button
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="w-full flex flex-col items-center">
                {/* Soft Neutral Circle Icon */}
                <div className="w-16 h-16 bg-bg-app border border-border rounded-full flex items-center justify-center mb-6 text-primary">
                    <Store size={32} strokeWidth={1.5} />
                </div>

                <div className="text-center mb-10">
                    <h1 className="h1 text-text-primary mb-2">Find Store</h1>
                    <p className="body text-text-secondary">Enter the shop code to start shopping.</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full section-gap">
                    <div className="flex flex-col gap-2">
                        <label className="label text-text-secondary uppercase tracking-widest px-1">Shop Code</label>
                        <input
                            type="text"
                            placeholder="e.g. SL-001"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value.toUpperCase());
                                setError('');
                            }}
                            className={`input-v2 text-center text-xl font-bold uppercase ${error ? 'border-error' : ''}`}
                            autoFocus
                        />
                        {error && (
                            <div className="flex items-center gap-2 text-error px-1 mt-1">
                                <AlertCircle size={14} />
                                <span className="small font-medium">{error}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-v2 btn-v2-primary"
                        disabled={loading || !code}
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : 'Enter Shop'}
                    </button>
                </form>

                {/* Nearby Store Card */}
                <div className="mt-12 w-full">
                    <p className="label text-text-secondary uppercase tracking-widest mb-4 px-1">Nearby Stores</p>
                    <button
                        className="card-v2 w-full flex items-center justify-between group"
                        onClick={() => setCode('SL-TN-001')}
                    >
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-secondary">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="body font-bold text-text-primary">SkipLine Urapakkam</p>
                                <p className="small text-text-secondary uppercase">SL-TN-001</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-border group-hover:text-text-primary transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopCodeEntry;
