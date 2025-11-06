/**
 * Razorpay utility functions for payment processing
 */

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const formatAmountForRazorpay = (amount: number): number => {
  // Convert to paise (smallest currency unit)
  return Math.round(amount * 100);
};

export const formatAmountFromRazorpay = (amount: number): number => {
  // Convert from paise to rupees
  return amount / 100;
};
