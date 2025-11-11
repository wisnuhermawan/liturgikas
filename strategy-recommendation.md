# 🎯 STRATEGY & RECOMMENDATION
## Catholic Information Platform - Modern & Pragmatic Approach

**Tanggal:** 11 November 2025  
**Prinsip:** Simple, Lightweight, Maintainable, No Over-Engineering  

---

## 📋 EXECUTIVE SUMMARY

**Tujuan Project:**
Membangun platform informasi Katolik modern dengan fitur **SAMA seperti imankatolik.or.id** tetapi dengan:
- ✅ Teknologi modern (Node.js + TypeScript + PostgreSQL)
- ✅ UI responsive & mobile-friendly
- ✅ Architecture yang clean & maintainable
- ✅ API access dengan API key
- ✅ Simple monolith (bukan microservices)

**Yang TIDAK akan dibuat:**
- ❌ Fitur social/community (forum, likes, comments)
- ❌ AI-powered search (terlalu mahal)
- ❌ Real-time chat atau messaging
- ❌ Over-engineered architecture
- ❌ Fitur yang tidak ada di imankatolik.or.id

---

## 🎯 SCOPE DEFINITION

### **✅ FITUR YANG AKAN DIBUAT** (Sama dengan imankatolik.or.id)

#### **1. Alkitab Online (Bible Module)**
```
✅ 73 Kitab (46 PL + 27 PB + Deuterokanonika)
✅ Pencarian by reference (Yohanes 3:16)
✅ Pencarian by keyword
✅ Navigasi bab/ayat
✅ Cross-references antar ayat
✅ Footnotes support
✅ Permalink per ayat
```

#### **2. Katekismus Gereja Katolik (Catechism Module)**
```
✅ 2,865 paragraf lengkap
✅ Struktur hierarkis (4 Bagian → Section → Chapter → Article → Paragraph)
✅ Pencarian by nomor paragraf
✅ Pencarian by keyword
✅ Cross-reference dengan Alkitab
✅ Navigasi hierarkis
```

#### **3. Kalender Liturgi (Liturgical Calendar)**
```
✅ Kalender liturgi tahunan
✅ Informasi hari liturgi (warna, masa, perayaan)
✅ Santo/Santa hari ini
✅ Bacaan harian
✅ Sistem tahun A/B/C dan I/II
✅ Download kalender (PDF/Excel)
```

#### **4. Artikel & Pengajaran (Content Module)**
```
✅ CRUD articles
✅ Rich text editor
✅ Kategorisasi (Doktrin, Sakramen, Moral, Liturgi, dll.)
✅ Tags
✅ Featured image
✅ SEO meta tags
✅ Draft/Publish workflow
✅ Slug auto-generate
```

#### **5. Dokumen Gereja (Church Documents)**
```
✅ Konsili Vatikan II (16 dokumen)
✅ Ensiklik & Surat Paus
✅ Kitab Hukum Kanonik
✅ Dokumen KWI
✅ Kategorisasi by type
✅ Full-text search
```

#### **6. Santo & Santa (Saints Database)**
```
✅ Database santo/santa (365+ entries)
✅ Feast days
✅ Biography
✅ Images
✅ Liturgical info
✅ Patron saints
```

#### **7. Doa-doa (Prayers Collection)**
```
✅ Doa dasar (Bapa Kami, Salam Maria, dll.)
✅ Doa liturgi
✅ Doa rosario
✅ Doa novena
✅ Doa kepada santo/santa
✅ Kategorisasi
```

#### **8. Homili (Sermons/Homilies)**
```
✅ CRUD homilies
✅ Kategorisasi by tahun liturgi (A/B/C)
✅ Kategorisasi by masa liturgi
✅ Full-text search
✅ Archiving
```

#### **9. Q&A / Tanya Jawab (Knowledge Base)**
```
✅ Pre-written Q&A entries
✅ Kategorisasi
✅ Search
✅ Cross-reference dengan Bible/Catechism
```

#### **10. Pencarian Global (Search)**
```
✅ Full-text search PostgreSQL (tsvector)
✅ Search across: Bible, Catechism, Articles, Documents
✅ Filter by content type
✅ Pagination
✅ Relevance sorting
⚠️ BUKAN AI-powered (terlalu mahal)
```

#### **11. Admin Panel**
```
✅ Dashboard statistics
✅ User management (Admin, Content Manager, Viewer)
✅ Content management (CRUD all modules)
✅ Media library
✅ System settings
✅ Backup management
```

#### **12. Authentication & Authorization**
```
✅ JWT-based auth
✅ Role-based access (RBAC)
✅ Login/Logout
✅ Profile management
✅ Password reset
✅ Optional: Google OAuth (Phase 2)
```

#### **13. API Access**
```
✅ RESTful API
✅ API Key authentication
✅ Rate limiting
✅ OpenAPI/Swagger documentation
✅ CORS configuration
✅ Public endpoints (Bible, Catechism - read only)
✅ Protected endpoints (Admin operations)
```

---

## 🏗️ ARCHITECTURE DESIGN

### **Technology Stack (Pragmatic & Modern)**

```
┌─────────────────────────────────────────────────┐
│              MONOLITH ARCHITECTURE               │
└─────────────────────────────────────────────────┘

Frontend (Admin Panel + Public Site):
├── Framework: Next.js 14+ (React + SSR/SSG)
├── UI: Tailwind CSS + shadcn/ui (customizable theme)
├── State: React Query (server state)
├── Forms: React Hook Form + Zod validation
└── Editor: TipTap (rich text editor)

Backend (Single Node.js Process):
├── Runtime: Node.js v20 LTS
├── Language: TypeScript 5.x
├── Framework: Express.js (battle-tested, simple)
├── Validation: Zod (type-safe)
└── ORM: Kysely / Drizzle (lightweight, type-safe)

Database:
├── Primary: PostgreSQL 16
│   ├── Full-text search (tsvector + GIN index)
│   ├── JSONB for flexible data
│   └── Row-level security (optional)
└── Cache: Redis 7.x (optional, for performance)

File Storage:
├── Local filesystem (development)
└── AWS S3 (production, optional)

Authentication:
├── JWT (jsonwebtoken)
├── bcrypt (password hashing)
└── Google OAuth (optional, Phase 2)

API Documentation:
└── Swagger UI Express (auto-generated)

DevOps:
├── Docker (containerization)
├── Docker Compose (local development)
├── PM2 (process manager for production)
└── Nginx (reverse proxy)
```

### **Why This Stack?**

✅ **Express.js vs Fastify:**
- Express = lebih mature, ekosistem besar, mudah hiring
- Fastify = lebih cepat, tapi learning curve lebih tinggi
- **Pilih Express** untuk stability & simplicity

✅ **PostgreSQL tanpa ORM besar (Prisma/TypeORM):**
- Kysely/Drizzle = lightweight, full TypeScript, no overhead
- Direct SQL control = optimal query performance
- Less magic = easier debugging

✅ **Next.js untuk Frontend:**
- SSR/SSG = SEO-friendly (penting untuk konten)
- File-based routing = simple
- API routes = bisa jadi BFF (Backend for Frontend)
- Image optimization built-in

✅ **Tailwind CSS + shadcn/ui:**
- Theme **TIDAK hardcoded** (bisa custom via CSS variables)
- Component-based = reusable
- No runtime JS overhead
- Modern & clean design

---

## 🗄️ DATABASE SCHEMA DESIGN

### **Prinsip Database:**
1. ✅ **Flexible Schema** - NOT hardcoded categories
2. ✅ **Normalized** - Avoid data duplication
3. ✅ **Indexed** - Full-text search ready
4. ✅ **Extensible** - Easy to add new content types

### **Core Tables:**

```sql
-- =============================================
-- 1. USERS & AUTHENTICATION
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer', -- admin, content_manager, viewer
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, inactive
    avatar_url TEXT,
    google_id VARCHAR(255) UNIQUE, -- for OAuth
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================
-- 2. BIBLE (ALKITAB)
-- =============================================
CREATE TABLE bible_books (
    id SERIAL PRIMARY KEY,
    testament VARCHAR(20) NOT NULL, -- 'OT', 'NT', 'Deuterocanonical'
    book_number INT NOT NULL,
    book_name VARCHAR(100) NOT NULL,
    book_name_english VARCHAR(100),
    book_abbrev VARCHAR(20) NOT NULL,
    total_chapters INT NOT NULL,
    category VARCHAR(50), -- Pentateuch, Historical, Wisdom, Prophets, Gospels, Epistles
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bible_chapters (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    total_verses INT NOT NULL,
    audio_url TEXT, -- optional
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(book_id, chapter_number)
);

CREATE TABLE bible_verses (
    id SERIAL PRIMARY KEY,
    chapter_id INT NOT NULL REFERENCES bible_chapters(id) ON DELETE CASCADE,
    verse_number INT NOT NULL,
    verse_text TEXT NOT NULL,
    verse_text_tsvector TSVECTOR, -- full-text search
    footnotes JSONB DEFAULT '[]',
    cross_references TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(chapter_id, verse_number)
);

CREATE INDEX idx_bible_verses_chapter ON bible_verses(chapter_id);
CREATE INDEX idx_bible_verses_search ON bible_verses USING GIN(verse_text_tsvector);

-- Auto-update tsvector trigger
CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE
ON bible_verses FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(verse_text_tsvector, 'pg_catalog.indonesian', verse_text);

-- =============================================
-- 3. CATECHISM (KGK)
-- =============================================
CREATE TABLE catechism_sections (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES catechism_sections(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL, -- part, section, chapter, article, paragraph
    section_number VARCHAR(20),
    title TEXT NOT NULL,
    content TEXT,
    paragraph_number INT UNIQUE, -- 1-2865
    bible_references TEXT[] DEFAULT '{}',
    order_index INT NOT NULL,
    content_tsvector TSVECTOR, -- full-text search
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_catechism_parent ON catechism_sections(parent_id);
CREATE INDEX idx_catechism_paragraph ON catechism_sections(paragraph_number);
CREATE INDEX idx_catechism_search ON catechism_sections USING GIN(content_tsvector);

CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE
ON catechism_sections FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(content_tsvector, 'pg_catalog.indonesian', title, content);

-- =============================================
-- 4. CONTENT SYSTEM (Flexible)
-- =============================================
-- Categories are NOT hardcoded - fully dynamic
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
    content_type VARCHAR(50), -- article, document, prayer, homily, qa
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_type ON categories(content_type);

-- Generic content table (for articles, documents, homilies, prayers, Q&A)
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL, -- article, document, homily, prayer, qa
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    body TEXT NOT NULL,
    body_tsvector TSVECTOR,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
    featured_image_url TEXT,
    
    -- Metadata (flexible JSONB)
    metadata JSONB DEFAULT '{}', -- {document_number, promulgation_date, occasion, etc}
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Taxonomy
    tags TEXT[] DEFAULT '{}',
    
    -- References
    bible_references TEXT[] DEFAULT '{}',
    catechism_references INT[] DEFAULT '{}',
    
    -- Stats
    view_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contents_type ON contents(content_type);
CREATE INDEX idx_contents_slug ON contents(slug);
CREATE INDEX idx_contents_category ON contents(category_id);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_contents_published ON contents(published_at DESC);
CREATE INDEX idx_contents_search ON contents USING GIN(body_tsvector);
CREATE INDEX idx_contents_tags ON contents USING GIN(tags);
CREATE INDEX idx_contents_metadata ON contents USING GIN(metadata);

CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE
ON contents FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(body_tsvector, 'pg_catalog.indonesian', title, excerpt, body);

-- =============================================
-- 5. SAINTS & LITURGICAL CALENDAR
-- =============================================
CREATE TABLE saints (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    feast_day_month INT CHECK (feast_day_month BETWEEN 1 AND 12),
    feast_day_date INT CHECK (feast_day_date BETWEEN 1 AND 31),
    feast_day_type VARCHAR(50), -- Solemnity, Feast, Memorial, Optional Memorial
    birth_year INT,
    death_year INT,
    biography TEXT NOT NULL,
    biography_tsvector TSVECTOR,
    patron_of TEXT[] DEFAULT '{}',
    symbols TEXT[] DEFAULT '{}',
    image_url TEXT,
    liturgical_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_saints_feast ON saints(feast_day_month, feast_day_date);
CREATE INDEX idx_saints_search ON saints USING GIN(biography_tsvector);

CREATE TABLE liturgical_calendar (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    liturgical_season VARCHAR(50), -- Advent, Christmas, Ordinary Time, Lent, Easter
    liturgical_color VARCHAR(50),
    celebration_type VARCHAR(50),
    celebration_name VARCHAR(255),
    saint_id INT REFERENCES saints(id) ON DELETE SET NULL,
    readings JSONB, -- {first_reading, psalm, second_reading, gospel}
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_liturgical_date ON liturgical_calendar(date);
CREATE INDEX idx_liturgical_season ON liturgical_calendar(liturgical_season);

-- =============================================
-- 6. MEDIA LIBRARY
-- =============================================
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    width INT,
    height INT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    alt_text TEXT,
    caption TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_media_uploader ON media(uploaded_by);
CREATE INDEX idx_media_mime ON media(mime_type);

-- =============================================
-- 7. API KEYS
-- =============================================
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_hash VARCHAR(255) NOT NULL UNIQUE, -- bcrypt hash of the key
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '[]', -- ["read:bible", "read:catechism", "write:articles"]
    rate_limit INT DEFAULT 1000, -- requests per hour
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);

-- =============================================
-- 8. SYSTEM SETTINGS (Key-Value Store)
-- =============================================
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 9. AUDIT LOG (Optional but recommended)
-- =============================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- create, update, delete, login, etc
    entity_type VARCHAR(50), -- user, content, saint, etc
    entity_id VARCHAR(255),
    changes JSONB, -- old and new values
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
```

### **Database Design Highlights:**

✅ **Flexible Categories:**
- `categories` table dengan `content_type` - TIDAK hardcoded
- Parent-child relationship untuk hierarchy
- Bisa add kategori baru tanpa schema migration

✅ **Generic Content System:**
- Single `contents` table untuk articles, documents, homilies, prayers, Q&A
- `metadata JSONB` untuk field-field spesifik per type
- Lebih mudah maintain daripada 5 table terpisah

✅ **Full-Text Search Ready:**
- `tsvector` columns dengan auto-update triggers
- GIN indexes untuk performance
- Support Bahasa Indonesia tokenization

✅ **API Keys Management:**
- Hash-based security
- Granular permissions dengan JSONB
- Rate limiting per key

---

## 🛣️ PROJECT ROADMAP

### **Phase 1: Foundation & Core API (8-10 minggu)**

#### **Week 1-2: Project Setup & Database**
- [ ] Initialize monorepo structure
- [ ] Setup TypeScript + ESLint + Prettier
- [ ] Setup PostgreSQL database
- [ ] Create all tables with migrations
- [ ] Seed Bible data (73 books)
- [ ] Seed Catechism data (2,865 paragraphs)

#### **Week 3-4: Authentication & Core API**
- [ ] JWT authentication system
- [ ] RBAC middleware
- [ ] User CRUD endpoints
- [ ] API key system
- [ ] Rate limiting middleware
- [ ] Error handling middleware

#### **Week 5-6: Bible & Catechism API**
- [ ] Bible endpoints (get by reference, search)
- [ ] Catechism endpoints (get by number, search)
- [ ] Cross-reference system
- [ ] Swagger documentation
- [ ] Unit tests

#### **Week 7-8: Content System API**
- [ ] Categories CRUD
- [ ] Contents CRUD (articles, documents, homilies)
- [ ] Media upload (local + S3 optional)
- [ ] Full-text search endpoint
- [ ] Integration tests

#### **Week 9-10: Calendar & Saints API**
- [ ] Saints CRUD
- [ ] Liturgical calendar CRUD
- [ ] Daily liturgy endpoint
- [ ] Calendar generation scripts
- [ ] API documentation finalization

**Deliverable:** Fully functional REST API with Swagger docs

---

### **Phase 2: Admin Panel (6-8 minggu)**

#### **Week 11-12: Admin UI Setup**
- [ ] Next.js project setup
- [ ] Tailwind CSS + shadcn/ui integration
- [ ] Theme system (CSS variables - NOT hardcoded)
- [ ] Layout components (Sidebar, Header, Footer)
- [ ] Authentication pages (Login, Reset Password)

#### **Week 13-14: Content Management**
- [ ] Dashboard with statistics
- [ ] User management UI
- [ ] Categories management UI
- [ ] Articles editor (TipTap)
- [ ] Media library UI

#### **Week 15-16: Bible & Catechism Management**
- [ ] Bible viewer/editor (admin only)
- [ ] Catechism viewer/editor
- [ ] Cross-reference management UI
- [ ] Search testing interface

#### **Week 17-18: Calendar & Settings**
- [ ] Saints management UI
- [ ] Liturgical calendar management
- [ ] System settings UI
- [ ] API keys management UI
- [ ] Backup/restore UI

**Deliverable:** Complete admin panel with all CRUD operations

---

### **Phase 3: Public Website (6-8 minggu)**

#### **Week 19-20: Public Site Setup**
- [ ] Next.js SSG pages setup
- [ ] Responsive layout (mobile-first)
- [ ] Homepage with quick access tools
- [ ] Navigation menu

#### **Week 21-22: Bible & Catechism Pages**
- [ ] Bible reader (responsive)
- [ ] Bible search page
- [ ] Catechism reader (hierarchical)
- [ ] Catechism search page

#### **Week 23-24: Content Pages**
- [ ] Articles listing & detail pages
- [ ] Documents listing & detail pages
- [ ] Homilies listing & detail pages
- [ ] Prayers listing page
- [ ] Q&A listing page

#### **Week 25-26: Calendar & Search**
- [ ] Daily liturgy page
- [ ] Liturgical calendar view
- [ ] Saints listing & detail pages
- [ ] Global search page
- [ ] SEO optimization (meta tags, sitemap)

**Deliverable:** Fully responsive public website

---

### **Phase 4: Testing & Deployment (2-3 minggu)**

#### **Week 27-28: Testing & QA**
- [ ] End-to-end testing (Playwright)
- [ ] Performance testing (Lighthouse)
- [ ] Security audit
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] API load testing

#### **Week 29: Deployment**
- [ ] Production database setup
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Nginx configuration
- [ ] SSL certificate setup
- [ ] Monitoring setup (optional: Sentry)

**Deliverable:** Production-ready application

---

**TOTAL TIMELINE: 6-7 BULAN** (untuk solo/small team)

---

## 💰 INFRASTRUCTURE COST ESTIMATE

### **Development Phase:**
```
Server: DigitalOcean Droplet ($12/month) atau AWS t3.small
Database: Managed PostgreSQL ($15/month) atau self-hosted
Total: ~$27/month
```

### **Production Phase (Estimated Traffic: 10K users/month):**
```
Server: AWS t3.medium atau DigitalOcean ($24/month)
Database: Managed PostgreSQL 2GB RAM ($15-30/month)
Storage: AWS S3 10GB ($0.23/month) - optional
CDN: Cloudflare (Free tier) atau AWS CloudFront ($5-10/month)
Domain: .or.id domain (~$10/year)
SSL: Let's Encrypt (FREE)

Total: $44-69/month (~Rp 700K - 1.1jt/bulan)
```

### **Alternative: Indonesian Hosting (Cheaper)**
```
Niagahoster Cloud: Rp 300K/month
or
Dewaweb Cloud: Rp 400K/month
Domain .or.id: Rp 100K/year

Total: ~Rp 300-400K/month
```

---

## 🎨 UI/UX DESIGN PRINCIPLES

### **Theme System (NOT Hardcoded)**

```css
/* CSS Variables for theming */
:root {
  /* Colors - easily customizable */
  --color-primary: 220 90% 56%;
  --color-secondary: 280 60% 50%;
  --color-accent: 340 75% 55%;
  
  --color-background: 0 0% 100%;
  --color-foreground: 222 47% 11%;
  
  /* Catholic-specific colors */
  --color-liturgical-red: 0 65% 50%;
  --color-liturgical-white: 0 0% 100%;
  --color-liturgical-green: 142 70% 45%;
  --color-liturgical-purple: 270 50% 40%;
  --color-liturgical-rose: 330 60% 65%;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Merriweather', Georgia, serif;
  
  /* Spacing */
  --spacing-unit: 0.25rem;
  
  /* Borders */
  --border-radius: 0.5rem;
}

/* Dark mode (optional) */
[data-theme="dark"] {
  --color-background: 222 47% 11%;
  --color-foreground: 0 0% 100%;
}
```

### **Responsive Breakpoints:**
```
Mobile: 0-640px (sm)
Tablet: 641-768px (md)
Desktop: 769-1024px (lg)
Wide: 1025px+ (xl)
```

### **Design References:**
- **Modern Catholic Sites:** Vatican News, USCCB, Aleteia
- **Clean UI:** Linear, Notion, Vercel
- **Component Library:** shadcn/ui (fully customizable)

---

## 🔐 SECURITY BEST PRACTICES

### **Authentication:**
```typescript
✅ JWT with short expiration (15 minutes access token)
✅ Refresh token rotation
✅ bcrypt for password hashing (cost factor 12)
✅ Password strength requirements
✅ Rate limiting login attempts (5 tries/15 minutes)
✅ CSRF protection
```

### **API Security:**
```typescript
✅ API key hashing (bcrypt)
✅ Rate limiting per API key
✅ CORS whitelist
✅ Input validation (Zod)
✅ SQL injection prevention (parameterized queries)
✅ XSS prevention (sanitize HTML input)
```

### **Infrastructure:**
```
✅ HTTPS only (SSL certificate)
✅ Security headers (helmet middleware)
✅ Environment variables for secrets (.env)
✅ Regular dependency updates
✅ Database backups (automated daily)
```

---

## 📝 CODE QUALITY STANDARDS

### **Clean Code Principles:**

```typescript
// ✅ GOOD: Clear, typed, separated concerns
interface CreateArticleInput {
  title: string;
  body: string;
  categoryId: number;
  authorId: string;
}

async function createArticle(input: CreateArticleInput): Promise<Article> {
  // Validation
  const validated = articleSchema.parse(input);
  
  // Business logic
  const slug = generateSlug(validated.title);
  
  // Database operation
  const article = await db
    .insertInto('contents')
    .values({
      content_type: 'article',
      ...validated,
      slug,
      created_at: new Date()
    })
    .returningAll()
    .executeTakeFirstOrThrow();
  
  return article;
}

// ❌ BAD: No types, mixed concerns
function save(data) {
  const s = data.title.toLowerCase().replace(/\s/g, '-');
  return db.query(`INSERT INTO contents VALUES ('${data.title}', '${s}')`);
}
```

### **File Structure (Clean Architecture):**

```
src/
├── config/           # Configuration files
├── database/         # Database connection, migrations
├── middleware/       # Express middleware
├── modules/          # Feature modules
│   ├── auth/
│   │   ├── auth.service.ts      # Business logic
│   │   ├── auth.controller.ts   # Request handlers
│   │   ├── auth.routes.ts       # Route definitions
│   │   ├── auth.schema.ts       # Validation schemas
│   │   └── auth.types.ts        # TypeScript types
│   ├── bible/
│   ├── catechism/
│   └── contents/
├── shared/           # Shared utilities
│   ├── utils/
│   ├── types/
│   └── constants/
├── app.ts            # Express app setup
└── server.ts         # Server entry point
```

### **Testing Standards:**

```typescript
// Unit test example
describe('ArticleService', () => {
  it('should create article with auto-generated slug', async () => {
    const input = {
      title: 'Sakramen Ekaristi',
      body: 'Content...',
      categoryId: 1,
      authorId: 'uuid'
    };
    
    const article = await articleService.create(input);
    
    expect(article.slug).toBe('sakramen-ekaristi');
    expect(article.status).toBe('draft');
  });
});

// Target coverage: 70-80% (pragmatic, not 100%)
```

---

## 🚀 DEPLOYMENT STRATEGY

### **Containerization (Docker):**

```dockerfile
# Dockerfile (multi-stage build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml (local development)
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/catholic
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: catholic
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### **CI/CD Pipeline (GitHub Actions):**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/catholic-api
            git pull
            npm install --production
            npm run migrate:latest
            pm2 restart catholic-api
```

---

## 📊 SUCCESS METRICS

### **Technical KPIs:**
```
✅ API Response Time (p95): < 200ms
✅ Database Query Time (p95): < 100ms
✅ Uptime: > 99.5% (< 4 hours downtime/month)
✅ Page Load Time (LCP): < 2.5s
✅ Lighthouse Score: > 90
✅ Test Coverage: > 70%
```

### **Business KPIs:**
```
✅ Daily Active Users (DAU): Track growth
✅ API Calls per Day: Monitor usage
✅ Most Searched Content: Understand user needs
✅ Content Growth: Articles published per month
✅ Uptime SLA: 99.5%+ achieved
```

---

## 🎯 NEXT STEPS

### **To Create Comprehensive PRD, I Need Your Answers:**

1. **👥 Team Composition:**
   - Solo developer atau ada team?
   - Skill level: Junior, Mid, Senior?

2. **⏰ Timeline:**
   - Target launch: 3 bulan? 6 bulan? 1 tahun?
   - Deadline keras atau flexible?

3. **💰 Budget:**
   - Infrastructure budget: Rp 300K/bulan? Rp 1jt/bulan?
   - Development budget: Bootstrap (Rp 0) atau ada?

4. **🎨 Design:**
   - Ada designer atau need design templates?
   - Brand colors preference?

5. **📊 Data Source:**
   - Import dari imankatolik.or.id (dengan permission)?
   - atau Build fresh dari Vatican sources?

6. **🏢 Partnership:**
   - Independent project atau mau approach KWI?
   - Perlu blessing dari hierarki Gereja?

7. **🌍 Hosting Preference:**
   - Indonesia hosting (Niagahoster, Dewaweb)?
   - atau International (AWS, DigitalOcean)?

8. **📱 Phase Priority:**
   - API first → Admin → Public?
   - atau Public → Admin → API?

---

## 💡 MY RECOMMENDATIONS

### **✅ Start Strategy:**

1. **Week 1-2: PRD Finalization**
   - Answer questions above
   - Define exact scope
   - Create detailed project plan

2. **Week 3-4: Data Acquisition**
   - Research Bible sources (Catholic Bible API, Vatican)
   - Research Catechism sources
   - Plan data import strategy

3. **Week 5: Proof of Concept**
   - Build minimal API (Bible only)
   - Test PostgreSQL full-text search
   - Validate architecture decisions

4. **Week 6+: Full Development**
   - Follow roadmap Phase 1 → 2 → 3

### **✅ Risk Mitigation:**

**Risk: Data Import Complexity**
→ Solution: Use Vatican official sources, validate thoroughly

**Risk: Scope Creep**
→ Solution: Strict adherence to imankatolik.or.id features only

**Risk: Performance Issues**
→ Solution: PostgreSQL tuning, Redis caching, CDN

**Risk: Solo Developer Burnout**
→ Solution: Realistic timeline (6-7 months), modular development

---

## 📞 READY FOR PRD?

Saya siap membuat **PRD Super Detail** (80-100 halaman) yang mencakup:

✅ User Stories (50+)  
✅ API Specifications (OpenAPI format)  
✅ Database Schema (ERD + SQL)  
✅ UI Wireframes descriptions  
✅ Technical Architecture Diagrams  
✅ Development Checklist (200+ tasks)  
✅ Testing Strategy  
✅ Deployment Guide  
✅ Risk Analysis  
✅ Budget Breakdown  

**Tapi saya BUTUH Anda jawab 8 pertanyaan di atas dulu!**

Setelah Anda jawab, saya akan create:
1. `PRD-detailed.md` (Product Requirements Document)
2. `database-schema.sql` (Complete SQL schema)
3. `api-specification.yaml` (OpenAPI 3.0 spec)
4. `development-tasks.md` (Detailed task breakdown)

**Deal?** 🤝

Jawab pertanyaan-pertanyaan saya, dan kita buat PRD yang **actionable & realistic**! 🚀
