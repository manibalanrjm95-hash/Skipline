/**
 * Generates a standard UPI intent URI for mobile deep linking.
 * Format: upi://pay?pa={UPI_ID}&pn={PAYEE_NAME}&am={AMOUNT}&cu=INR&tn={NOTE}
 */
export const getUPIIntent = ({ vpa, shopName, amount, orderId }) => {
    if (!vpa) return null;

    const formattedAmount = Number(amount).toFixed(2);
    const encodedPayeeName = encodeURIComponent(shopName);
    const encodedNote = encodeURIComponent(`SkipLine Order ${orderId}`);

    // Exact format as per user specification
    return `upi://pay?pa=${vpa}&pn=${encodedPayeeName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}`;
};

/**
 * Standard redirection function as per user SECTION 4
 */
export const redirectToUPI = (shop, order) => {
    const upiId = shop.vpa; // Mapping vpa to upiId
    const amount = Number(order.total_amount || order.amount).toFixed(2);
    const payeeName = encodeURIComponent(shop.shop_name);
    const note = encodeURIComponent(`SkipLine Order ${order.id}`);

    const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`;

    console.log('UPI Redirect URL:', upiUrl);

    // Triggering via dynamic anchor for better reliability
    const link = document.createElement('a');
    link.href = upiUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
