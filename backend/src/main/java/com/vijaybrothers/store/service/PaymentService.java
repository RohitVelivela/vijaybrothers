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
    
    private final String secret;

    public PaymentService(
            @Value("${razorpay.key_id}") String keyId,
            @Value("${razorpay.key_secret}") String secret,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository
    ) throws RazorpayException {
        this.razorpayClient = new RazorpayClient(keyId, secret);
        this.secret = secret;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    public PlaceOrderResponse createOrder(Order order) throws RazorpayException {
        JSONObject opts = new JSONObject()
            .put("amount", order.getTotalAmount().longValue() * 100) // Amount in paise
            .put("currency", "INR") // Assuming INR as currency
            .put("receipt", order.getOrderNumber());
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
            Order order = orderRepository.findByOrderNumber(req.getRazorpayOrderId())
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
                .put("receipt", req.getReceipt());
            com.razorpay.Order order = razorpayClient.orders.create(opts);
            return order.get("id");
        } catch (RazorpayException e) {
            throw new ResponseStatusException(BAD_REQUEST, "Failed to create payment order");
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
            Order order = orderRepository.findByOrderNumber(req.getRazorpayOrderId())
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
            }

            return req.getRazorpayPaymentId();
        } catch (RazorpayException ex) {
            throw new ResponseStatusException(BAD_REQUEST, "Failed to fetch payment details");
        }
    }

    public void handleWebhook(String payload) {
        // TODO: Implement webhook processing logic here
        // This might involve:
        // 1. Verifying the webhook signature to ensure it's from a trusted source.
        // 2. Parsing the payload to extract event type and data.
        // 3. Updating payment/order status in your database based on the event.
        System.out.println("Received webhook payload: " + payload);
    }
}
