# Edrugs.pk - Online Pharmacy E-Commerce Platform

A modern, feature-rich online pharmacy application built with **React**, **Supabase**, **Tailwind CSS**, and **Framer Motion**. Edrugs.pk provides a seamless experience for customers to browse, search, and order medicines and healthcare products with prescription verification for regulated items.

---

## 🌟 Features

### Customer Features
- **Hierarchical Category Browsing** — Navigate medicines by main categories, subcategories, and item types
- **Global Search** — Real-time search suggestions powered by Supabase with 300ms debouncing
- **Shopping Cart** — Add/remove items, view cart totals, manage quantities
- **Prescription Management** — Upload prescriptions for Rx-required medicines (image validation, <5MB)
- **Order Checkout** — Secure order placement with delivery address and payment method selection
- **User Dashboard** — View order history, manage profile, addresses, and payment cards
- **Modern Notifications** — Toast-based alerts instead of browser alerts for better UX

### Admin Features
- **Admin Dashboard** — Comprehensive analytics with live data from Supabase
- **Medicine Inventory Management** — Add, edit, delete medicines with hierarchical categorization
- **User Management** — View users, toggle roles (Admin/User), manage account status
- **Order Management** — View all orders, update status, verify prescriptions
- **Prescription Verification** — View uploaded prescriptions directly from order details

### Technical Highlights
- **Authentication** — Role-based access control (RBAC) with loading states and email bypass for VIP users
- **Responsive Design** — Mobile-first approach with Tailwind CSS grid system
- **Real-time Sync** — Supabase integration for live data synchronization
- **Smooth Animations** — Framer Motion for polished micro-interactions
- **Protected Routes** — Auth guards for dashboard and admin pages

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19.2.5 |
| **Routing** | React Router v7 |
| **Backend/Database** | Supabase (PostgreSQL) |
| **Styling** | Tailwind CSS 3.4.19 |
| **Animations** | Framer Motion 12.38.0 |
| **Icons** | Lucide React 1.14.0 |
| **Charts** | Recharts 3.8.1 |
| **Notifications** | React Hot Toast 2.4.0 |
| **Build Tool** | Vite 8.0.10 |

---

## 📁 Project Structure

```
Edrugs-pk/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx          # Top navigation with search
│   │   │   ├── CategoryNav.jsx      # Hierarchical category menu
│   │   │   ├── SearchComponent.jsx  # Global search with live suggestions
│   │   │   ├── Login.jsx            # Auth component
│   │   │   ├── Signup.jsx           # Registration component
│   │   │   ├── Cart.jsx             # Cart management
│   │   │   ├── UserProfile.jsx      # User profile view
│   │   │   ├── Layout.jsx           # Main layout wrapper
│   │   │   ├── ErrorBoundary.jsx    # Error boundary
│   │   │   ├── ChatbotWidget.jsx    # Chatbot integration
│   │   │   ├── BlogSection.jsx      # Blog/content section
│   │   │   └── Footer.jsx           # Footer
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Homepage with hero and search
│   │   │   ├── MedicinesCatalog.jsx # Products listing with filters
│   │   │   ├── MedicineDetail.jsx   # Single product detail
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   ├── Checkout.jsx         # Order placement
│   │   │   ├── UserDashboard.jsx    # User orders & profile
│   │   │   └── AdminDashboard.jsx   # Admin management panel
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Global auth state
│   │   │   └── CartContext.jsx      # Global cart state
│   │   ├── config/
│   │   │   └── supabaseClient.js    # Supabase initialization
│   │   ├── constants/
│   │   │   └── categories.js        # Hierarchical category structure
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # Entry point
│   │   ├── index.css                # Global styles
│   │   └── App.css                  # App styles
│   ├── public/                      # Static assets
│   ├── package.json                 # Dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   └── postcss.config.js            # PostCSS config
└── server/                          # Backend (Node.js/Python)
    └── edrugs_RAG/                  # RAG (Retrieval-Augmented Generation) setup
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and npm v9+
- **Git**
- Supabase account (for database and authentication)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Syed-Ali-Ramish-Abidi/Edrugs-pk.git
   cd Edrugs-pk
   ```

2. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the `client` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview the production build locally
```

---

## 📱 Key Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured products |
| `/medicines` | Product catalog with filters |
| `/medicines/:id` | Single product details |
| `/cart` | Shopping cart |
| `/checkout` | Order placement |
| `/login` | Customer login |
| `/signup` | Customer registration |
| `/dashboard` | User order history & profile |
| `/admin` | Admin dashboard (admin only) |
| `/profile` | User profile management |

---

## 🔐 Authentication & Authorization

- **Login/Signup** — Email-based authentication via Supabase Auth
- **Role-Based Access** — Admin vs. User roles stored in profiles table
- **Protected Routes** — Use `RequireAuth` and `RequireAdmin` wrappers
- **Loading States** — Prevent redirects during role fetching
- **Email Bypass** — VIP users can bypass some restrictions

### User Roles
- **Admin** — Full access to dashboard, inventory, user management, orders
- **User** — Access to shopping, cart, orders, profile, checkout

---

## 🔍 Search & Filtering

### Global Search
- **Live Suggestions** — Query Supabase `medicines` table in real-time
- **Debouncing** — 300ms delay to optimize database queries
- **Navigation** — Redirects to `/medicines?search=query` on selection or Enter

### Category Filtering
- **Hierarchical Navigation** — Browse by main category → subcategory → item type
- **URL Params** — Filters preserved in URL (`?main=...&sub=...`)
- **Combined Search** — Filter by category AND search term simultaneously

### Responsive Grids
- Desktop: `grid-cols-4` (4 products per row)
- Tablet: `grid-cols-2` (2 products per row)
- Mobile: `grid-cols-1` (1 product per row)

---

## 💳 Checkout & Prescriptions

### Regular Medicines (OTC)
- Add to cart → Checkout → No prescription needed

### Prescription-Required Medicines (Rx)
1. Add Rx medicine to cart
2. At checkout, file upload required
3. Accepted formats: **JPG, PNG, WEBP**
4. File size limit: **< 5MB**
5. File uploaded to Supabase Storage (`prescriptions` bucket)
6. `prescription_url` saved to `orders` table
7. Admin can verify by clicking "View Prescription" in order details

---

## 📊 Admin Dashboard Features

### Overview Tab
- Total users count
- Active orders count
- Total revenue (delivered orders)
- Medicines in stock
- Revenue trend (7-day chart)

### Users Tab
- View all users with role and status
- Toggle user roles (Admin ↔ User)
- Toggle account status (Active ↔ Inactive)
- Search by name/email

### Inventory Tab
- Add new medicines with hierarchical categorization
- Edit existing medicines
- Delete medicines
- View low-stock alerts
- Search and filter by category

### Orders Tab
- View all orders
- Update order status (Pending → Processing → Shipped → Delivered)
- View customer details
- View order items and amounts
- **View prescription** if uploaded

---

## 🎨 Styling & Theme

### Color Scheme
- **Primary** — Teal (#0d9488)
- **Accent** — Emerald, Amber (for alerts)
- **Neutral** — Gray, Slate

### Components
- **Buttons** — Rounded, teal background with hover effects
- **Cards** — White with border, shadow on hover
- **Forms** — Clean inputs with focus rings
- **Modals** — Overlay with animation
- **Notifications** — Toast at top-right with icons

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🔄 State Management

### Context APIs
- **AuthContext** — User, role, loading, login/logout
- **CartContext** — Items, total, add/remove/clear

### Local Storage
- `userRole` — Cached role for faster auth checks
- Shopping cart (optional, can be added)

---

## 🚨 Error Handling

### Toast Notifications
- ✅ **Success** — Green toast (add to cart, order placed)
- ❌ **Error** — Red toast (validation, API failures)
- ℹ️ **Info** — Blue toast (status updates)

### Error Boundary
- Catches React component errors
- Displays fallback UI
- Logs errors to console

---

## 📝 Database Schema (Supabase)

### tables

**profiles** (User data)
```sql
- id (UUID, primary key)
- full_name (TEXT)
- email (TEXT)
- role (TEXT: 'user' | 'admin')
- status (TEXT: 'Active' | 'Inactive')
- created_at (TIMESTAMP)
```

**medicines** (Product catalog)
```sql
- id (UUID, primary key)
- name (TEXT)
- price (NUMERIC)
- stock (INTEGER)
- main_category (TEXT)
- sub_category (TEXT)
- item_type (TEXT)
- is_rx (BOOLEAN)
- image_url (TEXT)
- category (TEXT, deprecated)
- low_stock_threshold (INTEGER)
- created_at (TIMESTAMP)
```

**orders** (Customer orders)
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key → profiles)
- items (JSON: [{name, qty, price}, ...])
- total_amount (NUMERIC)
- delivery_address (TEXT)
- payment_method (TEXT: 'cod' | 'card')
- status (TEXT: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled')
- prescription_url (TEXT, optional)
- created_at (TIMESTAMP)
```

### Storage Buckets

**prescriptions** (Prescription images)
- Public read access
- Named: `rx-{timestamp}.{extension}`

---

## 🐛 Common Issues & Troubleshooting

### "LOADING STUCK" Message
- **Issue**: Auth state loading indefinitely
- **Solution**: Check AuthContext loading state logic, ensure Supabase client is initialized

### Prescription Upload Fails
- **Issue**: `InvalidKey` error from Supabase
- **Solution**: Ensure filename is clean (alphanumeric, hyphens, dots only)

### Search Not Working
- **Issue**: Suggestions not appearing
- **Solution**: Verify Supabase connection, check browser console for errors

### Mobile Layout Broken
- **Issue**: Cards overlapping or text cut off
- **Solution**: Ensure Tailwind classes include `sm:`, `md:` breakpoints

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Router Documentation](https://reactrouter.com/)

---

## 👥 Team & Contribution

**Project Owner:** Syed Ali Ramish Abidi

For contributions, please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'feat: add new feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

---

## 📞 Support & Contact

For issues, questions, or feedback:
- **Email**: ali.ramish1214@gmail.com
- **GitHub**: [@Syed-Ali-Ramish-Abidi](https://github.com/Syed-Ali-Ramish-Abidi)

---

**Last Updated:** May 8, 2026
**Version:** 1.0.0
