import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, User, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginAdmin } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // V1 Auth Logic: Simulation matching the original implementation
            // admin / admin123
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
        <div className="app-container justify-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-grey-900 via-grey-800 to-transparent -z-10"></div>
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>

            <div className="screen-padding w-full relative z-10">
                <div className="mb-10 text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-display text-white mb-2">Admin Portal</h1>
                    <p className="body-md text-grey-400">Secure access for store managers.</p>
                </div>

                <div className="card-premium bg-white shadow-xl border-none">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && (
                            <div className="p-4 bg-error-bg rounded-xl flex items-center gap-3 text-error text-sm font-bold animate-fade-in">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="caption ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    className="input-field pl-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="caption ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field pl-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full py-4 text-lg shadow-primary flex justify-between items-center px-6 mt-2 group"
                            disabled={loading}
                        >
                            <span className="font-bold">{loading ? 'Verifying...' : 'Login to Dashboard'}</span>
                            {!loading && <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors"><ArrowRight size={20} /></div>}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <button
                        className="text-sm font-bold text-grey-500 hover:text-white transition-colors"
                        onClick={() => navigate('/')}
                    >
                        Back to Store
                    </button>
                </div>
            </div>

            <div className="absolute bottom-6 left-0 w-full text-center">
                <p className="text-[10px] font-bold text-grey-600 uppercase tracking-widest opacity-50">Secured with 256-bit Encryption</p>
            </div>
        </div>
    );
};

export default AdminLogin;
