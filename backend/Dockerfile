# Multi-stage build for Spring Boot application
# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

# Set working directory
WORKDIR /app

# Copy maven files for dependency resolution
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Install required packages
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1000 spring && \
    adduser -D -s /bin/sh -u 1000 -G spring spring

# Set working directory
WORKDIR /app

# Create uploads directory for file storage
RUN mkdir -p /app/uploads && \
    chown -R spring:spring /app

# Copy the built JAR from builder stage
COPY --from=builder --chown=spring:spring /app/target/store-backend-*.jar app.jar

# Switch to non-root user
USER spring:spring

# Environment variables with defaults (can be overridden at runtime)
ENV SERVER_PORT=8080 \
    SPRING_PROFILES_ACTIVE=default \
    JAVA_OPTS="-Xms256m -Xmx512m"

# Database configuration (override these at runtime)
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/vijaybrothers \
    SPRING_DATASOURCE_USERNAME=postgres \
    SPRING_DATASOURCE_PASSWORD=changeme

# JWT configuration (override at runtime for security)
ENV APPLICATION_SECURITY_JWT_SECRET_KEY=your-secret-key-here \
    APPLICATION_SECURITY_JWT_EXPIRATION=86400000

# Email configuration (override at runtime)
ENV SPRING_MAIL_HOST=smtp.gmail.com \
    SPRING_MAIL_PORT=587 \
    SPRING_MAIL_USERNAME=your-email@gmail.com \
    SPRING_MAIL_PASSWORD=your-password \
    APP_EMAIL_ENABLED=false

# Razorpay configuration (override at runtime)
ENV RAZORPAY_KEY_ID=your-razorpay-key \
    RAZORPAY_KEY_SECRET=your-razorpay-secret \
    RAZORPAY_MERCHANT_ID=your-merchant-id \
    RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Frontend URL and CORS configuration
ENV APP_FRONTEND_URL=http://localhost:3000 \
    APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Expose the application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]