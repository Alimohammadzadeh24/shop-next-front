# Persian E-commerce Web Application

A modern, production-ready Persian (RTL) e-commerce web application built with Next.js 14, Material UI, and TypeScript.

## Features

- 🌐 **Persian (RTL) Interface**: Complete right-to-left layout with Persian localization
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🛒 **Shopping Cart**: Persistent cart with Zustand state management
- 🔐 **Authentication**: Login/register system with JWT token handling
- 📦 **Product Management**: Browse, search, and filter products
- 🛍️ **Order Management**: Place orders and track their status
- 🔄 **Returns System**: Request and manage product returns
- 👤 **User Profile**: Manage personal information and change password
- 🎨 **Modern UI**: Material UI components with custom Persian theme

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI Library**: Material UI (MUI) v5 with RTL support
- **Language**: TypeScript
- **Styling**: Emotion + stylis-plugin-rtl for RTL support
- **State Management**: Zustand for cart state
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: next-intl
- **Icons**: Material Icons
- **Font**: Vazirmatn (Persian font)

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A NestJS backend running on `http://localhost:3000`

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Environment Setup:**

The application is configured to use `http://localhost:3000` as the API base URL. Make sure your NestJS backend is running on this port.

3. **Run the development server:**

```bash
npm run dev
```

4. **Open the application:**

Navigate to `http://localhost:3001` in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Localized routes
│   │   ├── page.tsx       # Home page
│   │   ├── products/      # Products pages
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout process
│   │   ├── orders/        # Order management
│   │   ├── returns/       # Returns management
│   │   ├── profile/       # User profile
│   │   ├── auth/          # Authentication pages
│   │   └── admin/         # Admin panel
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── products/         # Product-related components
│   ├── cart/             # Cart components
│   ├── orders/           # Order components
│   ├── returns/          # Return components
│   ├── checkout/         # Checkout components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API
├── stores/               # Zustand stores
├── types/                # TypeScript type definitions
├── messages/             # i18n message files
└── theme/                # MUI theme configuration
```

## Key Features

### Persian/RTL Support
- Complete RTL layout and text direction
- Persian digits and currency formatting
- Jalali calendar integration
- Persian translations for all UI text

### E-commerce Functionality
- Product catalog with search and filtering
- Shopping cart with persistent state
- Multi-step checkout process
- Order tracking and history
- Return/refund management
- User account management

### Modern Development Practices
- TypeScript for type safety
- Component-based architecture
- API response validation with Zod
- Responsive design with Material UI breakpoints
- SEO-friendly with Next.js App Router
- Performance optimization with React Query caching

## API Integration

The application expects a NestJS backend with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/change-password` - Change password

### Products
- `GET /products` - Get products with filtering
- `GET /products/:id` - Get single product
- `POST /products` - Create product (Admin)
- `PATCH /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Orders
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get single order
- `POST /orders` - Create new order
- `PATCH /orders/:id/status` - Update order status (Admin)

### Returns
- `GET /returns` - Get returns
- `GET /returns/:id` - Get single return
- `POST /returns` - Create return request
- `PATCH /returns/:id/status` - Update return status (Admin)

### Users
- `GET /users/:id` - Get user profile
- `PATCH /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user (Admin)

## Development Notes

- The application includes mock data for development purposes
- All Persian text uses proper RTL formatting
- Images are loaded from Pexels for demonstration
- Authentication uses mock JWT tokens in development mode
- The admin panel is a basic skeleton for future expansion

## Build and Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing

This is a demo application showcasing Persian e-commerce functionality. The code is well-structured and documented for educational purposes.