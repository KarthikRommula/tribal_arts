# Tech Stack Overview

This document explains the technologies and tools used in the Tribal Arts e-commerce platform in simple terms.

## Frontend (User Interface)

### Next.js
- A React framework that makes building web applications easier
- Handles routing, server-side rendering, and API endpoints
- Version 16.0.0 (latest stable)

### React
- A JavaScript library for building user interfaces
- Version 19.2.0 (latest)
- Used for creating interactive components like buttons, forms, and product displays

### TypeScript
- A programming language that adds type safety to JavaScript
- Helps catch errors before the code runs
- Makes the code more reliable and easier to maintain

### Tailwind CSS
- A utility-first CSS framework
- Used for styling the website with pre-built classes
- Makes it easy to create responsive, modern-looking designs

## UI Components

### Radix UI
- A set of low-level UI primitives
- Provides accessible, customizable components like dialogs, dropdowns, and navigation
- Used through shadcn/ui components for consistent design

### Lucide React
- A library of beautiful, customizable icons
- Used for buttons, navigation, and visual elements throughout the app

## Backend (Server Logic)

### Next.js API Routes
- Built-in API endpoints in the same Next.js application
- Handles server-side logic for authentication, database operations, and payments

### MongoDB
- A NoSQL database that stores data in flexible, JSON-like documents
- Used to store user accounts, products, orders, and shopping carts
- Can be run locally or in the cloud (MongoDB Atlas)

## Authentication & Security

### JSON Web Tokens (JWT)
- A standard for securely transmitting information between parties
- Used for user authentication and admin access
- Tokens are signed with a secret key for security

### bcryptjs
- A library for hashing passwords
- Ensures user passwords are stored securely (not in plain text)

## Forms & Validation

### React Hook Form
- A library for managing form state and validation
- Makes forms easier to build and handle user input

### Zod
- A TypeScript-first schema validation library
- Ensures data is in the correct format before processing

## Payment Processing

### Razorpay
- An Indian payment gateway
- Handles secure online payments for the e-commerce platform
- Supports multiple payment methods (cards, UPI, net banking, etc.)

## State Management

### React Context
- Built-in React feature for sharing state across components
- Used for:
  - User authentication state
  - Shopping cart contents
  - Wishlist items

## Additional Libraries

### date-fns
- A modern JavaScript date utility library
- Used for date formatting and calculations

### Recharts
- A charting library built on React
- Used for displaying data visualizations (like sales reports)

### Sonner
- A toast notification library
- Shows success/error messages to users

### next-themes
- Theme switching functionality for Next.js
- Supports light/dark mode

## Development Tools

### pnpm
- A fast, disk-efficient package manager
- Alternative to npm, used for installing and managing dependencies

### ESLint
- A tool for identifying and fixing code quality issues
- Helps maintain consistent code style

### PostCSS & Autoprefixer
- Tools for processing CSS
- Ensure styles work across different browsers

## Hosting & Deployment

### Vercel Analytics
- Built-in analytics for Vercel deployments
- Tracks user interactions and performance

## Why This Tech Stack?

- **Modern**: Uses the latest versions of popular frameworks
- **Scalable**: Next.js and MongoDB can handle growing user bases
- **Developer-friendly**: TypeScript and good tooling make development faster
- **Secure**: JWT authentication and secure payment processing
- **Accessible**: Radix UI components ensure good accessibility
- **Fast**: Next.js provides excellent performance with server-side rendering

This combination provides a solid foundation for a modern e-commerce platform with good user experience, security, and maintainability.