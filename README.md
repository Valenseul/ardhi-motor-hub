# 🚗 Ardhi-Motor

> A company profile website with a used car catalog and WhatsApp integration for Ardhi Motor showroom.

---

## 📋 About

**Ardhi-Motor** is a company profile website for a used car showroom, featuring a full vehicle catalog. Visitors can browse, search, and filter available cars, then directly contact the seller via WhatsApp.

---

## ✨ Features

- 🏠 **Company Profile** — Landing page showcasing the showroom's profile and information
- 🚘 **Car Catalog** — List of available vehicles with photos, prices, and specifications
- 🔍 **Search & Filter** — Search and filter cars by various criteria
- 💬 **WhatsApp Integration** — One-click button to contact the seller directly via WhatsApp
- 🛠️ **Admin Dashboard** — Admin panel to manage vehicle listings (add, edit, delete)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React + TypeScript |
| Routing | TanStack Router |
| Data Fetching | TanStack Query |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Build Tool | Vite |
| Deployment | Cloudflare Pages |
| UI Components | Shadcn/UI |
| Icons | Lucide React |
| Styling | Tailwind CSS |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Bun (package manager)
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/Valenseul/ardhi-motor-hub.git
cd ardhi-motor-hub

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the .env file

# Start development server
bun dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
ardhi-motor-hub/
├── src/
│   ├── components/
│   │   ├── admin/        # Admin page components
│   │   ├── site/         # Public page components
│   │   └── ui/           # UI components (Shadcn)
│   ├── routes/
│   │   ├── _admin/       # Admin dashboard routes
│   │   └── ...           # Public routes
│   └── lib/              # Utilities & queries
├── supabase/             # Supabase config & migrations
└── public/               # Static assets
```

---

## 👤 Author

**Valenseul** — [@Valenseul](https://github.com/Valenseul)

---

## 📄 License

This project is private. All rights reserved by the repository owner.
