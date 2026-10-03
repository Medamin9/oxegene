# Oxegene Coffee Shop - Complete Ordering System

A production-ready, full-stack coffee shop ordering system with customer-facing website, real-time order management, and comprehensive admin dashboard.

## Features

### Customer Website
- 🎨 **Modern Dark UI** - Glassmorphism design with violet/purple accent colors
- ☕ **Dynamic Menu** - 6 categories with 18+ specialty coffee & food items
- 🛒 **Advanced Cart System** - Product customization, size selection, milk options, extras
- 📱 **Fully Responsive** - Mobile-first design (360px - 1440px)
- 🎯 **Order Modes** - Dine-in with table selection or takeaway
- ✨ **Smooth Animations** - Glass effects, transitions, backdrop blur

### Admin Dashboard
- 📊 **Real-time Dashboard** - Live stats, revenue, pending orders
- 📦 **Order Management** - Status workflow, filters, search, auto-refresh
- 🍰 **Menu CRUD** - Full product & category management
- 📝 **Content Management** - Edit hero, about, contact sections
- 💬 **Messages** - Contact form submissions
- ⚙️ **Settings** - Shop configuration, password management

### Technical Features
- 🔒 **Secure Authentication** - JWT with httpOnly cookies
- 🛡️ **Security** - Helmet, CORS, rate limiting, input validation (Zod)
- 🗄️ **PostgreSQL Database** - Normalized schema with Prisma ORM
- 🚀 **Modern Stack** - React + Vite, Express, React Query
- 📦 **State Management** - Context API with localStorage persistence
- 🎨 **Tailwind CSS** - Custom design tokens matching DESIGN.md

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router v6
- React Query (data fetching & caching)
- Tailwind CSS (custom design system)
- Context API (cart state)

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT authentication
- Bcrypt (password hashing)
- Zod (validation)
- Helmet, CORS, Rate limiting

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm or yarn

## Installation

### 1. Clone and Install Dependencies

```powershell
# Install dependencies
npm install
```

### 2. Setup Environment Variables

Create `.env` file from example:

```powershell
Copy-Item .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/oxegene_coffee"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
ADMIN_EMAIL="admin@oxegene.coffee"
ADMIN_PASSWORD="Admin123!ChangeMe"
PORT=3000
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
```

### 3. Setup Database

```powershell
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run seed
```

This will create:
- Admin user (credentials from .env)
- 6 menu categories
- 18 products (from code.html)
- Site content sections
- Settings

### 4. Run Development Servers

```powershell
# Run both frontend and backend
npm run dev

# Or run separately:
npm run client  # Frontend only (http://localhost:5173)
npm run server  # Backend only (http://localhost:3000)
```

### 5. Access the Application

- **Customer Website:** http://localhost:5173
- **Admin Dashboard:** http://localhost:5173/admin/login
- **Admin Credentials:** Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`

## Project Structure

```
oxegene-coffee-shop/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── public/    # Customer-facing components
│   │   │   └── admin/     # Admin components
│   │   ├── context/       # React Context (CartContext)
│   │   ├── layouts/       # PublicLayout, AdminLayout
│   │   ├── pages/         # Route pages
│   │   ├── utils/         # API utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/                # Express backend
│   ├── db/
│   │   └── seed.js       # Database seed script
│   ├── middleware/
│   │   ├── auth.js       # JWT authentication
│   │   └── validate.js   # Zod validation
│   ├── routes/
│   │   ├── auth.js       # Login/logout
│   │   ├── menu.js       # Public menu API
│   │   ├── content.js    # Site content API
│   │   ├── orders.js     # Order creation
│   │   ├── messages.js   # Contact messages
│   │   └── admin.js      # Admin CRUD operations
│   └── index.js          # Express server
├── prisma/
│   └── schema.prisma     # Database schema
├── .env.example
├── package.json
├── tailwind.config.js    # Design tokens
├── vite.config.js
└── README.md
```

## Database Schema

- **users** - Admin authentication
- **categories** - Menu categories
- **products** - Menu items with prices, images, descriptions
- **orders** - Customer orders with order number
- **order_items** - Line items with customizations
- **site_content** - Dynamic site content (JSONB)
- **gallery_images** - Photo gallery
- **testimonials** - Customer reviews
- **messages** - Contact form submissions
- **settings** - Shop configuration

## API Endpoints

### Public Routes
- `POST /api/auth/login` - Admin login
- `GET /api/menu` - Get all categories with products
- `GET /api/content` - Get site content
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderNumber` - Get order details
- `POST /api/messages` - Submit contact message

### Admin Routes (JWT Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/orders` - List orders (filters, pagination)
- `PATCH /api/admin/orders/:id` - Update order status
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/categories` - List categories
- `GET /api/admin/content` - Get all content
- `PATCH /api/admin/content/:key` - Update content
- `GET /api/admin/messages` - List messages
- `PATCH /api/admin/settings/:key` - Update settings

## Development Scripts

```powershell
# Development (both servers)
npm run dev

# Frontend only
npm run client

# Backend only
npm run server

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run seed          # Seed database
npx prisma migrate dev # Run migrations
npx prisma studio     # Open Prisma Studio (DB GUI)
```

## Production Deployment

### 1. Build Frontend

```powershell
npm run build
```

This creates optimized static files in `/dist`.

### 2. Set Environment Variables

```env
NODE_ENV=production
DATABASE_URL="your-production-db-url"
JWT_SECRET="strong-random-secret"
PORT=3000
```

### 3. Run Database Migrations

```powershell
npx prisma migrate deploy
```

### 4. Start Server

```powershell
npm start
```

The server will serve both API and static frontend files.

## Customization

### Design Tokens

All colors, fonts, and spacing are defined in `tailwind.config.js` matching `DESIGN.md`:

- **Colors:** Surface variants, primary (violet), secondary (lavender), tertiary (cyan)
- **Typography:** Outfit (headings), Plus Jakarta Sans (body)
- **Spacing:** 8pt grid system
- **Effects:** 3 levels of glassmorphism with backdrop blur

### Adding Products

1. **Via Admin Dashboard:** Login → Menu → Add Product
2. **Via Seed File:** Edit `server/db/seed.js` and run `npm run seed`

### Modifying Content

1. **Via Admin Dashboard:** Login → Content
2. **Via Database:** Update `site_content` table directly

## Security Considerations

- ✅ JWT tokens stored in httpOnly cookies
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma parameterized queries)
- ✅ XSS protection (React escapes by default)
- ✅ CORS configured
- ✅ Helmet security headers
- ✅ Rate limiting on API routes
- ⚠️ Change default admin password immediately
- ⚠️ Use strong JWT_SECRET in production
- ⚠️ Enable HTTPS in production

## Responsive Breakpoints

- **Mobile:** 360px - 639px
- **Tablet:** 640px - 1023px
- **Desktop:** 1024px - 1439px
- **Large Desktop:** 1440px+

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

## Troubleshooting

### Database Connection Error
```powershell
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Test connection:
npx prisma db pull
```

### Port Already in Use
```powershell
# Change PORT in .env or:
# Kill process:
# Windows: Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Prisma Client Error
```powershell
# Regenerate Prisma client
npx prisma generate
```

## License

MIT License - See LICENSE file for details

## Credits

- Design System: Based on Material Design 3 principles
- Icons: Material Symbols
- Fonts: Google Fonts (Outfit, Plus Jakarta Sans)
- Content: Oxegene Coffee (fictional specialty coffee shop)

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ☕ by the Oxegene Team
