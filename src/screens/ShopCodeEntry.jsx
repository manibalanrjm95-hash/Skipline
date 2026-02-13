import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, MapPin, AlertCircle, Loader2, Copy } from 'lucide-react';

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
        <div className="app-container mesh-bg flex flex-col justify-center">
            <div className="screen-padding animate-fade">
                <button className="btn p-3 bg-white rounded-md shadow-sm mb-12" onClick={() => navigate('/')}>
                    <ArrowLeft size={24} className="text-grey-900" />
                </button>

                <div className="card-premium glass">
                    <div className="flex flex-col gap-2 mb-8">
                        <h2 className="text-grey-900">Enter Shop Code</h2>
                        <p className="body-sm text-grey-500">
                            Enter the unique code to access the store inventory.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="input-group">
                            <label className="caption text-primary">Store Locator Code</label>
                            <input
                                type="text"
                                placeholder="e.g. SL-TN-001"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.toUpperCase());
                                    setError('');
                                }}
                                className={error ? 'error' : ''}
                                style={{ height: '60px', borderRadius: '14px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}
                                autoFocus
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-error animate-fade mt-2">
                                    <AlertCircle size={16} />
                                    <span className="body-sm font-semibold">{error}</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full py-5"
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Access Store'}
                        </button>
                    </form>
                </div>

                <div className="mt-12">
                    <p className="caption mb-4 text-grey-500 font-bold">NEARBY SUGGESTION</p>
                    <div className="card glass flex items-center justify-between p-4" style={{ borderRadius: '20px' }}>
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg shadow-sm">
                                <MapPin size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="body-sm font-bold">SkipLine Mart - Urapakkam</p>
                                <p className="caption text-grey-500 font-medium">SL-TN-001</p>
                            </div>
                        </div>
                        <button
                            className="btn bg-grey-100 p-2 text-grey-900 shadow-none rounded-md"
                            onClick={() => setCode('SL-TN-001')}
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopCodeEntry;
