/**
 * Generates a specific UPI intent URI for mobile deep linking.
 * Supports targeted apps for higher reliability.
 */
export const getUPIIntent = ({ vpa, name, amount, orderId, appId }) => {
    if (!vpa) return null;

    const params = new URLSearchParams({
        pa: vpa,
        pn: name,
        am: Number(amount).toFixed(2),
        tn: `Order ${orderId}`,
        cu: 'INR'
    });

    const queryString = params.toString();

    // App-specific schemes for better reliability
    switch (appId) {
        case 'gpay':
            return `tez://upi/pay?${queryString}`;
        case 'phonepe':
            return `phonepe://pay?${queryString}`;
        case 'paytm':
            return `paytmmp://pay?${queryString}`;
        default:
            return `upi://pay?${queryString}`;
    }
};

export const launchUPIIntent = (intentUrl) => {
    if (!intentUrl) return;

    // Create a temporary anchor to trigger the link, 
    // which is more reliable in some mobile browsers than window.location
    const link = document.createElement('a');
    link.href = intentUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
