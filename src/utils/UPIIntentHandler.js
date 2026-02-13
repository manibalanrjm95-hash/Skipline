/**
 * Generates a standard UPI intent URI for mobile deep linking.
 * Format: upi://pay?pa={vpa}&pn={name}&am={amount}&tn={note}&cu=INR
 */
export const getUPIIntent = ({ vpa, name, amount, orderId }) => {
    if (!vpa) return null;

    const params = new URLSearchParams({
        pa: vpa,
        pn: name,
        am: Number(amount).toFixed(2),
        tn: `Order ${orderId}`,
        cu: 'INR'
    });

    return `upi://pay?${params.toString()}`;
};

export const launchUPIIntent = (intentUrl) => {
    if (!intentUrl) return;
    window.location.href = intentUrl;
};
