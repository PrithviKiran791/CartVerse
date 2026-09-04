# RigForge Frontend - Gaming PC E-Commerce Platform

## Overview
RigForge is a modern, brutalist-inspired gaming PC configuration and e-commerce platform built with React, Redux Toolkit, and Tailwind CSS.

## Design Philosophy
- **Modular Brutalism**: Strong geometric shapes, minimal borders, high contrast
- **Technical Aesthetic**: Engineering-inspired UI with monospace metadata
- **Color System**: Black (#0A0A0A), White (#F5F5F5), Grey palette, Red accent (#E31B23)
- **Typography**: Bold, uppercase labels with clean sans-serif body text

## Tech Stack
- **React 19** - UI Framework
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build Tool

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CheckoutStepper.jsx
│   ├── ProductCard.jsx
│   ├── Loader.jsx
│   ├── Message.jsx
│   └── PrivateRoute.jsx
│
├── pages/              # Route pages
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailsPage.jsx
│   ├── CartPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ShippingPage.jsx
│   ├── PaymentPage.jsx
│   ├── PlaceOrderPage.jsx
│   ├── ProfilePage.jsx
│   └── PCBuilderPage.jsx
│
├── slices/             # Redux slices
│   ├── apiSlices.js
│   ├── authSlice.js
│   ├── cartSlice.js
│   ├── productsApiSlice.js
│   └── usersApiSlice.js
│
├── App.jsx             # Main app component
├── store.js            # Redux store configuration
├── constants.js        # API constants
└── index.css           # Global styles
```

## Features Implemented

### ✅ Core Components
- Brutalist design system with reusable components
- Button, Input, Card, SectionHeader components
- Navbar with cart badge and user menu
- Footer with links and branding
- CheckoutStepper for multi-step checkout flow

### ✅ Pages & Routes
- **HomePage** - Hero section with feature cards
- **ProductsPage** - Product grid with filtering/sorting
- **ProductDetailsPage** - Detailed product view with add to cart
- **CartPage** - Shopping cart with quantity management
- **LoginPage / RegisterPage** - Authentication forms
- **ShippingPage** - Shipping address form with order summary
- **PaymentPage** - Payment method selection
- **PlaceOrderPage** - Final order review before purchase
- **ProfilePage** - User profile management
- **PCBuilderPage** - Custom PC configuration interface

### ✅ State Management
- Redux store with auth and cart slices
- RTK Query for API integration
- Persistent cart in localStorage
- Protected routes for authenticated users

### ✅ Shopping Flow
1. Browse products or use PC Builder
2. Add items to cart
3. Login/Register (if needed)
4. Enter shipping information
5. Select payment method
6. Review and place order
7. View order confirmation

## Setup & Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables
Create a `.env` file:
```
VITE_API_URL=http://localhost:5000
```

## API Integration
The frontend expects REST APIs at:
- `GET /api/products` - List products
- `GET /api/products/:id` - Product details
- `POST /api/users/login` - User login
- `POST /api/users` - User registration
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - User orders
- `GET /api/orders/:id` - Order details

## Design System

### Colors
```css
Black: #0A0A0A
White: #F5F5F5
Red: #E31B23
Grey 100: #D0D0D0
Grey 200: #A0A0A0
Grey 300: #666666
Grey 400: #2A2A2A
Grey 500: #181818
```

### Component Classes
- `.btn` - Base button
- `.btn-primary` - Primary action button (red)
- `.btn-secondary` - Secondary button
- `.input` - Form input field
- `.card` - Container card
- `.label` - Technical label
- `.metadata` - Monospace metadata text
- `.section-header` - Section heading

## Responsive Design
- **Desktop**: Multi-column layouts, side-by-side forms
- **Tablet**: Reduced columns, maintained hierarchy
- **Mobile**: Single column, stacked layouts

## Next Steps / TODO
- [ ] Order API integration
- [ ] Order history page with real data
- [ ] Order tracking with status timeline
- [ ] PC Builder component selection modal
- [ ] AI Advisor chatbot integration
- [ ] Game-based recommendation flow
- [ ] Component compatibility validation
- [ ] Saved addresses CRUD
- [ ] Payment processing integration
- [ ] Image optimization
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Error boundary implementation
- [ ] Toast notifications
- [ ] Accessibility audit
- [ ] Performance optimization

## Key Design Decisions
1. **Brutalist Aesthetic**: Strong borders, minimal radius, high contrast for technical feel
2. **Monospace Metadata**: Technical labels use monospace fonts for engineering aesthetic
3. **Red as Accent**: Limited use of red (#E31B23) for CTAs and highlights
4. **Component-First**: Built reusable components before pages
5. **LocalStorage Cart**: Cart persists across sessions
6. **Protected Routes**: Authentication required for checkout and profile
7. **Responsive Mobile-First**: Mobile layouts designed separately, not just shrunk

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License
Proprietary - RigForge

---

**DON'T JUST BUY A PC. BUILD THE RIGHT ONE.**
