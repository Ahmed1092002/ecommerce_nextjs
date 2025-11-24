This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
│ ├── app/
│ │ ├── (customer)/ # Customer layout group
│ │ │ ├── layout.tsx # Customer layout (header, footer, cart icon)
│ │ │ ├── page.tsx # Home page
│ │ │ ├── products/
│ │ │ │ ├── page.tsx # Products listing
│ │ │ │ └── [id]/
│ │ │ │ └── page.tsx # Product details
│ │ │ ├── cart/
│ │ │ │ └── page.tsx
│ │ │ ├── checkout/
│ │ │ │ └── page.tsx
│ │ │ ├── orders/
│ │ │ │ └── page.tsx # Customer orders history
│ │ │ └── profile/
│ │ │ └── page.tsx
│ │ │
│ │ ├── (seller)/ # Seller layout group
│ │ │ ├── layout.tsx # Seller dashboard layout (sidebar)
│ │ │ └── seller/
│ │ │ ├── dashboard/
│ │ │ │ └── page.tsx
│ │ │ ├── products/
│ │ │ │ ├── page.tsx # Manage products
│ │ │ │ ├── new/
│ │ │ │ │ └── page.tsx # Add product
│ │ │ │ └── [id]/
│ │ │ │ └── edit/
│ │ │ │ └── page.tsx # Edit product
│ │ │ ├── orders/
│ │ │ │ └── page.tsx # Seller orders
│ │ │ ├── analytics/
│ │ │ │ └── page.tsx
│ │ │ └── profile/
│ │ │ └── page.tsx
│ │ │
│ │ ├── (auth)/ # Auth layout (centered, minimal)
│ │ │ ├── layout.tsx
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ ├── register/
│ │ │ │ └── page.tsx
│ │ │ └── forgot-password/
│ │ │ └── page.tsx
│ │ │
│ │ └── api/ # REST API Routes
│ │ ├── auth/
│ │ │ ├── login/
│ │ │ │ └── route.ts
│ │ │ ├── register/
│ │ │ │ └── route.ts
│ │ │ └── logout/
│ │ │ └── route.ts
│ │ ├── products/
│ │ │ ├── route.ts # GET all, POST create
│ │ │ └── [id]/
│ │ │ └── route.ts # GET, PUT, DELETE
│ │ ├── orders/
│ │ │ ├── route.ts
│ │ │ └── [id]/
│ │ │ └── route.ts
│ │ ├── cart/
│ │ │ └── route.ts
│ │ └── users/
│ │ └── [id]/
│ │ └── route.ts
│ │
│ ├── components/
│ │ ├── customer/
│ │ │ ├── Header.tsx
│ │ │ ├── Footer.tsx
│ │ │ ├── ProductCard.tsx
│ │ │ └── CartItem.tsx
│ │ ├── seller/
│ │ │ ├── Sidebar.tsx
│ │ │ ├── ProductForm.tsx
│ │ │ └── OrderTable.tsx
│ │ ├── shared/
│ │ │ ├── Button.tsx
│ │ │ ├── Input.tsx
│ │ │ └── Modal.tsx
│ │ └── ui/ # shadcn/ui components
│ │
│ ├── lib/
│ │ ├── db.ts # Database connection
│ │ ├── auth.ts # Auth utilities
│ │ └── api-helpers.ts # API response helpers
│ │
│ ├── types/
│ │ ├── user.ts
│ │ ├── product.ts
│ │ ├── order.ts
│ │ └── cart.ts
│ │
│ ├── middleware.ts # Auth & role-based route protection
│ └── utils/
│ ├── validators.ts
│ └── helpers.ts
│
├── prisma/
│ └── schema.prisma # Database schema
│
└── public/
└── images/
```