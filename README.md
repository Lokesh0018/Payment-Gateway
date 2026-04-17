# Payment Gateway

A comprehensive TypeScript-based payment gateway system supporting multiple payment methods including credit cards, debit cards, digital wallets, UPI, and net banking. The system implements design patterns and interfaces for extensibility and maintainability.

## Project Overview

This payment gateway project demonstrates a well-architected payment processing system with the following key features:

- **Multi-Payment Method Support**: Credit cards, debit cards, digital wallets, UPI, and net banking
- **Security Features**: OTP verification, refund capability, and payment saving functionality
- **Object-Oriented Design**: Leverages abstract classes, interfaces, and design patterns
- **Service-Based Architecture**: Separated concerns with dedicated services for users, transactions, and payments
- **Repository Pattern**: Data persistence layer for users, transactions, and payment methods
- **Factory Pattern**: Dynamic payment method creation based on type

## Project Structure

- `src/models`: domain entities such as `User` and `Transaction`
- `src/services`: business logic for user, payment, and transaction operations
- `src/repository`: in-memory data storage and retrieval
- `src/payment methods`: payment abstractions and concrete implementations
- `src/patterns`: factory and creation logic for payment methods
- `src/interfaces`: reusable interface contracts
- `src/types`: shared TypeScript type definitions

## Setup Instructions

### Prerequisites
- Node.js (v18.20.8 or higher)
- npm (v10.8.2 or higher)
- TypeScript knowledge (helpful but not required)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone "https://github.com/Lokesh0018/Payment-Gateway.git"
   cd payment-gateway
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the demo**
   ```bash
   npm run start
   ```

4. **Verify installation**
   ```bash
   npm -v
   ```

## How to Run Demo

To execute the payment gateway system:

```bash
npm run start
```

Or use TypeScript directly:

```bash
npx tsx src/index.ts
```

This will run the main application which demonstrates:
- User registration and authentication
- Payment method creation and management
- Transaction processing
- Refund operations
- OTP verification for secure transactions

## Design Highlights

### Architecture
- **Layered Architecture**: Separated into models, services, repositories, and patterns
- **Abstraction**: PaymentMethod as an abstract base class with multiple concrete implementations
- **Interface Segregation**: Separate interfaces for OtpVerifiable, Refundable, and Savable features
- **Factory Pattern**: PaymentFactory for creating payment method instances
- **Type Safety**: Comprehensive TypeScript types for payment types, transaction statuses, and user data

### Key Components
- **Services**: UserService, PaymentService, TransactionService for business logic
- **Repositories**: UserRepository, PaymentRepository, TransactionRepository for data management
- **Payment Hierarchy**: CardPayments and DigitalPayments as intermediate abstractions with specialized implementations
- **Security**: OTP generation and verification, transaction status tracking

## Assumptions Made

1. **In-Memory Storage**: The repositories use in-memory collections (Map, Record) for data storage. No external database is integrated.
2. **Transaction IDs**: Generated as unique strings during transaction creation.
3. **OTP Validation**: OTP is generated randomly and validated against stored values. In production, this would use actual SMS/Email services.
4. **Payment Limits**: Daily transaction limits are enforced per payment method instance.
5. **No Authentication**: User authentication in this demo is simplified. Production systems should use proper credential hashing and token-based authentication.
6. **Refund Logic**: All eligible payment methods can be refunded. Refund details are stored but not yet implemented with rollback logic.
7. **Single Currency**: The system assumes a single currency throughout. Multi-currency support would require additional configuration.