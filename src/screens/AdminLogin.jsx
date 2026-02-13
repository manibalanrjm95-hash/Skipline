import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

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
        <div className="max-app-width flex flex-col justify-center items-center page-padding">
            <div className="w-full max-w-sm flex flex-col items-center">
                {/* Branding Icon */}
                <div className="w-20 h-20 bg-bg-app border border-border rounded-[24px] flex items-center justify-center mb-8 text-secondary">
                    <ShieldCheck size={40} strokeWidth={1.5} />
                </div>

                <div className="text-center mb-10">
                    <h1 className="h1 text-text-primary mb-2">Admin Portal</h1>
                    <p className="body text-text-secondary">Secure access for store managers.</p>
                </div>

                <div className="card-v2 w-full p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="section-gap">
                        {error && (
                            <div className="p-4 bg-error/5 border border-error/20 rounded-xl flex items-center gap-3 text-error text-sm font-medium">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="label text-text-secondary uppercase tracking-widest ml-1">Username</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="input-v2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="label text-text-secondary uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input-v2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-v2 btn-v2-primary mt-4"
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Login to Dashboard'}
                        </button>
                    </form>
                </div>

                <button
                    className="mt-12 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors uppercase tracking-[0.2em]"
                    onClick={() => navigate('/')}
                >
                    Back to Store
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
