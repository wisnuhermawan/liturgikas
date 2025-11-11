# 📋 PROJECT BRIEF - Catholic Information Platform

**Project Name:** Catholic Information Platform (CIP)  
**Target Launch:** 3 Bulan (February 2026)  
**Team Size:** Solo Developer  
**Budget:** Rp 300K/bulan (~$20/month)  
**Status:** Planning Phase  
**Last Updated:** November 11, 2025  

---

## 🎯 PROJECT OVERVIEW

### **Vision Statement:**
Membangun platform informasi Katolik modern berbasis API dengan fitur lengkap seperti imankatolik.or.id, tetapi dengan teknologi terkini, UI responsive, dan architecture yang maintainable.

### **Key Objectives:**
1. ✅ Replicate ALL features dari imankatolik.or.id
2. ✅ Modern tech stack (Node.js + TypeScript + PostgreSQL)
3. ✅ Responsive UI dengan Ant Design
4. ✅ Public API dengan API key authentication
5. ✅ Launch dalam 3 bulan

---

## 👤 TEAM COMPOSITION

### **Solo Developer Profile:**
- **Role:** Full-stack Developer + DevOps
- **Responsibilities:**
  - Backend API development
  - Frontend development
  - Database design & management
  - DevOps & deployment
  - Content data import/migration
  - Testing & QA

### **Time Allocation (Per Week):**
- Development: 30-35 hours
- Testing: 3-5 hours
- DevOps/Deployment: 2-3 hours
- Documentation: 2 hours
- **Total:** 40 hours/week

---

## ⏰ TIMELINE

### **3-Month Aggressive Timeline:**

**Month 1: Foundation & Core API**
- Week 1-2: Setup + Database + Data Import
- Week 3-4: Authentication + Bible/Catechism API

**Month 2: Content System & Admin Panel**
- Week 5-6: Content API + Saints/Calendar
- Week 7-8: Admin Panel (Ant Design)

**Month 3: Public Website & Launch**
- Week 9-10: Public Website (Responsive)
- Week 11: Testing & Bug Fixes
- Week 12: Deployment & Launch

**Launch Date Target:** February 11, 2026

---

## 💰 BUDGET BREAKDOWN

### **Infrastructure (Rp 300K/month = $20/month):**

```
AWS t3.micro (Free Tier 12 months):     $0/month
AWS RDS PostgreSQL t3.micro (Free):     $0/month
AWS S3 5GB storage:                     ~$0.50/month
Cloudflare CDN (Free tier):             $0/month
Domain .or.id:                          ~$1/month
Total Month 1-12:                       ~$1.50/month
                                        ≈ Rp 24K/month

Reserve Budget:                         Rp 276K/month
```

**Strategy:** Maksimalkan AWS Free Tier (12 bulan gratis)

### **After Free Tier (Month 13+):**
```
AWS t3.micro:                           $8/month
AWS RDS db.t3.micro:                    $15/month
AWS S3 10GB:                            $0.23/month
Domain:                                 $1/month
Total:                                  ~$24/month (Rp 380K/month)
```

### **Development Tools (FREE):**
- ✅ VSCode (Free)
- ✅ GitHub (Free tier - private repo)
- ✅ Postman (Free tier)
- ✅ DBeaver (Free)
- ✅ Figma (Free tier) - for UI planning

---

## 🎨 UI/UX FRAMEWORK

### **Ant Design 5.x (antd) - Selected Framework**

**Why Ant Design 5.x:**
- ✅ **Latest Version** - v5.22+ (November 2025, actively maintained)
- ✅ **CSS-in-JS Free** - Better performance with CSS variables
- ✅ **TypeScript 5.x First** - Full type safety
- ✅ **React 18+ Compatible** - Server Components ready
- ✅ **App Router Ready** - Works with Next.js 15 App Router
- ✅ **Zero runtime overhead** - Static CSS extraction
- ✅ **Enterprise-grade** - Battle-tested by Alibaba
- ✅ **50+ Components** - Complete UI library

**Key Features:**
- Component Token System (CSS Variables)
- Dark Mode support out of box
- Tree-shaking optimization
- SSR/SSG compatible
- Accessibility (WCAG 2.1 AA)

### **Theme Configuration:**
```typescript
// app/theme.config.ts (Next.js 15 App Router)
import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff', // Catholic blue
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    
    // Catholic liturgical colors (custom tokens)
    colorLiturgicalRed: '#cf1322',
    colorLiturgicalGreen: '#52c41a',
    colorLiturgicalPurple: '#722ed1',
    colorLiturgicalWhite: '#ffffff',
    colorLiturgicalRose: '#eb2f96',
    
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontSize: 14,
    borderRadius: 6,
  },
  cssVar: true, // Enable CSS Variables for theming
  hashed: false, // Better for SSR/SSG
};
```

---

## 📊 DATA ACQUISITION STRATEGY

### **Option A: Automated Import (PREFERRED)**

**Target:** Download & import dari imankatolik.or.id otomatis

**Approach:**
1. **Web Scraping with Permission:**
   - Contact imankatolik.or.id admin
   - Request permission & blessing
   - Use Cheerio/Puppeteer untuk scraping
   - Parse HTML → JSON → PostgreSQL

2. **Data Sources:**
   ```
   Bible (73 books):
   - Source: imankatolik.or.id/alkitab/
   - Method: Scrape per book/chapter/verse
   - Validation: Cross-check with Vatican sources
   
   Catechism (2,865 paragraphs):
   - Source: imankatolik.or.id/katekismus.php
   - Method: Loop through paragraph 1-2865
   - Validation: Match with official CCC
   
   Articles & Documents:
   - Source: imankatolik.or.id/artikel.html
   - Method: Crawl all article pages
   - Clean HTML → Markdown → Database
   
   Saints & Calendar:
   - Source: imankatolik.or.id/kalenderliturgi.html
   - Method: Parse calendar by year
   - Extract saint data per date
   ```

3. **Scraping Script (TypeScript):**
   ```typescript
   // scripts/import-bible.ts
   async function importBible() {
     const books = await fetchBibleBooks();
     
     for (const book of books) {
       console.log(`Importing ${book.name}...`);
       
       for (let chapter = 1; chapter <= book.totalChapters; chapter++) {
         const verses = await scrapeBibleChapter(book.id, chapter);
         await saveBibleChapter(book.id, chapter, verses);
       }
     }
     
     console.log('Bible import completed!');
   }
   ```

### **Option B: Build Fresh with Permission (FALLBACK)**

**If scraping not possible:**

1. **Bible Data:**
   - Source: Vatican API atau Catholic Bible API
   - Source: Bible Gateway API (Catholic edition)
   - Manual verification per book

2. **Catechism:**
   - Source: Vatican official website
   - Download PDF → Convert to structured data
   - Manual paragraph numbering verification

3. **Articles:**
   - Write fresh content atau
   - Request content donation from imankatolik.or.id

**Timeline Impact:**
- Option A: 1 week import
- Option B: 2-3 weeks manual work

---

## 🏢 PARTNERSHIP STRATEGY

### **Independent + Approach KWI**

**Phase 1: Build Independently (Month 1-3)**
- Develop MVP without official partnership
- Maintain independence & flexibility
- Faster decision making

**Phase 2: Approach KWI (After MVP Ready)**
- Present working product
- Request blessing & endorsement
- Offer API access for KWI use
- Propose collaboration model

**Benefits:**
- ✅ Faster development (no bureaucracy)
- ✅ Demonstrate capability first
- ✅ Stronger negotiation position
- ✅ KWI more likely to support working product

**Collaboration Proposal (Post-Launch):**
```
To: Komisi Liturgi KWI

Proposal:
1. Free API access untuk website KWI
2. White-label version untuk keuskupan
3. Official endorsement dari KWI
4. Content collaboration (articles, documents)
5. Liturgical calendar data partnership

In Return:
- Official recognition
- Link from KWI website
- Content contribution
- User trust & credibility
```

---

## 🌍 HOSTING INFRASTRUCTURE

### **AWS Architecture (Budget-Optimized)**

```
┌─────────────────────────────────────────────────┐
│              AWS FREE TIER (12 months)           │
└─────────────────────────────────────────────────┘

Application Server:
├── EC2 t3.micro (750 hours/month FREE)
│   ├── 1 vCPU
│   ├── 1 GB RAM
│   ├── Linux Ubuntu 22.04 LTS
│   ├── Node.js v20 + PM2
│   └── Nginx reverse proxy

Database:
├── RDS PostgreSQL t3.micro (750 hours/month FREE)
│   ├── 1 vCPU
│   ├── 1 GB RAM
│   ├── 20 GB SSD storage (FREE)
│   └── Automated backups

File Storage:
├── S3 Standard (5 GB FREE)
│   ├── Media files (images)
│   ├── Backups
│   └── Static assets

CDN:
├── CloudFront (50 GB transfer/month FREE)
│   └── Static assets distribution

OR

├── Cloudflare (FREE tier - UNLIMITED)
│   ├── CDN global
│   ├── DDoS protection
│   ├── SSL certificate
│   └── DNS management

Monitoring:
├── CloudWatch (FREE tier)
│   ├── Metrics
│   ├── Logs
│   └── Alarms
```

### **Why AWS:**
- ✅ **12 months FREE tier** - Perfect for bootstrap
- ✅ **Scalable** - Easy to upgrade when needed
- ✅ **Reliable** - 99.99% SLA
- ✅ **Complete ecosystem** - RDS, S3, CloudFront
- ✅ **Global reach** - Fast from Indonesia
- ✅ **Well-documented** - Lots of tutorials

### **Cost Optimization:**
```typescript
// Auto-shutdown non-production instances
// Schedule: Work hours only (8AM-10PM)
// Savings: ~40% of EC2 cost

// Use S3 Intelligent Tiering
// Auto-move old files to cheaper storage
// Savings: ~50% of S3 cost

// CloudFront → Cloudflare migration
// After free tier ends
// Savings: $50-100/month on CDN
```

---

## 🚀 DEVELOPMENT PRIORITY

### **YES - Priority Order Confirmed:**

**Priority 1: API First (Week 1-6)**
```
Week 1-2:
✅ Setup project structure
✅ PostgreSQL database + migrations
✅ Data import scripts
✅ Authentication system

Week 3-4:
✅ Bible API complete
✅ Catechism API complete
✅ Basic search functionality
✅ API documentation (Swagger)

Week 5-6:
✅ Content API (articles, documents, prayers)
✅ Saints & Calendar API
✅ Media upload API
✅ API testing & optimization
```

**Priority 2: Admin Panel (Week 7-8)**
```
Week 7:
✅ Admin UI setup (Ant Design)
✅ Dashboard & statistics
✅ User management
✅ Content management (articles)

Week 8:
✅ Bible/Catechism management
✅ Saints/Calendar management
✅ Media library
✅ System settings
```

**Priority 3: Public Website (Week 9-10)**
```
Week 9:
✅ Public layout (responsive)
✅ Homepage + navigation
✅ Bible reader
✅ Catechism reader

Week 10:
✅ Content pages (articles, documents)
✅ Calendar & Saints pages
✅ Search page
✅ SEO optimization
```

**Priority 4: Testing & Launch (Week 11-12)**
```
Week 11:
✅ E2E testing
✅ Performance optimization
✅ Security audit
✅ Bug fixes

Week 12:
✅ Production deployment
✅ DNS configuration
✅ SSL setup
✅ Monitoring setup
✅ 🚀 LAUNCH!
```

---

## 🎯 RISK ASSESSMENT & MITIGATION

### **HIGH RISK:**

**1. Timeline Too Aggressive (3 months)**
- **Risk:** Solo dev, burnout, delays
- **Mitigation:**
  - Work 40h/week consistently
  - Use pre-built components (Ant Design)
  - Automated data import
  - Skip non-essential features
  - MVP first, polish later

**2. Data Import Complexity**
- **Risk:** Scraping fails, data quality issues
- **Mitigation:**
  - Contact imankatolik.or.id ASAP (Week 1)
  - Fallback: Vatican sources
  - Validation scripts
  - Manual verification critical data

**3. Budget Constraint (Rp 300K/month)**
- **Risk:** AWS free tier limits exceeded
- **Mitigation:**
  - Monitor usage daily
  - Set billing alerts ($10, $15, $20)
  - Optimize queries (reduce DB load)
  - Use Cloudflare CDN (free, unlimited)

### **MEDIUM RISK:**

**4. Solo Developer Burnout**
- **Risk:** 3 months intense work
- **Mitigation:**
  - Strict schedule: 8 hours/day, 5 days/week
  - Weekend breaks (no coding)
  - Modular development (small wins)
  - Celebrate milestones

**5. Scope Creep**
- **Risk:** Adding features not in original plan
- **Mitigation:**
  - Strict adherence to imankatolik.or.id features
  - "No" to new ideas during development
  - Post-launch roadmap for enhancements

### **LOW RISK:**

**6. Technical Stack Unfamiliarity**
- **Risk:** Learning curve for new tech
- **Mitigation:**
  - Chosen stack is mainstream (lots of docs)
  - Ant Design has great examples
  - Active community support

---

## 📊 SUCCESS METRICS

### **Launch Criteria (Week 12):**

**Must Have (MVP):**
- ✅ Bible API: 73 books, 31K verses working
- ✅ Catechism API: 2,865 paragraphs working
- ✅ Admin panel: Can CRUD all content
- ✅ Public site: All pages responsive
- ✅ Search: Working across Bible + Catechism
- ✅ API docs: Swagger fully documented
- ✅ Uptime: > 99% during testing week

**Performance Targets:**
- ✅ API response time: < 200ms (p95)
- ✅ Page load: < 3s (LCP)
- ✅ Lighthouse score: > 80
- ✅ Mobile usability: 100%

**Content Targets:**
- ✅ 73 Bible books imported
- ✅ 2,865 Catechism paragraphs imported
- ✅ 365+ Saints data imported
- ✅ 2025-2026 liturgical calendar populated
- ✅ 10+ sample articles created

---

## 📞 NEXT STEPS (IMMEDIATE)

### **Week 0 (This Week - Nov 11-17):**

**Monday-Tuesday:**
- [x] ~~Strategy document created~~ ✅
- [ ] Contact imankatolik.or.id (request permission)
- [ ] AWS account setup + Free Tier activation
- [ ] Domain registration (.or.id)

**Wednesday-Thursday:**
- [ ] Project repository setup (GitHub)
- [ ] Development environment setup
- [ ] Database schema finalization
- [ ] Import scripts prototype

**Friday:**
- [ ] PRD review & finalization
- [ ] Task breakdown creation
- [ ] Week 1 sprint planning
- [ ] Start coding! 🚀

### **Decision Points:**

**By Nov 15 (4 days):**
- ✅ Permission from imankatolik.or.id? (Yes/No)
- ✅ If Yes: Proceed with automated import
- ✅ If No: Switch to Vatican sources

**By Nov 18 (7 days):**
- ✅ First data import test completed
- ✅ Database populated with sample data
- ✅ Development environment fully working

---

## 🤝 COLLABORATION & COMMUNICATION

### **Solo Work - But Stay Connected:**

**Weekly Progress Updates:**
- Document progress setiap Jumat
- Screenshot key features
- Commit to GitHub regularly
- Maintain changelog

**Get Help When Stuck:**
- Stack Overflow (technical issues)
- GitHub Issues/Discussions
- Ant Design community
- Catholic developer communities

**Testing Feedback:**
- Friends/family untuk testing
- Local parish untuk content review
- Online Catholic community untuk beta test

---

## 📝 DOCUMENTATION PLAN

### **Documents to Create:**

**Technical Docs:**
1. ✅ `PROJECT-BRIEF.md` (This file) ✅
2. `PRD-detailed.md` (Next - 80+ pages)
3. `database-schema.sql` (Complete SQL)
4. `api-specification.yaml` (OpenAPI)
5. `development-tasks.md` (Task breakdown)
6. `deployment-guide.md` (AWS setup)

**User Docs (Post-Launch):**
7. `USER-GUIDE.md` (How to use platform)
8. `API-DOCUMENTATION.md` (For developers)
9. `ADMIN-MANUAL.md` (Content management)

---

## ✅ PROJECT BRIEF APPROVED

**Status:** ✅ APPROVED - Ready for PRD Creation

**Key Decisions Made:**
- ✅ Solo developer - 3 month timeline
- ✅ Budget: Rp 300K/month (AWS Free Tier)
- ✅ UI Framework: Ant Design
- ✅ Data: Automated import preferred
- ✅ Partnership: Independent → KWI approach
- ✅ Hosting: AWS
- ✅ Priority: API → Admin → Public

**Next Document:** `PRD-detailed.md`

**Ready to proceed?** Let's build this! 🚀

---

**Document Version:** 1.0  
**Last Updated:** November 11, 2025  
**Status:** APPROVED - Ready for Development  
**Target Launch:** February 11, 2026
