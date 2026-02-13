import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // V1 Auth Logic
        setTimeout(() => {
            if (username === 'admin' && password === 'admin123') {
                sessionStorage.setItem('skipline_isAdmin', 'true');
                navigate('/admin');
            } else {
                setError('Invalid credentials. Hint: admin / admin123');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="app-container mesh-bg flex flex-col items-center justify-center screen-padding">
            <div className="w-full max-w-md animate-fade">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-primary p-4 rounded-3xl shadow-lg mb-6 text-white rotate-3 hover:rotate-0 transition-transform">
                        <ShoppingBag size={48} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-grey-900 mb-2">Admin Portal</h1>
                    <p className="body-sm text-grey-500 font-medium">Log in to manage store operations.</p>
                </div>

                <form onSubmit={handleLogin} className="card-premium glass flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="caption font-extrabold text-grey-500 ml-1">USERNAME</label>
                        <div className="input-field flex items-center gap-3 bg-white px-4 border shadow-sm rounded-2xl">
                            <User size={18} className="text-grey-400" />
                            <input
                                type="text"
                                className="w-full py-4 bg-transparent outline-none font-medium"
                                placeholder="Enter admin username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="caption font-extrabold text-grey-500 ml-1">PASSWORD</label>
                        <div className="input-field flex items-center gap-3 bg-white px-4 border shadow-sm rounded-2xl">
                            <Lock size={18} className="text-grey-400" />
                            <input
                                type="password"
                                className="w-full py-4 bg-transparent outline-none font-medium"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-error-light p-4 rounded-xl border border-error bg-opacity-10 text-error text-center body-sm font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full py-5 text-lg shadow-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>Log In <ArrowRight size={20} /></>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="btn text-grey-500 body-sm font-bold hover:text-primary transition-colors"
                    >
                        Back to Customer Flow
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
