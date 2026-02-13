import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Download, Package, Printer } from 'lucide-react';
import ProductQR from '../components/ProductQR';

const QRCodes = () => {
    const { products } = useStore();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(products.map(p => p.category))];
    const filtered = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="app-container mesh-bg">
            <div className="screen-padding animate-fade">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button className="btn p-3 bg-white rounded-md shadow-sm" onClick={() => navigate(-1)}>
                            <ArrowLeft size={24} className="text-grey-900" />
                        </button>
                        <div>
                            <h2 className="font-bold">Product QR Codes</h2>
                            <p className="body-sm text-grey-500">{filtered.length} products</p>
                        </div>
                    </div>
                    <button className="btn bg-primary text-white p-3 rounded-lg shadow-sm" onClick={handlePrint}>
                        <Printer size={20} />
                    </button>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`btn py-2 px-4 rounded-full font-bold body-sm ${selectedCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-white text-grey-700 border'}`}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* QR Code Grid */}
                <div className="flex flex-wrap gap-4 justify-center" id="qr-print-area">
                    {filtered.map(product => (
                        <div className="flex flex-col items-center gap-3 p-5" style={{ width: '200px' }}>
                            <ProductQR productCode={product.product_code} size={140} />
                            <div className="text-center">
                                <p className="body-sm font-bold text-grey-900">{product.product_name}</p>
                                <p className="caption text-primary font-bold mt-1">{product.product_code}</p>
                                <p className="caption text-grey-500 mt-1">₹{product.price}</p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <a
                                    href={`/qrcodes/${product.product_code}.png`}
                                    download={`${product.product_code}.png`}
                                    className="btn bg-grey-100 p-2 text-grey-700 shadow-none rounded-md hover:bg-primary hover:text-white"
                                    title="Download PNG"
                                >
                                    <Download size={16} />
                                </a>
                                <span className={`tag ${product.barcode_enabled ? 'tag-success' : 'tag-error'} flex-1 text-center`}>
                                    {product.barcode_enabled ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Print instructions */}
                <div className="mt-8 p-4 bg-blue-light rounded-lg text-center">
                    <p className="body-sm text-secondary font-bold">💡 Print these QR codes and place them on product shelves for customers to scan</p>
                </div>
            </div>
        </div>
    );
};

export default QRCodes;
