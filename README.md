# Lomage-B Backend

This is a Node.js Express backend for mobile app authentication using MongoDB (Dockerized).

## Features

- User authentication: multi-step sign up with phone OTP, log in, log out
- Forgot password (OTP via WhatsApp)
- Password reset
- Secure password hashing
- JWT-based authentication

## Getting Started

### Prerequisites

- Node.js
- Docker

### Setup Steps

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd lomage-b
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your values, or create a `.env` file with:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/lomageb
     JWT_SECRET=your_jwt_secret
     # Twilio config (if using WhatsApp in production)
     # TWILIO_ACCOUNT_SID=your_twilio_account_sid
     # TWILIO_AUTH_TOKEN=your_twilio_auth_token
     # TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
     # TWILIO_CONTENT_SID=your_twilio_content_sid
     ```
4. **Start MongoDB using Docker:**
   ```sh
   docker-compose up -d
   ```
5. **Start the backend server:**
   ```sh
   npm run dev
   ```

## API Usage

### Registration (Sign Up) Flow

1. **Request OTP:**
   - `POST /api/auth/request-otp`
   - Body: `{ "phone": "+1234567890" }`
2. **Verify OTP:**
   - `POST /api/auth/verify-otp`
   - Body: `{ "phone": "+1234567890", "otp": "1234" }`
   - Returns: `{ "userId": "...", "sessionToken": "..." }`
3. **Complete Registration:**
   - `POST /api/auth/signup`
   - Body: `{ "userId": "...", "sessionToken": "...", "username": "your_username", "password": "yourPassword", "password_confirmation": "yourPassword" }`

### Other Endpoints

- `POST /api/auth/login` - Log in
- `POST /api/auth/logout` - Log out (requires Bearer token)
- `POST /api/auth/forgot-password` - Request OTP for password reset (requires phone number)
- `POST /api/auth/verify-reset-otp` - Verify OTP for password reset (requires phone number and OTP, returns userId and sessionToken)
- `POST /api/auth/reset-password` - Reset password (requires userId, sessionToken, and newPassword)

---

Replace placeholder values in `.env` with your actual credentials. For development/testing, OTPs are logged to the server console.
