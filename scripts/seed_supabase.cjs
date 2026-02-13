const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jkldxqsrxrmgaukycntl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGR4cXNyeHJtZ2F1a3ljbnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTAyMTAsImV4cCI6MjA4NjU2NjIxMH0.oKyxuHWrHJry0_dyzCRE-rn2_vIKvc5RHgBf_ZE213k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SEED_DATA = {
    shops: [
        {
            shop_code: 'SL-TN-001',
            shop_name: 'SkipLine Mart - Urapakkam',
            location: 'Tamil Nadu',
            active_status: true,
        }
    ],
    products: [
        { product_code: 'SLP-001', product_name: 'Rice 1kg', category: 'Grains', price: 65, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-002', product_name: 'Milk 1L', category: 'Dairy', price: 48, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-003', product_name: 'Bread', category: 'Bakery', price: 40, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-004', product_name: 'Eggs 12', category: 'Dairy', price: 72, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-005', product_name: 'Oil 1L', category: 'Cooking', price: 130, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-006', product_name: 'Sugar 1kg', category: 'Sweetener', price: 45, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-007', product_name: 'Salt', category: 'Spices', price: 22, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-008', product_name: 'Soap', category: 'Personal Care', price: 30, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-009', product_name: 'Shampoo', category: 'Personal Care', price: 120, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-010', product_name: 'Biscuit', category: 'Snacks', price: 20, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-011', product_name: 'Dal 1kg', category: 'Grains', price: 90, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-012', product_name: 'Tea 250g', category: 'Beverages', price: 110, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-013', product_name: 'Coffee', category: 'Beverages', price: 180, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-014', product_name: 'Curd', category: 'Dairy', price: 35, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-015', product_name: 'Chips', category: 'Snacks', price: 20, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-016', product_name: 'Juice', category: 'Beverages', price: 25, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-017', product_name: 'Detergent', category: 'Household', price: 150, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-018', product_name: 'Toothpaste', category: 'Personal Care', price: 55, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-019', product_name: 'Butter', category: 'Dairy', price: 50, stock: 100, barcode_enabled: true, ai_scan_enabled: false },
        { product_code: 'SLP-020', product_name: 'Chocolate', category: 'Snacks', price: 10, stock: 100, barcode_enabled: true, ai_scan_enabled: false }
    ]
};

async function seed() {
    console.log('Seeding shops...');
    for (const shop of SEED_DATA.shops) {
        const { error } = await supabase.from('shops').upsert(shop, { onConflict: 'shop_code' });
        if (error) console.error(`Error seeding shop ${shop.shop_code}:`, error);
        else console.log(`Seeded shop: ${shop.shop_code}`);
    }

    console.log('Seeding products...');
    for (const product of SEED_DATA.products) {
        const { error } = await supabase.from('products').upsert(product, { onConflict: 'product_code' });
        if (error) console.error(`Error seeding product ${product.product_code}:`, error);
        else console.log(`Seeded product: ${product.product_code}`);
    }

    console.log('Seeding completed!');
}

seed();
