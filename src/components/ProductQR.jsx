import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const ProductQR = ({ productCode, size = 160, label = '' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current && productCode) {
            QRCode.toCanvas(canvasRef.current, productCode, {
                width: size,
                margin: 2,
                color: {
                    dark: '#0A0A0B',
                    light: '#FFFFFF',
                },
                errorCorrectionLevel: 'H',
            });
        }
    }, [productCode, size]);

    return (
        <div className="flex flex-col items-center gap-2">
            <canvas ref={canvasRef} style={{ borderRadius: '12px' }} />
            {label && <p className="caption text-grey-700 font-bold">{label}</p>}
        </div>
    );
};

export default ProductQR;
