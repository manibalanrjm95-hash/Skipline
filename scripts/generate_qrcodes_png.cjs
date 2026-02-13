const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const products = [
    { product_code: 'SLP-001', product_name: 'Rice 1kg' },
    { product_code: 'SLP-002', product_name: 'Milk 1L' },
    { product_code: 'SLP-003', product_name: 'Bread' },
    { product_code: 'SLP-004', product_name: 'Eggs 12' },
    { product_code: 'SLP-005', product_name: 'Oil 1L' },
    { product_code: 'SLP-006', product_name: 'Sugar 1kg' },
    { product_code: 'SLP-007', product_name: 'Salt' },
    { product_code: 'SLP-008', product_name: 'Soap' },
    { product_code: 'SLP-009', product_name: 'Shampoo' },
    { product_code: 'SLP-010', product_name: 'Biscuit' },
    { product_code: 'SLP-011', product_name: 'Dal 1kg' },
    { product_code: 'SLP-012', product_name: 'Tea 250g' },
    { product_code: 'SLP-013', product_name: 'Coffee' },
    { product_code: 'SLP-014', product_name: 'Curd' },
    { product_code: 'SLP-015', product_name: 'Chips' },
    { product_code: 'SLP-016', product_name: 'Juice' },
    { product_code: 'SLP-017', product_name: 'Detergent' },
    { product_code: 'SLP-018', product_name: 'Toothpaste' },
    { product_code: 'SLP-019', product_name: 'Butter' },
    { product_code: 'SLP-020', product_name: 'Chocolate' }
];

const outputDir = path.join(__dirname, 'public', 'qrcodes');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateQRCodes() {
    console.log('Generating QR codes...');
    for (const product of products) {
        const filePath = path.join(outputDir, `${product.product_code}.png`);
        await QRCode.toFile(filePath, product.product_code, {
            width: 500,
            margin: 4,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        console.log(`Generated: ${product.product_code}.png (${product.product_name})`);
    }
    console.log('All QR codes generated successfully in public/qrcodes/');
}

generateQRCodes().catch(err => {
    console.error('Error generating QR codes:', err);
    process.exit(1);
});
