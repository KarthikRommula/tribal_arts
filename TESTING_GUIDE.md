# Razorpay Testing Guide

## 🧪 How to Test the Integration

### Step 1: Start Development Server
```bash
pnpm dev
```

### Step 2: Navigate to Your Application
Open your browser and go to:
```
http://localhost:3000
```

### Step 3: Add Items to Cart
1. Browse products at `/products`
2. Add items to your cart
3. Click on cart icon or go to `/cart`

### Step 4: Proceed to Checkout
1. Click "Checkout" button
2. You'll be redirected to sign in if not logged in
3. After signing in, you'll see the checkout page

### Step 5: Fill Shipping Information
Fill in the form with:
- First Name
- Last Name
- Email
- Phone
- Address
- City, State, ZIP Code

### Step 6: Initiate Payment
1. Click "Proceed to Payment" button
2. Razorpay checkout modal will open

### Step 7: Test Payment

#### Option 1: Test Card Payment
Use these test card details:

```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25 (any future date)
Name: Test User
```

#### Option 2: Test UPI Payment
```
UPI ID: success@razorpay
```

#### Option 3: Test Net Banking
- Select any bank
- Will automatically succeed in test mode

### Step 8: Verify Success
After successful payment:
1. You'll see order confirmation page
2. Order ID will be displayed
3. Cart will be cleared
4. Order saved in database

## 🔍 What to Check

### Frontend Checks
- ✅ Razorpay modal opens correctly
- ✅ Payment methods are displayed
- ✅ Test credentials work
- ✅ Success page shows after payment
- ✅ Order ID is generated

### Backend Checks
Check browser console for:
- ✅ No JavaScript errors
- ✅ Payment verification success message
- ✅ Order creation confirmation

Check Network tab for:
- ✅ `/api/payment/create-order` returns 200
- ✅ `/api/payment/verify` returns 200
- ✅ `/api/orders` POST returns 200

### Database Checks
Verify in MongoDB:
- ✅ Order document created in `orders` collection
- ✅ Contains `paymentId` field
- ✅ Contains `razorpayOrderId` field
- ✅ Status is "confirmed"

## 🚨 Test Failure Scenarios

### Test Failed Payment
Use this card to simulate failure:
```
Card Number: 4000 0000 0000 0002
```
Expected: Error message shown, order not created

### Test Payment Cancellation
1. Open Razorpay modal
2. Click "X" or "Cancel"
Expected: Modal closes, user stays on checkout page

## 📊 Test Checklist

- [ ] Server starts without errors
- [ ] Checkout page loads correctly
- [ ] "Proceed to Payment" button works
- [ ] Razorpay modal opens
- [ ] Test card payment succeeds
- [ ] Test UPI payment succeeds
- [ ] Payment verification works
- [ ] Order is created in database
- [ ] Success page displays
- [ ] Order ID is shown
- [ ] Cart is cleared after purchase
- [ ] Can return to home/continue shopping

## 🐛 Troubleshooting

### Modal doesn't open
- Check browser console for errors
- Verify Razorpay script is loaded
- Check `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set

### Payment verification fails
- Check `RAZORPAY_KEY_SECRET` in `.env.local`
- Verify signature calculation in verify route
- Check network response in DevTools

### Order not created
- Check MongoDB connection
- Verify `/api/orders` endpoint works
- Check console for error messages

## 📝 Sample Test Data

```javascript
// Shipping Information
{
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  address: "123 Test Street",
  city: "Mumbai",
  state: "Maharashtra",
  zipCode: "400001"
}

// Test Card
{
  cardNumber: "4111111111111111",
  cvv: "123",
  expiry: "12/25",
  name: "John Doe"
}

// Test UPI
{
  upiId: "success@razorpay"
}
```

## ✅ Success Indicators

1. **Payment Success**: Razorpay shows "Payment Successful"
2. **Verification Success**: Console shows verification message
3. **Order Created**: Redirects to success page
4. **Order ID**: Unique order ID displayed
5. **Cart Cleared**: Cart count shows 0
6. **Database Updated**: Order visible in MongoDB

---

**Happy Testing! 🎉**

If everything works, you're ready to go live with real Razorpay credentials!
