# JAYVEERMart Enterprise — Modern E-Commerce Platform

[![React](https://img.shields.io/badge/React-19.x-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg?logo=vite)](https://vitejs.dev/)
[![Security](https://img.shields.io/badge/Security-PBKDF2%20%7C%202FA%20%7C%20DPDP%20Ready-emerald.svg)](https://github.com/)

**JAYVEERMart Enterprise** is a high-performance, responsive single-page e-commerce web application engineered with **React 19**, **TypeScript**, and **Vite**. It features an intelligent AI customer assistant (**JAYVEER AI**), multi-language localization (9 Indian languages), a complete administrative control suite, robust authentication with Two-Factor Authentication (2FA), and offline-first persistent state storage.

---

## 🌟 Key Features

### 🛍️ Public Storefront
- **Modern Homepage & Showcase**: Dynamic hero banners, flash discount ticker, trending deals, and curated category carousels.
- **Product Catalog & Filtering**: Multi-dimensional search and filtering by category, brand, price slider, rating, and keyword tags.
- **Product Detail View**: High-definition image preview, specifications breakdown, real-time stock counters, and verified customer review submissions.
- **Animated Cart Drawer & Wishlist**: Slide-out cart with promo coupon engine (`SUPER20`, `WELCOME500`), instant item quantity adjustments, and saved wishlist migration.
- **Checkout & Order Tracking**: Multi-method checkout (Instant UPI QR Code, Card simulation, Cash on Delivery) with milestone tracking (`/my-orders`).
- **Legal & Compliance Pages**: Dedicated, interactive **Conditions of Use** and **Privacy Notice** compliant with the Digital Personal Data Protection (DPDP) Act, 2023.
- **JAYVEER AI Support Assistant**: Integrated intelligent virtual shopping assistant supporting product recommendations, order tracking, and FAQ resolution.
- **Multi-Language Support**: Seamless instant translation across 9 languages: English, Hindi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Bengali, and Marathi.

### 🛡️ Administrative Control Suite (`/admin`)
- **Executive Dashboard**: Real-time sales metrics, revenue analytics, top-selling products, and stock alert indicators.
- **Product Catalog Manager**: Full CRUD management with strict image upload validation (MIME-type & extension verification) and live search.
- **Category & Brand Management**: Organize catalog taxonomy with real-time updates.
- **Order Fulfillment Desk**: Update order milestones (Processing, Dispatched, Out for Delivery, Delivered) and cancelations.
- **Security & Audit Logs**: Cryptographic password policy verification, 2FA management with backup recovery codes, active session management, and immutable audit logs.
- **Email Outbox Inspector**: View dispatched transactional notifications and simulated security alerts.

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Modern CSS3 (Vanilla design tokens, CSS variables, glassmorphism surfaces)
- **Icons**: Lucide React
- **Security & Cryptography**: Web Crypto API (`crypto.subtle`), PBKDF2 (SHA-256) password derivation, Base32 2FA generation
- **State & Storage**: React Context API, persistent LocalStorage engine, mock database layer
- **Code Quality**: Oxlint, TypeScript strict mode

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Clone the Repository
```bash
git clone https://github.com/username/online-shopping-system.git
cd online-shopping-system
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the example environment file and configure local values as needed:
```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_ADMIN_NOTIFICATION_EMAIL` | Email address receiving administrative security notifications | `admin@example.com` |
| `VITE_FROM_EMAIL` | Sender identity for transactional emails | `JAYVEERMart <noreply@example.com>` |
| `VITE_RESEND_API_KEY` | *(Optional)* Resend API key for live email delivery | `re_...` *(Leave empty for simulated mode)* |
| `VITE_APP_URL` | Application base URL | `http://localhost:5173` |

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for Production
```bash
npm run build
```
Production artifacts are emitted to the `dist/` directory.

To preview the production bundle locally:
```bash
npm run preview
```

---

## 🗄️ Database Setup & Schemas

The application includes standalone SQL schemas located in the `database/` directory for relational backend reference:

- **`database/nexusmart.sql`**: Production-ready MySQL schema with relational constraints, foreign keys, and clean product seed data.
- **`database/onlineshop.sql`**: Generic reference schema and table definitions.

To import the database schema into a local MySQL instance:
```bash
mysql -u root -p onlineshop < database/nexusmart.sql
```

---

## 🔒 Security Architecture & Best Practices

1. **Client-Side Secret Isolation**: No production private keys or secret-role tokens are bundled into the client build. Any variables prefixed with `VITE_` are public by design.
2. **PBKDF2 Password Hashing**: Passwords are never stored in plaintext. Passwords use client-side salted key derivation with constant-time equality checks.
3. **Two-Factor Authentication (2FA)**: Time-based OTP verification with 30-second rotating codes and single-use emergency backup recovery tokens.
4. **File Upload Hardening**: Client-side MIME-type (`image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `image/avif`) and extension validation with 5MB file-size limits.
5. **Rate Limiting & Anti-Brute Force**: In-memory rate limiting with exponential backoff, temporary lockouts, and visual CAPTCHA verification after consecutive failed attempts.
6. **Audit Trail**: Security events (logins, password updates, 2FA status changes) are recorded with timestamps, user agent signatures, and IP metadata.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
