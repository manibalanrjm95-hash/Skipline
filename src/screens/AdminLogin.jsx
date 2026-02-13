import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            if (email === 'admin' && password === 'admin123') {
                sessionStorage.setItem('skipline_isAdmin', 'true');
                navigate('/admin');
            } else {
                setError('Invalid credentials. Try admin / admin123');
            }
        } catch (err) {
            setError('Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="m3-scaffold justify-center items-center">
            <header className="absolute top-0 left-0 w-full p-6">
                <button
                    className="label-medium text-grey-500 hover:text-primary transition-all uppercase tracking-widest font-bold"
                    onClick={() => navigate('/')}
                >
                    Back to Store
                </button>
            </header>

            <main className="m3-content w-full max-w-sm">
                <div className="text-center mb-10 flex flex-col items-center">
                    <div className="m3-card card-filled w-20 h-20 flex items-center justify-center mb-6 text-primary" style={{ borderRadius: '28px' }}>
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="headline-medium text-grey-900 mb-2">Admin Portal</h1>
                    <p className="body-large text-grey-600">Secure store management access</p>
                </div>

                <div className="m3-card card-elevated p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && (
                            <div className="m3-chip bg-md-sys-color-error-container text-md-sys-color-on-error-container border-none h-auto p-4 flex items-center gap-3">
                                <AlertCircle size={20} className="shrink-0" />
                                <span className="label-medium font-bold">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="label-medium text-grey-500 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    className="m3-text-field pl-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="label-medium text-grey-500 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="m3-text-field pl-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="m3-btn btn-filled w-full h-16 text-lg font-bold shadow-lg mt-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <span>LOGIN TO DASHBOARD</span>
                                    <ArrowRight size={20} className="ml-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="label-medium text-grey-400 text-center mt-12 uppercase tracking-[0.2em]">
                    SkipLine Security Enforcement
                </p>
            </main>
        </div>
    );
};

export default AdminLogin;
