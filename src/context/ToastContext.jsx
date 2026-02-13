import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const Toast = ({ id, message, type, onClose }) => {
    const icons = {
        success: <CheckCircle size={20} className="text-success" />,
        error: <AlertCircle size={20} className="text-error" />,
        info: <Info size={20} className="text-primary" />,
    };

    const bgColors = {
        success: 'bg-success/5 border-success/10',
        error: 'bg-error/5 border-error/10',
        info: 'bg-primary/5 border-primary/10',
    };

    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md animate-in slide-in-from-right-full fade-in duration-300 w-full max-w-sm bg-white ${bgColors[type]}`}>
            <div className="shrink-0">{icons[type]}</div>
            <p className="flex-1 text-sm font-bold text-grey-900">{message}</p>
            <button onClick={() => onClose(id)} className="text-grey-400 hover:text-grey-900 transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-2">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onClose={removeToast} />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};
