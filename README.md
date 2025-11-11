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

# Edit .env and update DATABASE_URL
```

### 3. Run Development

```bash
# Start all apps (API + Admin + Web)
pnpm dev

# Or start individually
pnpm dev --filter=api      # http://localhost:3000
pnpm dev --filter=admin    # http://localhost:3002
pnpm dev --filter=web      # http://localhost:3001
```

### 4. Build for Production

```bash
# Build all apps
pnpm build

# Start production server
pnpm start
```

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
