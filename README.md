# React Native Expo Login App

A React Native Expo application with authentication functionality, built with TypeScript and NativeWind for styling.

## Features Implemented

- ✅ **Secure Authentication** - Username/password login with secure credential storage
- ✅ **Form Validation** - Real-time form validation using react-hook-form and zod
- ✅ **Persistent Login** - User sessions persist across app restarts using expo-secure-store
- ✅ **Tab Navigation** - Clean tab-based navigation between Home and About screens
- ✅ **Responsive Design** - Mobile-first design with NativeWind (Tailwind CSS)
- ✅ **TypeScript** - Full TypeScript support for type safety
- ✅ **Context State Management** - Authentication state managed via React Context

## Demo Accounts

You can login with any of these demo accounts:

| Username | Password    | 
|----------|-------------|
| admin    | password123 |
| user1    | 123456      |
| demo     | demo        |

## Technology Stack

- **Framework**: React Native with Expo SDK ~53.0.22
- **Navigation**: Expo Router ~5.1.5 (file-based routing)
- **Styling**: NativeWind ^4.1.23 (Tailwind CSS for React Native)
- **Language**: TypeScript ~5.8.3
- **Form Management**: react-hook-form ^7.62.0
- **Validation**: zod ^4.1.5
- **Secure Storage**: expo-secure-store ^14.2.3

## Project Structure

```
├── app/
│   ├── (tabs)/           # Tab-based screens (protected)
│   │   ├── _layout.tsx   # Tab navigation layout
│   │   ├── index.tsx     # Home screen
│   │   └── about.tsx     # About screen
│   ├── _layout.tsx       # Root layout with auth routing
│   ├── index.tsx         # Initial redirect screen
│   └── login.tsx         # Login screen
├── components/
│   ├── FormInput.tsx     # Reusable form input component
│   ├── LoginForm.tsx     # Login form with validation
│   └── LogoutButton.tsx  # Logout button component
├── contexts/
│   └── AuthContext.tsx   # Authentication context provider
├── services/
│   └── authService.ts    # Authentication service layer
└── types/
    └── auth.ts           # TypeScript type definitions
```

## Authentication Flow

1. **App Start** - Check for stored credentials
2. **Login Required** - Redirect to login screen if not authenticated
3. **Form Validation** - Real-time validation of username/password
4. **Secure Storage** - Store credentials securely after successful login
5. **Protected Routes** - Access to main app features after authentication
6. **Logout** - Clear stored credentials and redirect to login

## Security Features

- Secure credential storage using expo-secure-store
- Input validation and sanitization
- Password visibility toggle
- Session persistence across app restarts
- Automatic logout on authentication failure

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with Expo Go app on your mobile device or run on simulator

## Form Validation Rules

- **Username**: 3-20 characters, alphanumeric and underscores only
- **Password**: 6-50 characters, any characters allowed
- Real-time validation on input blur and form submission
- Clear error messages displayed below each input field

## Authentication Service

The app includes a mock authentication service that simulates a real backend:
- Validates credentials against predefined user database
- Simulates API delay (1 second)
- Handles authentication errors gracefully
- Provides secure credential storage and retrieval