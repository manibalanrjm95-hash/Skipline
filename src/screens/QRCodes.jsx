import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Download, Package, Printer, Zap, LayoutDashboard, BarChart3, QrCode, LogOut, Menu } from 'lucide-react';
import ProductQR from '../components/ProductQR';
import AdminSidebar from '../components/AdminSidebar';



const QRCodes = () => {
    const { products } = useStore();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const categories = ['All', ...new Set(products.map(p => p.category))];
    const filtered = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex bg-grey-50 min-h-screen">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="ml-64 flex-1 p-10 animate-fade admin-content">
                {/* Header */}
                <div className="flex items-center justify-between mb-10 flex-col-mobile items-start gap-4">
                    <div className="flex items-center gap-4 w-full">
                        <button
                            className="show-on-mobile p-2 bg-white rounded-xl shadow-sm border border-grey-100 text-grey-600"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <button
                            className="bg-white p-3 rounded-xl shadow-sm border border-grey-100 text-grey-500 hover:text-grey-900 hover:border-primary/50 transition-all"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-black text-grey-900 tracking-tight">Product QR Codes</h2>
                            <p className="text-grey-500 font-medium mt-1">{filtered.length} products available for printing</p>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary gap-2 py-3 px-6 shadow-lg shadow-primary/20"
                        onClick={handlePrint}
                    >
                        <Printer size={20} /> Print All
                    </button>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedCategory === cat ? 'bg-grey-900 text-white shadow-lg' : 'bg-white text-grey-500 hover:bg-grey-100 border border-transparent shadow-sm'}`}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* QR Code Grid */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6" id="qr-print-area">
                    {filtered.map(product => (
                        <div key={product.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-grey-100 flex flex-col items-center gap-4 hover:border-primary/30 transition-all group">
                            <div className="bg-white p-2 rounded-xl shadow-inner border border-grey-100">
                                <ProductQR productCode={product.product_code} size={140} />
                            </div>

                            <div className="text-center w-full">
                                <p className="font-extrabold text-grey-900 truncate w-full">{product.product_name}</p>
                                <p className="text-xs font-bold text-primary tracking-widest uppercase mt-1 bg-primary/5 py-1 px-2 rounded-lg inline-block">{product.product_code}</p>
                                <p className="text-sm font-bold text-grey-400 mt-2">₹{product.price}</p>
                            </div>

                            <div className="flex gap-2 w-full mt-2">
                                <a
                                    href={`/qrcodes/${product.product_code}.png`}
                                    download={`${product.product_code}.png`}
                                    className="flex-1 btn bg-grey-50 text-grey-500 hover:bg-primary hover:text-white border-0 py-2 rounded-xl transition-colors flex justify-center"
                                    title="Download PNG"
                                >
                                    <Download size={18} />
                                </a>
                                <span className={`flex-[2] flex items-center justify-center text-[10px] font-extrabold uppercase tracking-widest rounded-xl ${product.barcode_enabled ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                    {product.barcode_enabled ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Print instructions */}
                <div className="mt-12 p-6 bg-blue-50/50 rounded-[24px] border border-blue-100 text-center flex flex-col items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-500 mb-1">
                        <Printer size={24} />
                    </div>
                    <h4 className="font-extrabold text-blue-900">Printing Instructions</h4>
                    <p className="text-sm font-medium text-blue-600/80 max-w-lg">
                        Clicking the "Print All" button will open your browser's print dialog.
                        Ensure "Background graphics" is enabled in your print settings for best results.
                        Cut out the QR codes and place them on your product shelves.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRCodes;
