import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [shops, setShops] = useState([]);
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null); // { id, session_id, shop_id, cart_status }
    const [cart, setCart] = useState([]); // Array of { product_id, quantity, subtotal }
    const [orders, setOrders] = useState([]);
    const [currentShop, setCurrentShop] = useState(null);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [loading, setLoading] = useState(true);

    // V1 Status Constants
    const STATUS = {
        CART_ACTIVE: 'cart_active',
        PENDING_PAYMENT: 'pending_payment',
        AWAITING_VERIFICATION: 'awaiting_verification',
        VERIFIED: 'verified',
        EXITED: 'exited',
        CANCELLED: 'cancelled'
    };

    // Initial load and Session Restoration
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                // Fetch basic data - Fetching only in-stock products as per SECTION 3
                const [{ data: shopsData }, { data: productsData }] = await Promise.all([
                    supabase.from('shops').select('*'),
                    supabase.from('products').select('*').gt('stock', 0)
                ]);

                if (shopsData) setShops(shopsData);
                if (productsData) setProducts(productsData);

                // Restore session from localStorage
                const savedUser = localStorage.getItem('skipline_user');
                const savedCart = localStorage.getItem('skipline_cart');
                const savedShop = localStorage.getItem('skipline_shop');

                if (savedCart && productsData) {
                    try {
                        const parsedCart = JSON.parse(savedCart);
                        const validCart = parsedCart.filter(item =>
                            productsData.some(p => p.id === item.product_id)
                        );
                        setCart(validCart);
                    } catch (e) {
                        setCart([]);
                    }
                }

                if (savedUser) setUser(JSON.parse(savedUser));
                if (savedShop) setCurrentShop(JSON.parse(savedShop));

                const savedOrderId = localStorage.getItem('skipline_order_id');
                if (savedOrderId) setCurrentOrderId(savedOrderId);
            } catch (error) {
                console.error('Initialization error:', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Sync state to localStorage
    useEffect(() => {
        if (user) localStorage.setItem('skipline_user', JSON.stringify(user));
        else localStorage.removeItem('skipline_user');
    }, [user]);

    useEffect(() => {
        localStorage.setItem('skipline_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (currentShop) localStorage.setItem('skipline_shop', JSON.stringify(currentShop));
        else localStorage.removeItem('skipline_shop');
    }, [currentShop]);

    useEffect(() => {
        if (currentOrderId) localStorage.setItem('skipline_order_id', currentOrderId);
        else localStorage.removeItem('skipline_order_id');
    }, [currentOrderId]);

    const loginShop = async (shopCode) => {
        try {
            // SECTION 2: Fetch shop by shop code
            const { data: shop, error } = await supabase
                .from('shops')
                .select('*')
                .eq('shop_code', shopCode)
                .single();

            if (error || !shop) {
                return { success: false, error: 'Invalid Shop' };
            }

            if (shop.active_status === false) {
                return { success: false, error: 'Shop inactive' };
            }

            const newUser = {
                id: `user-${Date.now()}`,
                session_id: `sess-${Math.random().toString(36).substr(2, 9)}`,
                shop_id: shop.id,
                cart_status: 'active',
                created_at: new Date().toISOString()
            };

            setUser(newUser);
            setCurrentShop(shop);
            setCart([]);
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Connection failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setCart([]);
        setCurrentShop(null);
        setCurrentOrderId(null);
        localStorage.clear();
    };

    const addToCart = (productCode) => {
        if (!productCode) return { success: false, error: 'Please enter a product code' };

        const cleanCode = productCode.trim().toUpperCase();
        const product = products.find(p => p.product_code.toUpperCase() === cleanCode);

        if (!product) return { success: false, error: 'Product not found' };
        if (product.stock <= 0) return { success: false, error: 'Out of stock' };

        const existingItemIndex = cart.findIndex(item => item.product_id === product.id);
        if (existingItemIndex > -1) {
            const newCart = [...cart];
            newCart[existingItemIndex].quantity += 1;
            setCart(newCart);
        } else {
            setCart([...cart, {
                product_id: product.id,
                product_name: product.product_name,
                price: Number(product.price),
                quantity: 1
            }]);
        }
        return { success: true };
    };

    const updateQuantity = (productId, delta) => {
        const newCart = cart.map(item => {
            if (item.product_id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0);
        setCart(newCart);
    };

    const checkout = async (customerName = 'Guest') => {
        if (cart.length === 0) return { success: false, error: 'Cart is empty' };

        // SECTION 4: Final total calculation
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        try {
            // SECTION 5: Create REAL order
            const { data: order, error } = await supabase
                .from('orders')
                .insert([
                    {
                        shop_id: currentShop.id,
                        customer_name: customerName,
                        total_amount: totalAmount,
                        items: cart,
                        status: STATUS.PENDING_PAYMENT // 'pending_payment'
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            setCart([]);
            setCurrentOrderId(order.id);
            setUser({ ...user, cart_status: 'checkout' });

            return { success: true, orderId: order.id, order };
        } catch (err) {
            console.error('Checkout failed:', err);
            return { success: false, error: err.message };
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data: order, error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;

            // SECTION 8: Mark Verified logic
            if (newStatus === STATUS.VERIFIED) {
                // Real stock deduction
                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                for (const item of items) {
                    const product = products.find(p => p.id === item.product_id);
                    if (product) {
                        await supabase
                            .from('products')
                            .update({ stock: Math.max(0, product.stock - item.quantity) })
                            .eq('id', product.id);
                    }
                }
                const { data: freshProducts } = await supabase.from('products').select('*').gt('stock', 0);
                if (freshProducts) setProducts(freshProducts);
            }

            return { success: true };
        } catch (err) {
            console.error('Update status failed:', err);
            return { success: false, error: err.message };
        }
    };

    const updateProduct = async (productId, updates) => {
        try {
            const { error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', productId);

            if (error) throw error;

            setProducts(products.map(p => p.id === productId ? { ...p, ...updates } : p));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const toggleProductStatus = async (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const newStatus = !product.barcode_enabled;
        const { error } = await supabase
            .from('products')
            .update({ barcode_enabled: newStatus })
            .eq('id', productId);

        if (!error) {
            setProducts(products.map(p =>
                p.id === productId ? { ...p, barcode_enabled: newStatus } : p
            ));
        }
    };

    const verifyOrder = async (orderId) => {
        return await updateOrderStatus(orderId, STATUS.VERIFIED);
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity), 0);

    return (
        <StoreContext.Provider value={{
            shops, products, user, cart, orders, currentShop, currentOrderId, loading, STATUS,
            loginShop, logout, addToCart, updateQuantity, checkout, verifyOrder, updateOrderStatus,
            cartTotal, cartCount, setProducts, toggleProductStatus, updateProduct
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
