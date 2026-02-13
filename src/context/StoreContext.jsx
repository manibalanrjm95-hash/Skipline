import React, { createContext, useContext, useState, useEffect } from 'react';
import { SEED_DATA } from '../db';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [shops, setShops] = useState(SEED_DATA.shops);
    const [products, setProducts] = useState(SEED_DATA.products);
    const [user, setUser] = useState(null); // { id, session_id, shop_id, cart_status }
    const [cart, setCart] = useState([]); // Array of { product_id, quantity, subtotal }
    const [orders, setOrders] = useState([]);
    const [currentShop, setCurrentShop] = useState(null);

    // Persistence (Simplified for MVP)
    useEffect(() => {
        const savedUser = localStorage.getItem('skipline_user');
        const savedCart = localStorage.getItem('skipline_cart');
        const savedShop = localStorage.getItem('skipline_shop');

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedShop) setCurrentShop(JSON.parse(savedShop));
    }, []);

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

    const loginShop = (shopCode) => {
        const shop = shops.find(s => s.shop_code === shopCode && s.active_status);
        if (shop) {
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
        }
        return { success: false, error: 'Invalid or inactive shop code' };
    };

    const logout = () => {
        setUser(null);
        setCart([]);
        setCurrentShop(null);
        localStorage.clear();
    };

    const addToCart = (productCode) => {
        if (!productCode) return { success: false, error: 'Please enter a product code' };

        const cleanCode = productCode.trim().toUpperCase();
        const product = products.find(p => p.product_code.toUpperCase() === cleanCode);

        if (!product) return { success: false, error: 'Product not found' };
        if (!product.barcode_enabled) return { success: false, error: 'Product is currently disabled' };
        if (product.stock <= 0) return { success: false, error: 'Out of stock' };

        const existingItemIndex = cart.findIndex(item => item.product_id === product.id);
        if (existingItemIndex > -1) {
            const newCart = [...cart];
            newCart[existingItemIndex].quantity += 1;
            newCart[existingItemIndex].subtotal = newCart[existingItemIndex].quantity * product.price;
            setCart(newCart);
        } else {
            setCart([...cart, {
                product_id: product.id,
                product_name: product.product_name,
                price: product.price,
                quantity: 1,
                subtotal: product.price
            }]);
        }
        return { success: true };
    };

    const updateQuantity = (productId, delta) => {
        const newCart = cart.map(item => {
            if (item.product_id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty, subtotal: newQty * item.price };
            }
            return item;
        }).filter(item => item.quantity > 0);
        setCart(newCart);
    };

    const checkout = () => {
        if (cart.length === 0) return { success: false, error: 'Cart is empty' };

        const totalAmount = cart.reduce((acc, item) => acc + item.subtotal, 0);
        const newOrder = {
            id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            user_id: user.id,
            items: [...cart],
            total_amount: totalAmount,
            payment_status: 'paid',
            verification_status: 'pending',
            exit_status: 'pending',
            created_at: new Date().toISOString()
        };

        // Reduce stock
        const newProducts = products.map(p => {
            const cartItem = cart.find(item => item.product_id === p.id);
            if (cartItem) {
                return { ...p, stock: p.stock - cartItem.quantity };
            }
            return p;
        });

        setProducts(newProducts);
        setOrders([...orders, newOrder]);
        setUser({ ...user, cart_status: 'checkout' });
        setCart([]);
        return { success: true, orderId: newOrder.id };
    };

    const toggleProductStatus = (productId) => {
        setProducts(prev => prev.map(p =>
            p.id === productId ? { ...p, barcode_enabled: !p.barcode_enabled } : p
        ));
    };

    const verifyOrder = (orderId) => {
        setOrders(orders.map(o => {
            if (o.id === orderId) {
                return { ...o, verification_status: 'verified', exit_status: 'completed' };
            }
            return o;
        }));
    };

    const cartTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <StoreContext.Provider value={{
            shops, products, user, cart, orders, currentShop,
            loginShop, logout, addToCart, updateQuantity, checkout, verifyOrder,
            cartTotal, cartCount, setProducts, toggleProductStatus
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
