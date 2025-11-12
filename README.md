# 📖 Catholic Information Platform

Modern Catholic information platform with comprehensive API, admin panel, and public website.

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js v22 LTS
- **Language:** TypeScript 5.6
- **Framework:** Hono v4
- **ORM:** Drizzle ORM v0.34
- **Database:** PostgreSQL 16
- **Cache:** Redis 7.4 + ioredis
- **Validation:** Zod v3.23

### Frontend
- **Framework:** Next.js 15
- **UI Library:** Ant Design 5.22
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form + Zod
- **State:** TanStack Query v5

### Development
- **Package Manager:** pnpm v9.12
- **Monorepo:** Turborepo v2.2
- **Linting:** Biome v1.9
- **Testing:** Vitest v2.1 + Playwright v1.48

## 📁 Project Structure

```
catholic-platform/
├── apps/
│   ├── api/          # Hono backend API
│   ├── web/          # Next.js public website
│   └── admin/        # Next.js admin panel
├── packages/
│   ├── database/     # Drizzle ORM schema
│   ├── ui/           # Shared UI components
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configurations
└── scripts/          # Data import scripts
```

## 🛠️ Prerequisites

- Node.js v22 LTS
- pnpm v9.12+
- PostgreSQL 16
- Redis 7 (optional)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm@9.12.0

# Install dependencies
pnpm install
```

### 2. Setup Database

```bash
# Create database
createdb catholic_platform

# Copy environment variables
cp .env.example .env

# Edit .env and update DATABASE_URL and API_PORT
# Example:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/catholic_platform"
# API_PORT=4000
```

### 3. Run Migrations

```bash
# Generate and apply database migrations
cd apps/api
pnpm db:push
```

### 4. Seed Initial Data

```bash
# Seed admin user (email: admin@catholic-platform.com, password: admin123)
pnpm seed:admin

# Seed content categories
pnpm seed:categories

# Seed system settings
pnpm seed:settings

# Seed Bible books metadata (73 books)
pnpm seed:bible-books

# Or seed all at once
pnpm seed
```

### 5. Import Bible Data (Optional)

Import complete Bible text from imankatolik.or.id:

```bash
# This takes 45-60 minutes due to respectful rate limiting
pnpm import:bible
```

Or test with a single book first:
```bash
npx tsx scripts/import/test-import-chapter.ts
```

### 6. Run Development

```bash
# Start all apps (API + Admin + Web)
pnpm dev

# Or start individually
pnpm dev --filter=api      # http://localhost:4000
pnpm dev --filter=admin    # http://localhost:3001
pnpm dev --filter=web      # http://localhost:3000
```

### 7. Build for Production

```bash
# Build all apps
pnpm build

# Start production server
pnpm start
```

## 📦 Seed Scripts & Data Import

### Available Seed Scripts

Located in `scripts/seeds/`:

| Script | Command | Description |
|--------|---------|-------------|
| Admin User | `pnpm seed:admin` | Creates default admin account |
| Categories | `pnpm seed:categories` | Creates 10 content categories |
| Settings | `pnpm seed:settings` | Creates system settings |
| Bible Books | `pnpm seed:bible-books` | Creates metadata for 73 Bible books |
| All Seeds | `pnpm seed` | Runs all seed scripts in order |

### Bible Data Importer

The Bible importer (`scripts/import/bible-importer.ts`) fetches Indonesian Catholic Bible text from imankatolik.or.id:

**Features:**
- Imports all 73 books (Old Testament + Deuterocanonical + New Testament)
- Total: 1,328 chapters, ~31,000 verses
- Respectful rate limiting (2 seconds between requests)
- Automatic HTML parsing and verse extraction
- Progress tracking and error handling

**Usage:**
```bash
# Full import (45-60 minutes)
pnpm import:bible

# Test with sample chapters
npx tsx scripts/import/test-import-chapter.ts

# Verify imported data
npx tsx scripts/import/verify-import.ts
```

**Bible Structure:**
- Old Testament: 39 books (Kejadian to Maleakhi)
- Deuterocanonical: 7 books (Tobit, Yudit, Kebijaksanaan, etc.)
- New Testament: 27 books (Matius to Wahyu)

## 📚 Documentation

- [Project Brief](./PROJECT-BRIEF.md)
- [Product Requirements](./PRD-detailed.md)
- [Database Schema](./database-schema.sql)
- [API Specification](./api-specification.yaml)
- [Development Tasks](./development-tasks.md)
- [Tech Stack](./TECH-STACK-2025.md)

## 🎯 Features

### Core Content
- ✅ Bible (73 books, 31,102 verses)
- ✅ Catechism (2,865 paragraphs)
- ✅ Saints & Hagiographies (365+ profiles)
- ✅ Liturgical Calendar
- ✅ Church Documents
- ✅ Prayers
- ✅ Articles & Q&A

### Platform Features
- ✅ RESTful API with OpenAPI documentation
- ✅ JWT Authentication
- ✅ API Key management
- ✅ Full-text search
- ✅ Admin panel
- ✅ Responsive public website
- ✅ Media uploads (S3)

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Credits

Built with modern web technologies for the Catholic community.

**Target Launch:** February 11, 2026
