package com.vijaybrothers.store.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", foreignKey = @ForeignKey(name = "guest_id_fk"))
    private GuestCheckoutDetails guestCheckoutDetails;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(nullable = false)
    private String customerEmail;
    
    private String shippingName;
    private String shippingEmail;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingPostalCode;
    private String shippingState;

    private ZonedDateTime createdAt;

    private Instant updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    // Getters
    public Long getOrderId() { return orderId; }
    public String getOrderNumber() { return orderNumber; }
    public GuestCheckoutDetails getGuestCheckoutDetails() { return guestCheckoutDetails; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public OrderStatus getOrderStatus() { return orderStatus; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public String getCustomerEmail() { return customerEmail; }
    public String getShippingName() { return shippingName; }
    public String getShippingEmail() { return shippingEmail; }
    public String getShippingPhone() { return shippingPhone; }
    public String getShippingAddress() { return shippingAddress; }
    public String getShippingCity() { return shippingCity; }
    public String getShippingPostalCode() { return shippingPostalCode; }
    public String getShippingState() { return shippingState; }
    public ZonedDateTime getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<OrderItem> getOrderItems() { return orderItems; }

    // Setters
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public void setGuestCheckoutDetails(GuestCheckoutDetails guestCheckoutDetails) { this.guestCheckoutDetails = guestCheckoutDetails; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public void setShippingName(String shippingName) { this.shippingName = shippingName; }
    public void setShippingEmail(String shippingEmail) { this.shippingEmail = shippingEmail; }
    public void setShippingPhone(String shippingPhone) { this.shippingPhone = shippingPhone; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }
    public void setShippingPostalCode(String shippingPostalCode) { this.shippingPostalCode = shippingPostalCode; }
    public void setShippingState(String shippingState) { this.shippingState = shippingState; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
}