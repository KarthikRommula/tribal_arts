# Razorpay Payment Integration

This project is integrated with Razorpay for secure payment processing.

## Configuration

### Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RcaTPZd2qCwWVX
RAZORPAY_KEY_SECRET=q11C0CZgeMVXymPBIW5Yyd9O
```

**Note:** These are test credentials. For production, replace with your live Razorpay keys.

## Features

- ✅ Secure payment processing via Razorpay
- ✅ Payment verification using signature validation
- ✅ Order creation after successful payment
- ✅ User-friendly payment interface
- ✅ Support for multiple payment methods (Cards, UPI, Wallets, Net Banking)

## Payment Flow

1. **Customer enters shipping details** on the checkout page
2. **Click "Proceed to Payment"** - Creates a Razorpay order via API
3. **Razorpay checkout modal opens** - Customer completes payment
4. **Payment verification** - Server verifies payment signature
5. **Order saved to database** - Order details saved with payment ID
6. **Success page** - Customer sees order confirmation

## API Routes

### `/api/payment/create-order`
- **Method:** POST
- **Body:** `{ amount: number, currency: string }`
- **Returns:** Razorpay order ID and details

### `/api/payment/verify`
- **Method:** POST
- **Body:** `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
- **Returns:** Payment verification status

## Testing

### Test Card Details
For testing in Razorpay test mode, use:

- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

### Test UPI ID
- **UPI ID:** success@razorpay

### Test Payment Scenarios

1. **Successful Payment:** Use the test card details above
2. **Failed Payment:** Use card number `4000 0000 0000 0002`

## Security

- Payment verification is done server-side using HMAC SHA256
- Razorpay secret key is never exposed to the client
- All payment data is handled by Razorpay's PCI-compliant infrastructure

## Going Live

1. Get your live Razorpay keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete KYC verification
3. Update environment variables with live keys
4. Test thoroughly before going live
5. Enable required payment methods in Razorpay dashboard

## Support

For Razorpay-specific issues, refer to:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
