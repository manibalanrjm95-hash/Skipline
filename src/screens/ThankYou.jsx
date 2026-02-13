import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Star, Heart, Share2, Home } from 'lucide-react';

const ThankYou = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);

    return (
        <div className="app-container mesh-bg flex flex-col items-center justify-center screen-padding text-center">
            <div className="flex-1 flex flex-col items-center justify-center w-full animate-fade">
                <div className="logo-container bg-success scale-125 mb-10 pulse-soft">
                    <CheckCircle size={48} color="white" strokeWidth={3} />
                </div>

                <div className="mb-10">
                    <h1 className="mb-3">Purchase Complete!</h1>
                    <p className="body-lg text-grey-500">Your shopping experience was tailored for speed and excellence.</p>
                </div>

                <div className="card-premium glass w-full flex flex-col gap-6 items-center shadow-lg px-8">
                    <div className="p-3 bg-warning-light rounded-full pulse-soft text-warning">
                        <Heart size={32} fill="currentColor" />
                    </div>
                    <div>
                        <p className="body-sm font-bold text-grey-900 mb-2">How would you rate SkipLine?</p>
                        <div className="flex gap-3 justify-center">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    className="btn p-1 shadow-none border-none transition-transform hover:scale-125"
                                    style={{ background: 'transparent' }}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        size={36}
                                        fill={star <= rating ? 'var(--warning)' : 'transparent'}
                                        color={star <= rating ? 'var(--warning)' : 'var(--grey-300)'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    {rating > 0 && (
                        <div className="animate-fade mt-2">
                            <p className="caption text-success font-extrabold uppercase bg-success-light px-4 py-1 rounded-full">
                                We value your feedback!
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 w-full mt-12">
                    <button
                        className="btn btn-primary w-full py-5 text-lg gap-3"
                        onClick={() => navigate('/dashboard')}
                    >
                        <Home size={24} /> Return to Dashboard
                    </button>

                    <button className="btn btn-outline w-full py-4 gap-2 glass">
                        <Share2 size={20} /> Invite Friends
                    </button>
                </div>
            </div>

            <p className="caption text-grey-400 absolute w-full px-12 italic" style={{ bottom: '40px', left: 0 }}>
                A digital copy of your receipt has been dispatched to your registered mobile number and email.
            </p>
        </div>
    );
};

export default ThankYou;
