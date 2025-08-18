# Payment API Endpoints

All payment endpoints are consolidated in `PaymentController.java` at base path `/api/payments`

## Endpoints

### 1. Create Payment Order (for checkout flow)
- **POST** `/api/payments/create`
- **Body**: `PaymentCreateRequest`
  ```json
  {
    "amount": 1000,      // Amount in rupees
    "currency": "INR",
    "receipt": "RECEIPT_123"
  }
  ```
- **Response**: Map with order details including Razorpay order ID

### 2. Create Payment Order (simple version)
- **POST** `/api/payments/create-order`
- **Body**: `PaymentRequestDto`
  ```json
  {
    "amount": 100000,    // Amount in paise
    "receipt": "receipt_123"
  }
  ```
- **Response**: Razorpay order ID string

### 3. Verify Payment
- **POST** `/api/payments/verify`
- **Body**: `PaymentVerifyRequest`
  ```json
  {
    "razorpayPaymentId": "pay_xxx",
    "razorpayOrderId": "order_xxx",
    "razorpaySignature": "signature_xxx"
  }
  ```
- **Response**: `PaymentVerifyResponse`

### 4. Get Payment Details
- **GET** `/api/payments/{orderId}`
- **Response**: `PaymentDetailDto`

### 5. Get Razorpay Key
- **GET** `/api/payments/key`
- **Response**: Razorpay API key (string)

### 6. Test Connection
- **GET** `/api/payments/test-connection`
- **Response**: Connection test result with test order

### 7. Webhook Handler
- **POST** `/api/payments/webhook`
- **Body**: Raw webhook payload (string)
- **Response**: "Webhook received"

## Frontend Usage

- Main payment component: `RazorpayPayment.tsx` uses `/create` endpoint
- Simple payment component: `SimpleRazorpayPayment.tsx` uses `/create-order` endpoint
- Both use `/verify` for payment verification
- Both fetch key from `/key` endpoint