import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

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
            <div className="m3-content flex flex-col items-center w-full max-w-[400px]">
                {/* M3 Icon Container */}
                <div className="w-20 h-20 m3-card card-filled rounded-[28px] flex items-center justify-center mb-8 text-md-sys-color-secondary">
                    <ShieldCheck size={40} />
                </div>

                <div className="text-center mb-10">
                    <h1 className="headline-medium text-md-sys-color-on-surface">Admin Portal</h1>
                    <p className="body-large text-md-sys-color-on-surface-variant">Secure access for store managers.</p>
                </div>

                <div className="m3-card card-elevated w-full p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        {error && (
                            <div className="p-4 bg-md-sys-color-error-container text-md-sys-color-on-error-container rounded-xl flex items-center gap-3 text-sm font-bold">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest ml-1">Username</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="m3-text-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="label-medium text-md-sys-color-on-surface-variant uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="m3-text-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="m3-btn btn-filled h-14 font-bold tracking-widest mt-4"
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : 'LOGIN TO DASHBOARD'}
                        </button>
                    </form>
                </div>

                <button
                    className="mt-12 label-large font-bold text-md-sys-color-primary hover:underline transition-all tracking-widest uppercase"
                    onClick={() => navigate('/')}
                >
                    Back to Store
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
