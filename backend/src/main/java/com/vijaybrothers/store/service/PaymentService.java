package com.vijaybrothers.store.service;

import com.vijaybrothers.store.dto.*;
import com.vijaybrothers.store.model.Payment;
import com.vijaybrothers.store.model.PaymentStatus;
import com.vijaybrothers.store.model.Order;
import com.vijaybrothers.store.model.OrderStatus;
import com.vijaybrothers.store.repository.PaymentRepository;
import com.vijaybrothers.store.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.springframework.http.HttpStatus;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final EmailService emailService;
    
    private final String secret;
    private final String webhookSecret;
    private final String merchantId;
    private final String upiId;
    private final String upiPhone;
    private final boolean upiEnabled;

    public PaymentService(
            @Value("${razorpay.key_id}") String keyId,
            @Value("${razorpay.key_secret}") String secret,
            @Value("${razorpay.webhook.secret}") String webhookSecret,
            @Value("${razorpay.merchant_id}") String merchantId,
            @Value("${razorpay.upi.id:}") String upiId,
            @Value("${razorpay.upi.phone:}") String upiPhone,
            @Value("${razorpay.upi.enabled:false}") boolean upiEnabled,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            EmailService emailService
    ) throws RazorpayException {
        this.razorpayClient = new RazorpayClient(keyId, secret);
        this.secret = secret;
        this.webhookSecret = webhookSecret;
        this.merchantId = merchantId;
        this.upiId = upiId;
        this.upiPhone = upiPhone;
        this.upiEnabled = upiEnabled;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }
    public PlaceOrderResponse createOrder(Order order) throws RazorpayException {
        JSONObject opts = new JSONObject()
            .put("amount", order.getTotalAmount().longValue() * 100) // Amount in paise
            .put("currency", "INR") // Assuming INR as currency
            .put("receipt", order.getOrderNumber());
            
        // Add UPI preferences if enabled
        if (upiEnabled && upiId != null && !upiId.isEmpty()) {
            JSONObject method = new JSONObject();
            method.put("upi", true);
            opts.put("method", method);
            
            // Add UPI preferences
            JSONObject upiPrefs = new JSONObject();
            upiPrefs.put("vpa", upiId);
            opts.put("upi", upiPrefs);
        }
        
        com.razorpay.Order razorpayOrder = razorpayClient.orders.create(opts);
        String razorpayOrderId = razorpayOrder.get("id");

        return new PlaceOrderResponse(
            Long.valueOf(razorpayOrderId.hashCode()), // Dummy orderId, replace with actual if available
            razorpayOrder.get("currency"),
            ((Number) razorpayOrder.get("amount")).doubleValue(),
            razorpayOrder.get("status"),
            razorpayOrderId // Using razorpayOrderId as transactionId for now
        );
    }
    
    // Method to get UPI configuration for frontend
    public JSONObject getPaymentConfig() {
        JSONObject config = new JSONObject();
        config.put("upiEnabled", upiEnabled);
        if (upiEnabled && upiId != null && !upiId.isEmpty()) {
            config.put("upiId", upiId);
        }
        if (upiEnabled && upiPhone != null && !upiPhone.isEmpty()) {
            config.put("upiPhone", upiPhone);
        }
        return config;
    }

    public PaymentDetailDto fetchDetails(Long orderId) {
        Payment p = paymentRepository.findByOrder_OrderId(orderId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No payment found for order: " + orderId));
        return new PaymentDetailDto(
            p.getPaymentId(),
            p.getOrder() != null ? p.getOrder().getOrderId() : null,
            p.getStatus().name(),
            p.getAmount(),
            p.getPaidAt()
        );
    }

    public PaymentVerifyResponse verifyAndSave(PaymentVerifyRequest req) {
        JSONObject sig = new JSONObject()
            .put("razorpay_order_id", req.getRazorpayOrderId())
            .put("razorpay_payment_id", req.getRazorpayPaymentId())
            .put("razorpay_signature", req.getRazorpaySignature());
        try {
            Utils.verifyPaymentSignature(sig, secret);
        } catch (RazorpayException e) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid signature");
        }

        try {
            com.razorpay.Payment rzPay = razorpayClient.payments.fetch(req.getRazorpayPaymentId());
            Long amount = rzPay.get("amount");
            String method = rzPay.get("method");
            String status = rzPay.get("status");
            Long ts = rzPay.get("created_at");

            Payment p = new Payment();
            Order order = orderRepository.findByOrderNumberWithItems(req.getRazorpayOrderId())
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Order not found"));
            p.setOrder(order);
            p.setGateway("razorpay");
            p.setMethod(method);
            
            PaymentStatus paymentStatus = "captured".equalsIgnoreCase(status) ? PaymentStatus.PAID : PaymentStatus.FAILED;
            p.setStatus(paymentStatus);
            p.setTransactionId(req.getRazorpayPaymentId());
            p.setAmount(amount);
            p.setPaidAt(OffsetDateTime.ofInstant(Instant.ofEpochSecond(ts), ZoneOffset.UTC));
            paymentRepository.save(p);

            // Update order status based on payment status
            if (paymentStatus == PaymentStatus.PAID) {
                order.setOrderStatus(OrderStatus.CONFIRMED);
                orderRepository.save(order);
                
                // Send order confirmation email
                try {
                    emailService.sendOrderConfirmationEmail(order, p);
                } catch (Exception emailEx) {
                    // Don't fail the payment verification if email fails
                }
            }

            return new PaymentVerifyResponse("Payment verified successfully", req.getRazorpayPaymentId());
        } catch (RazorpayException ex) {
            throw new ResponseStatusException(BAD_REQUEST, "Failed to fetch payment details");
        }
    }

    public PlaceOrderResponse createPaymentSession(Long orderId, BigDecimal amount) {
        return new PlaceOrderResponse(orderId, "INR", amount.doubleValue(), "created", null);
    }

    public String createPaymentOrder(PaymentRequestDto req) {
        try {
            
            JSONObject opts = new JSONObject()
                .put("amount", req.getAmount().longValue())
                .put("currency", "INR")
                .put("receipt", req.getReceipt())
                .put("payment_capture", 1); // Auto-capture payment for live mode
            
            
            com.razorpay.Order order = razorpayClient.orders.create(opts);
            String orderId = order.get("id");
            
            
            return orderId;
        } catch (RazorpayException e) {
            
            // Handle specific merchant configuration errors
            String errorMsg = e.getMessage().toLowerCase();
            if (errorMsg.contains("merchant") || errorMsg.contains("account") || errorMsg.contains("activated")) {
                throw new ResponseStatusException(BAD_REQUEST, "Merchant account issue: Your Razorpay live account may not be fully activated. Please check: 1) KYC completion 2) Payment methods activation 3) Bank account verification");
            } else if (errorMsg.contains("invalid key") || errorMsg.contains("authentication") || errorMsg.contains("unauthorized")) {
                throw new ResponseStatusException(BAD_REQUEST, "Authentication failed: Please verify your live Razorpay API keys are correct and active");
            } else if (errorMsg.contains("amount") || errorMsg.contains("currency")) {
                throw new ResponseStatusException(BAD_REQUEST, "Invalid payment details: " + e.getMessage());
            } else {
                throw new ResponseStatusException(BAD_REQUEST, "Razorpay integration error: " + e.getMessage());
            }
        }
    }

    public String verifyAndSavePayment(PaymentVerificationDto req) {
        JSONObject sig = new JSONObject()
            .put("razorpay_order_id", req.getRazorpayOrderId())
            .put("razorpay_payment_id", req.getRazorpayPaymentId())
            .put("razorpay_signature", req.getRazorpaySignature());
        try {
            Utils.verifyPaymentSignature(sig, secret);
        } catch (RazorpayException e) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid signature");
        }

        try {
            com.razorpay.Payment rzPay = razorpayClient.payments.fetch(req.getRazorpayPaymentId());
            Long amount = rzPay.get("amount");
            String method = rzPay.get("method");
            String status = rzPay.get("status");
            Long ts = rzPay.get("created_at");

            Payment p = new Payment();
            Order order = orderRepository.findByOrderNumberWithItems(req.getRazorpayOrderId())
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Order not found"));
            p.setOrder(order);
            p.setGateway("razorpay");
            p.setMethod(method);
            
            PaymentStatus paymentStatus = "captured".equalsIgnoreCase(status) ? PaymentStatus.PAID : PaymentStatus.FAILED;
            p.setStatus(paymentStatus);
            p.setTransactionId(req.getRazorpayPaymentId());
            p.setAmount(amount);
            p.setPaidAt(OffsetDateTime.ofInstant(Instant.ofEpochSecond(ts), ZoneOffset.UTC));
            paymentRepository.save(p);

            // Update order status based on payment status
            if (paymentStatus == PaymentStatus.PAID) {
                order.setOrderStatus(OrderStatus.CONFIRMED);
                orderRepository.save(order);
                
                // Send order confirmation email
                try {
                    emailService.sendOrderConfirmationEmail(order, p);
                } catch (Exception emailEx) {
                    // Don't fail the payment verification if email fails
                }
            }

            return req.getRazorpayPaymentId();
        } catch (RazorpayException ex) {
            throw new ResponseStatusException(BAD_REQUEST, "Failed to fetch payment details");
        }
    }

    public void handleWebhook(String payload, String signature) {  // ADD signature parameter
    try {
        // 1. Verify webhook signature
        boolean isValidSignature = Utils.verifyWebhookSignature(payload, signature, webhookSecret);
        
        if (!isValidSignature) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid webhook signature");
        }
        
        // 2. Parse the webhook payload
        JSONObject webhookData = new JSONObject(payload);
        String event = webhookData.getString("event");
        JSONObject eventPayload = webhookData.getJSONObject("payload");
        JSONObject paymentEntity = eventPayload.getJSONObject("payment").getJSONObject("entity");
        
        
        // 3. Handle different webhook events
        switch(event) {
            case "payment.captured":
                handlePaymentCaptured(paymentEntity);
                break;
            case "payment.failed":
                handlePaymentFailed(paymentEntity);
                break;
            case "payment.authorized":
                handlePaymentAuthorized(paymentEntity);
                break;
            case "order.paid":
                handleOrderPaid(eventPayload.getJSONObject("order").getJSONObject("entity"));
                break;
            default:
                // Unhandled webhook event
        }
        
    } catch (RazorpayException e) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid webhook signature");
    } catch (Exception e) {
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Webhook processing failed");
    }
}

// Add helper methods for handling specific events
private void handlePaymentCaptured(JSONObject paymentEntity) {
    String paymentId = paymentEntity.getString("id");
    String orderId = paymentEntity.getString("order_id");
    Long amount = paymentEntity.getLong("amount");
    String status = paymentEntity.getString("status");
    
    
    // Update payment status in database
    Payment payment = paymentRepository.findByTransactionId(paymentId)
        .orElse(new Payment());
    
    if (payment.getPaymentId() == null) {
        // New payment from webhook
        Order order = orderRepository.findByOrderNumber(orderId)
            .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Order not found: " + orderId));
        payment.setOrder(order);
        payment.setTransactionId(paymentId);
        payment.setGateway("razorpay");
    }
    
    payment.setStatus(PaymentStatus.PAID);
    payment.setAmount(amount);
    payment.setMethod(paymentEntity.getString("method"));
    payment.setPaidAt(OffsetDateTime.now());
    
    paymentRepository.save(payment);
    
    // Update order status
    if (payment.getOrder() != null) {
        Order order = payment.getOrder();
        order.setOrderStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        
        // Send confirmation email
        try {
            emailService.sendOrderConfirmationEmail(order, payment);
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }
    }
}

private void handlePaymentFailed(JSONObject paymentEntity) {
    String paymentId = paymentEntity.getString("id");
    
    // Update payment status to FAILED
    paymentRepository.findByTransactionId(paymentId).ifPresent(payment -> {
        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);
        
        // Update order status
        if (payment.getOrder() != null) {
            Order order = payment.getOrder();
            order.setOrderStatus(OrderStatus.PAYMENT_FAILED);
            orderRepository.save(order);
        }
    });
}

private void handlePaymentAuthorized(JSONObject paymentEntity) {
    String paymentId = paymentEntity.getString("id");
    // Handle payment authorization if needed
}

private void handleOrderPaid(JSONObject orderEntity) {
    String orderId = orderEntity.getString("id");
    // Handle order paid event if needed
}
}
