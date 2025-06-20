# Authentication Service Frontend

This is a simple HTML and JavaScript frontend for testing the authentication API.

## Pages

### Main Flow
1. `index.html` - Welcome page with Sign Up and Login buttons
2. `login.html` - Login page
3. `success.html` - Success page after login

### Sign Up Flow
1. `signup-phone.html` - Enter phone number
2. `signup-verify-otp.html` - Verify OTP
3. `signup-complete.html` - Complete registration with username and password
4. `success.html` - Success page after registration

### Password Reset Flow
1. `forgot-password.html` - Enter phone number
2. `verify-reset-otp.html` - Verify OTP
3. `reset-password.html` - Enter new password
4. `reset-success.html` - Password reset success page

## How to Use

1. Make sure the backend server is running on http://localhost:5000
2. Open `index.html` in a web browser
3. Follow the flow for either sign up or login

## Testing Notes

- For OTP verification, check the server console logs to get the OTP
- The frontend uses localStorage to store tokens and session data
- No CSS or styling is included - this is for API testing only