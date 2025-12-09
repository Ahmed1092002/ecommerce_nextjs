# E-Commerce Platform - Next.js 13+

A modern, full-stack e-commerce application built with **Next.js 13+**, **React**, **TypeScript**, and **Tailwind CSS**. This application features separate experiences for customers and sellers with role-based access control, product management, shopping cart, checkout, and order tracking.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation & Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The app will automatically reload as you make changes to files.

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Architecture

This project uses **Next.js App Router** with **Route Groups** to create distinct, role-based experiences without URL prefixes.

## project Structure

Next.js E-commerce Application Structure Explained
This is a well-organized Next.js 13+ e-commerce application that leverages the App Router architecture with route groups to create distinct user experiences for different roles. The structure elegantly separates concerns between customers, sellers, and authentication flows while maintaining a clean, scalable codebase.

Route Groups for Multi-User Experience
The application uses parenthesized folder names like (customer), (seller), and (auth) to create route groups. This is a powerful Next.js feature that allows you to organize routes and apply different layouts without affecting the URL structure. Each group has its own layout.tsx file, meaning customers see a traditional e-commerce interface with headers and footers, sellers get a dashboard with a sidebar, and authentication pages display a minimal, centered design—all without any route prefixes in the URL.

Customer-Facing Features
The (customer) group contains the public-facing shopping experience. It includes a home page, product listing and detail pages (using dynamic routes with [id]), a shopping cart, checkout flow, order history, and user profile. The dynamic routing pattern products/[id]/page.tsx enables the application to handle individual product pages where the ID is extracted from the URL, a common pattern for scalable e-commerce applications.

Seller Dashboard
The (seller) group houses the entire seller management interface under a /seller prefix. Sellers can view their dashboard, manage products (with dedicated pages for listing, creating, and editing), track orders, view analytics, and manage their profile. Notice how product editing uses a nested dynamic route: products/[id]/edit/page.tsx, which translates to URLs like /seller/products/123/edit.

API Routes as Backend
The api/ directory contains route handlers (Next.js's server-side API endpoints) organized by resource. Each route.ts file exports HTTP method handlers (GET, POST, PUT, DELETE) that act as your RESTful API. For example, api/products/route.ts might handle fetching all products (GET) and creating new ones (POST), while api/products/[id]/route.ts handles operations on individual products. This co-location of frontend and backend code is a key advantage of Next.js.

Component Organization
Components are thoughtfully separated into domain-specific folders: customer/ for shopping UI elements, seller/ for dashboard components, shared/ for reusable elements across both contexts, and ui/ for design system components (likely from shadcn/ui). This organization makes it immediately clear which components belong to which part of the application, improving maintainability and preventing component sprawl.

Supporting Infrastructure
The lib/ folder contains core utilities like database connections, authentication logic, and API helpers—the foundational code that powers the application. The types/ directory uses TypeScript to define data structures, ensuring type safety across the application. The middleware.ts file at the root of src/ is particularly important: it runs before requests are processed and handles authentication checks and role-based access control, preventing unauthorized users from accessing protected routes. Finally, Prisma provides the database ORM layer through schema.prisma, defining your data models and relationships in a type-safe way.

```
ecommerce_nextjs/
├── src/
│   ├── app/
│   │   ├── (customer)/              # Customer layout group (default)
│   │   │   ├── layout.tsx           # Header + Footer
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── products/
│   │   │   │   ├── page.tsx         # Products listing
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Product details
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (seller)/                # Seller layout group
│   │   │   ├── layout.tsx           # Sidebar + Header
│   │   │   └── seller/
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx
│   │   │       ├── products/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── create/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx
│   │   │       ├── orders/
│   │   │       │   └── page.tsx
│   │   │       ├── analytics/
│   │   │       │   └── page.tsx
│   │   │       └── settings/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (auth)/                  # Auth pages
│   │   │   ├── layout.tsx           # Minimal centered layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                     # Next.js API Routes (Proxy Layer)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── me/
│   │   │   │       └── route.ts
│   │   │   ├── products/
│   │   │   │   ├── route.ts         # GET all, POST create
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts     # GET, PUT, DELETE
│   │   │   ├── orders/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── cart/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── users/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx               # Root layout
│   │
│   ├── components/
│   │   ├── customer/
│   │   │   └── ProductCard.tsx
│   │   ├── seller/
│   │   │   ├── SellerSidebar.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   └── OrderTable.tsx
│   │   ├── shared/
│   │   │   ├── Header.tsx           # Customer header
│   │   │   ├── Footer.tsx
│   │   │   ├── NavBar.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   └── ui/                      # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── sidebar.tsx
│   │       └── ...
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useProducts.ts           # Products data hook
│   │   ├── useCart.ts               # Cart management hook
│   │   └── useOrders.ts             # Orders hook
│   │
│   ├── lib/
│   │   ├── api-client.ts            # API client (fetch wrapper)
│   │   ├── auth.ts                  # Auth utilities (token management)
│   │   ├── constants.ts             # API endpoints, storage keys
│   │   └── utils.ts                 # General utilities
│   │
│   ├── types/
│   │   ├── api.ts                   # API response types
│   │   ├── user.ts                  # User, Auth types
│   │   ├── product.ts               # Product types
│   │   ├── order.ts                 # Order types
│   │   └── cart.ts                  # Cart types
│   │
│   ├── utils/
│   │   ├── validators.ts            # Form validation
│   │   └── helpers.ts               # Format price, dates, etc.
│   │
│   └── middleware.ts                # Route protection & role-based routing
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local                       # Environment variables
├── .eslintrc.json
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```
