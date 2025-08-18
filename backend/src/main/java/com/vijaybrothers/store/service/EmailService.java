package com.vijaybrothers.store.service;

import com.vijaybrothers.store.model.Order;
import com.vijaybrothers.store.model.OrderItem;
import com.vijaybrothers.store.model.Payment;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    
    @Value("${app.mail.from.address:${spring.mail.username}}")
    private String fromEmail;
    
    @Value("${app.mail.from.name:Vijay Brothers}")
    private String fromName;
    
    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;

    public void sendEmail(String to, String subject, String text) {
        try {
            // Check if email is disabled for development
            if (!emailEnabled) {
                System.out.println("========================================");
                System.out.println("EMAIL SERVICE (Development Mode - Emails Disabled)");
                System.out.println("========================================");
                System.out.println("Email would have been sent to: " + to);
                System.out.println("Subject: " + subject);
                System.out.println("Content: " + text);
                System.out.println("========================================");
                System.out.println("To enable email sending, set app.email.enabled=true in application.properties");
                return; // Don't throw exception, just log and return
            }
            
            // Check if email is properly configured
            if (fromEmail == null || fromEmail.contains("your-email") || fromEmail.contains("example")) {
                System.err.println("WARNING: Email service not properly configured!");
                System.err.println("Email would have been sent to: " + to);
                System.err.println("Subject: " + subject);
                System.err.println("Content: " + text);
                System.err.println("\nTo enable email sending:");
                System.err.println("1. Set app.email.enabled=true in application.properties");
                System.err.println("2. Create a Gmail App Password at: https://myaccount.google.com/apppasswords");
                System.err.println("3. Update spring.mail.username and spring.mail.password in application.properties");
                return; // Don't throw exception for development
            }
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(String.format("%s <%s>", fromName, fromEmail));
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Log error but don't throw exception to prevent breaking the flow
            if (emailEnabled) {
                System.err.println("Consider setting app.email.enabled=false for development");
            }
        }
    }
    
    public void sendOrderConfirmationEmail(Order order, Payment payment) {
        try {
            // Check if email is disabled for development
            if (!emailEnabled) {
                System.out.println("========================================");
                System.out.println("ORDER CONFIRMATION EMAIL (Development Mode - Emails Disabled)");
                System.out.println("========================================");
                System.out.println("Email would have been sent to: " + order.getCustomerEmail());
                System.out.println("Order Number: " + order.getOrderNumber());
                System.out.println("Payment Status: " + payment.getStatus());
                System.out.println("Total Amount: ₹" + order.getTotalAmount());
                System.out.println("========================================");
                return;
            }
            
            // Check if email is properly configured
            if (fromEmail == null || fromEmail.contains("your-email") || fromEmail.contains("example")) {
                System.err.println("WARNING: Email service not properly configured for order confirmation!");
                System.err.println("Order confirmation email would have been sent to: " + order.getCustomerEmail());
                System.err.println("Order Number: " + order.getOrderNumber());
                return;
            }
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(String.format("%s <%s>", fromName, fromEmail));
            helper.setTo(order.getCustomerEmail());
            helper.setSubject("Order Confirmation - Order #" + order.getOrderNumber());
            
            String htmlContent = buildOrderConfirmationHtml(order, payment);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            System.out.println("Order confirmation email sent to: " + order.getCustomerEmail());
        } catch (MessagingException e) {
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
            if (emailEnabled) {
                System.err.println("Consider setting app.email.enabled=false for development");
            }
        }
    }
    
    private String buildOrderConfirmationHtml(Order order, Payment payment) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html><head><meta charset='UTF-8'>");
        html.append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        html.append("<style>");
        html.append("body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }");
        html.append(".container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }");
        html.append(".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }");
        html.append(".header h1 { margin: 0; font-size: 28px; }");
        html.append(".header p { margin: 10px 0 0 0; opacity: 0.9; }");
        html.append(".content { padding: 30px; }");
        html.append(".greeting { font-size: 18px; margin-bottom: 20px; }");
        html.append(".order-details { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }");
        html.append(".order-details h3 { margin-top: 0; color: #667eea; }");
        html.append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }");
        html.append("th { background-color: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; color: #495057; font-weight: 600; }");
        html.append("td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }");
        html.append(".text-right { text-align: right !important; }");
        html.append(".text-center { text-align: center !important; }");
        html.append(".total-row { font-weight: bold; font-size: 16px; background-color: #f8f9fa; }");
        html.append(".success { color: #28a745; font-weight: bold; }");
        html.append(".pending { color: #ffc107; font-weight: bold; }");
        html.append(".btn { display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }");
        html.append(".footer { background-color: #f8f9fa; text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }");
        html.append(".footer a { color: #667eea; text-decoration: none; }");
        html.append("</style></head><body>");
        
        html.append("<div class='container'>");
        
        // Header
        html.append("<div class='header'>");
        html.append("<h1>VIJAY BROTHERS</h1>");
        html.append("<p>Order Confirmation</p>");
        html.append("</div>");
        
        // Content
        html.append("<div class='content'>");
        html.append("<p class='greeting'>Dear ").append(order.getShippingName()).append(",</p>");
        html.append("<p>Thank you for shopping with Vijay Brothers! Your order has been successfully ");
        html.append(payment.getStatus().toString().equals("PAID") ? "<strong>paid and confirmed</strong>" : "placed");
        html.append(". We're preparing your items for shipment.</p>");
        
        // Order Details Box
        html.append("<div class='order-details'>");
        html.append("<h3>Order Information</h3>");
        html.append("<table style='width: 100%; margin: 0;'>");
        html.append("<tr><td style='border: none; padding: 5px 0;'><strong>Order ID:</strong></td><td style='border: none; padding: 5px 0;'>").append(order.getOrderNumber()).append("</td></tr>");
        html.append("<tr><td style='border: none; padding: 5px 0;'><strong>Transaction ID:</strong></td><td style='border: none; padding: 5px 0;'>").append(payment.getTransactionId()).append("</td></tr>");
        html.append("<tr><td style='border: none; padding: 5px 0;'><strong>Order Date:</strong></td><td style='border: none; padding: 5px 0;'>").append(
            order.getCreatedAt() != null ? 
            order.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")) : 
            "N/A"
        ).append("</td></tr>");
        html.append("<tr><td style='border: none; padding: 5px 0;'><strong>Payment Method:</strong></td><td style='border: none; padding: 5px 0;'>").append(payment.getMethod() != null ? payment.getMethod().toUpperCase() : "ONLINE").append("</td></tr>");
        html.append("<tr><td style='border: none; padding: 5px 0;'><strong>Payment Status:</strong></td><td style='border: none; padding: 5px 0;'>");
        if (payment.getStatus().toString().equals("PAID")) {
            html.append("<span class='success'>✓ PAID SUCCESSFULLY</span>");
        } else {
            html.append("<span class='pending'>").append(payment.getStatus()).append("</span>");
        }
        html.append("</td></tr>");
        html.append("</table>");
        html.append("</div>");
        
        // Order Items Table
        html.append("<h3 style='color: #333; margin-top: 30px;'>Order Items</h3>");
        html.append("<table>");
        html.append("<thead><tr>");
        html.append("<th>Product</th>");
        html.append("<th class='text-center'>Qty</th>");
        html.append("<th class='text-right'>Price</th>");
        html.append("<th class='text-right'>Total</th>");
        html.append("</tr></thead>");
        html.append("<tbody>");
        
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            for (OrderItem item : order.getOrderItems()) {
                html.append("<tr>");
                html.append("<td>").append(
                    item.getProduct() != null ? item.getProduct().getName() : "Product #" + item.getProductId()
                ).append("</td>");
                html.append("<td class='text-center'>").append(item.getQuantity()).append("</td>");
                html.append("<td class='text-right'>₹").append(String.format("%.2f", item.getUnitPrice())).append("</td>");
                html.append("<td class='text-right'>₹").append(String.format("%.2f", item.getLineTotal())).append("</td>");
                html.append("</tr>");
            }
        }
        
        // Total Row
        html.append("<tr class='total-row'>");
        html.append("<td colspan='3' class='text-right' style='padding: 15px 12px;'>Total Amount:</td>");
        html.append("<td class='text-right' style='padding: 15px 12px; font-size: 18px; color: #667eea;'>₹").append(String.format("%.2f", order.getTotalAmount())).append("</td>");
        html.append("</tr>");
        html.append("</tbody></table>");
        
        // Shipping Address
        html.append("<div class='order-details'>");
        html.append("<h3>Delivery Address</h3>");
        html.append("<p style='margin: 0; line-height: 1.8;'>");
        html.append("<strong>").append(order.getShippingName()).append("</strong><br>");
        html.append(order.getShippingAddress()).append("<br>");
        html.append(order.getShippingCity()).append(", ").append(order.getShippingState()).append(" ");
        html.append(order.getShippingPostalCode()).append("<br>");
        html.append("📞 ").append(order.getShippingPhone()).append("<br>");
        html.append("✉️ ").append(order.getShippingEmail() != null ? order.getShippingEmail() : order.getCustomerEmail());
        html.append("</p>");
        html.append("</div>");
        
        // Next Steps
        html.append("<div style='background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;'>");
        html.append("<h4 style='margin-top: 0; color: #0066cc;'>What's Next?</h4>");
        html.append("<ul style='margin: 10px 0; padding-left: 20px;'>");
        html.append("<li>We're preparing your order for shipment</li>");
        html.append("<li>You'll receive a shipping confirmation email with tracking details</li>");
        html.append("<li>Expected delivery within 3-5 business days</li>");
        html.append("</ul>");
        html.append("</div>");
        
        html.append("<p style='text-align: center;'>");
        html.append("<a href='#' class='btn'>Track Your Order</a>");
        html.append("</p>");
        
        html.append("<p>If you have any questions about your order, please contact us at <a href='mailto:vijaybrotherspage@gmail.com'>vijaybrotherspage@gmail.com</a></p>");
        html.append("</div>");
        
        // Footer
        html.append("<div class='footer'>");
        html.append("<p><strong>Vijay Brothers Store</strong></p>");
        html.append("<p>Quality Products, Trusted Service</p>");
        html.append("<p style='margin-top: 15px;'>");
        html.append("<a href='#'>Website</a> | ");
        html.append("<a href='#'>Contact Us</a> | ");
        html.append("<a href='#'>Return Policy</a>");
        html.append("</p>");
        html.append("<p style='font-size: 12px; margin-top: 20px; color: #999;'>This is an automated email. Please do not reply directly to this message.</p>");
        html.append("</div>");
        
        html.append("</div>");
        html.append("</body></html>");
        
        return html.toString();
    }
}
