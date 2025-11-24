# 🔧 E-commerce Project - What Needs to be Fixed

## 🚨 IMMEDIATE CRITICAL FIXES (Do These First!)

### 1. **Fix Root Page & Routing**

**Problem**: `src/app/page.tsx` is still the default Next.js template. The home page should be in the `(customer)` route group.

**Solution**:

- Create `src/app/(customer)/page.tsx` with a proper home page
- Delete or update `src/app/page.tsx` (or move it to customer group)

**Files to create/modify**:

- `src/app/(customer)/page.tsx` - Home page with product listing

---

### 2. **Fix Middleware - Allow Public Access**

**Problem**: Middleware blocks ALL unauthenticated users, but home and products should be public.

**Current Issue** (line 11-13 in `src/middleware.ts`):

```typescript
if (!token && pathname !== "/login" && pathname !== "/register") {
  const loginUrl = new URL("/", request.url);
  return NextResponse.redirect(loginUrl);
}
```

**Fix**: Allow public access to:

- `/` (home)
- `/products` (product listing)
- `/products/[id]` (product details)

**Files to modify**:

- `src/middleware.ts` - Update logic to allow public pages

---

### 3. **Integrate Header Component**

**Problem**: Customer layout has basic header, but Header component exists and isn't used.

**Fix**:

- Update `src/app/(customer)/layout.tsx` to use the Header and Footer components
- Add logout functionality to Header

**Files to modify**:

- `src/app/(customer)/layout.tsx`
- `src/components/customer/Header.tsx` - Add logout, cart count, user menu

---

### 4. **Create Auth Pages**

**Problem**: No login/register pages exist.

**Files to create**:

- `src/app/(auth)/layout.tsx` - Minimal centered layout
- `src/app/(auth)/login/page.tsx` - Login form
- `src/app/(auth)/register/page.tsx` - Registration form

---

## 📋 MISSING PAGES (Priority Order)

### Customer Pages - Create These:

1. **Home Page** - `src/app/(customer)/page.tsx`

   - Featured products
   - Categories
   - Hero section

2. **Products Listing** - `src/app/(customer)/products/page.tsx`

   - List all products
   - Filters & search
   - Pagination

3. **Product Details** - `src/app/(customer)/products/[id]/page.tsx`

   - Product info
   - Add to cart
   - Image gallery

4. **Cart** - `src/app/(customer)/cart/page.tsx`

   - Cart items
   - Update quantities
   - Remove items

5. **Checkout** - `src/app/(customer)/checkout/page.tsx`

   - Shipping form
   - Order summary
   - Place order

6. **Orders** - `src/app/(customer)/orders/page.tsx`

   - Order history
   - Order status

7. **Profile** - `src/app/(customer)/profile/page.tsx`
   - User info
   - Edit profile

### Seller Pages - Create These:

1. **Dashboard** - `src/app/(seller)/seller/dashboard/page.tsx`

   - Stats cards
   - Recent orders
   - Charts

2. **Products Management** - `src/app/(seller)/seller/products/page.tsx`

   - List products
   - Create/Edit/Delete

3. **Create Product** - `src/app/(seller)/seller/products/new/page.tsx`

   - Product form

4. **Edit Product** - `src/app/(seller)/seller/products/[id]/edit/page.tsx`

   - Edit form

5. **Orders** - `src/app/(seller)/seller/orders/page.tsx`

   - Seller orders
   - Update status

6. **Analytics** - `src/app/(seller)/seller/analytics/page.tsx`

   - Sales stats

7. **Profile** - `src/app/(seller)/seller/profile/page.tsx`
   - Seller info

---

## 🔌 MISSING API ROUTES

Create these API route files:

### Products API

- `src/app/api/products/route.ts` - GET all, POST create
- `src/app/api/products/[id]/route.ts` - GET, PUT, DELETE

### Orders API

- `src/app/api/orders/route.ts` - GET all, POST create
- `src/app/api/orders/[id]/route.ts` - GET, PUT

### Cart API

- `src/app/api/cart/route.ts` - GET, POST, PUT
- `src/app/api/cart/[id]/route.ts` - DELETE

### Auth API (Complete)

- `src/app/api/auth/logout/route.ts` - Clear cookies
- `src/app/api/auth/me/route.ts` - Get current user

---

## 🎨 COMPONENT FIXES

### Header Component (`src/components/customer/Header.tsx`)

**Add**:

- Logout button/functionality
- Cart count badge
- User menu with name
- Conditional rendering (logged in vs logged out)

### Missing Components to Create:

- `src/components/customer/CartItem.tsx`
- `src/components/seller/ProductForm.tsx`
- `src/components/seller/OrderTable.tsx`
- `src/components/shared/LoadingSpinner.tsx`
- `src/components/shared/ErrorMessage.tsx`

---

## 🔐 AUTHENTICATION FIXES

1. **Logout API Route** - Create `src/app/api/auth/logout/route.ts`
2. **Token Management** - Verify cookies are set correctly
3. **Protected Routes** - Ensure middleware works correctly after fixes

---

## 📦 CART FUNCTIONALITY

**Missing**:

- Cart state management (Context API or Zustand)
- Add to cart functionality
- Cart persistence
- Cart count in header

**Create**:

- `src/contexts/CartContext.tsx` or use Zustand store
- Cart API integration

---

## ⚙️ ENVIRONMENT SETUP

**Create `.env.local`**:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_API_URL=http://localhost:8080/api
```

**Create `.env.example`**:

```env
NEXT_PUBLIC_API_URL=
BACKEND_API_URL=
```

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Critical Fixes (Start Here!)

- [ ] Fix middleware to allow public pages
- [ ] Create home page in (customer) group
- [ ] Create auth pages (login, register)
- [ ] Integrate Header/Footer in customer layout
- [ ] Add logout to Header

### Phase 2: Customer Features

- [ ] Products listing page
- [ ] Product details page
- [ ] Cart page
- [ ] Checkout page
- [ ] Orders page
- [ ] Profile page

### Phase 3: Seller Features

- [ ] Dashboard
- [ ] Products management
- [ ] Orders management
- [ ] Analytics

### Phase 4: API Routes

- [ ] Products API
- [ ] Orders API
- [ ] Cart API
- [ ] Complete Auth API

### Phase 5: Polish

- [ ] Cart functionality
- [ ] Search & filters
- [ ] Error handling
- [ ] Loading states
- [ ] Form validation

---

## 🐛 KNOWN BUGS

1. **Middleware redirect loop** - Fixes in Phase 1
2. **No public access** - Fixes in Phase 1
3. **Missing logout** - Fix in Phase 1
4. **Header not integrated** - Fix in Phase 1

---

## 🚀 QUICK START GUIDE

1. **Fix middleware first** - This blocks everything
2. **Create auth pages** - Need login/register
3. **Create home page** - Basic customer experience
4. **Build customer flow** - Products → Cart → Checkout
5. **Build seller dashboard** - Product management

---

## 💡 TIPS

- Use `react-hook-form` + `zod` for forms (already installed)
- Use shadcn/ui components (already set up)
- Test API connection before building pages
- Start with customer features, then seller
- Use TypeScript types (already defined)

---

**Status**: Ready to start fixing!
**Next Step**: Fix middleware and create home page
