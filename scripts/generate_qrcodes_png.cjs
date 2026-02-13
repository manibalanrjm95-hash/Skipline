const { createClient } = require('@supabase/supabase-js');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://jkldxqsrxrmgaukycntl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGR4cXNyeHJtZ2F1a3ljbnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTAyMTAsImV4cCI6MjA4NjU2NjIxMH0.oKyxuHWrHJry0_dyzCRE-rn2_vIKvc5RHgBf_ZE213k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const outputDir = path.join(__dirname, '..', 'public', 'qrcodes');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateQRCodes() {
    console.log('Fetching products from Supabase...');
    const { data: products, error } = await supabase.from('products').select('*');

    if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
    }

    console.log(`Generating QR codes for ${products.length} products...`);
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
    console.log(`All QR codes generated successfully in ${outputDir}`);
}

generateQRCodes().catch(err => {
    console.error('Error generating QR codes:', err);
    process.exit(1);
});
