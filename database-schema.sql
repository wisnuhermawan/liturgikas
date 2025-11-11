-- ============================================================================
-- CATHOLIC INFORMATION PLATFORM - DATABASE SCHEMA
-- ============================================================================
-- Database: PostgreSQL 16+
-- Encoding: UTF-8
-- Author: Catholic Information Platform Team
-- Version: 1.0
-- Last Updated: November 11, 2025
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full-text search extension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Unaccent extension for better search (optional)
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'content_manager', 'viewer');

-- User status
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'inactive');

-- Content status
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- Content type
CREATE TYPE content_type AS ENUM (
    'article',
    'document',
    'prayer',
    'homily',
    'qa',
    'page'
);

-- Document type
CREATE TYPE document_type AS ENUM (
    'vatican_ii',
    'encyclical',
    'apostolic_letter',
    'apostolic_exhortation',
    'motu_proprio',
    'other'
);

-- Liturgical season
CREATE TYPE liturgical_season AS ENUM (
    'advent',
    'christmas',
    'ordinary_time',
    'lent',
    'easter',
    'pentecost'
);

-- Liturgical color
CREATE TYPE liturgical_color AS ENUM (
    'white',
    'red',
    'green',
    'purple',
    'rose',
    'black'
);

-- Liturgical rank
CREATE TYPE liturgical_rank AS ENUM (
    'solemnity',
    'feast',
    'memorial',
    'optional_memorial',
    'feria',
    'sunday'
);

-- Bible testament
CREATE TYPE bible_testament AS ENUM (
    'old_testament',
    'new_testament',
    'deuterocanonical'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Users Table
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'viewer',
    status user_status NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ----------------------------------------------------------------------------
-- Sessions Table (for refresh tokens)
-- ----------------------------------------------------------------------------
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- ----------------------------------------------------------------------------
-- API Keys Table
-- ----------------------------------------------------------------------------
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for api_keys
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- ----------------------------------------------------------------------------
-- Bible Books Table
-- ----------------------------------------------------------------------------
CREATE TABLE bible_books (
    id SERIAL PRIMARY KEY,
    book_number INTEGER UNIQUE NOT NULL,
    name_indonesian VARCHAR(100) NOT NULL,
    name_english VARCHAR(100) NOT NULL,
    abbreviation VARCHAR(10) NOT NULL,
    testament bible_testament NOT NULL,
    category VARCHAR(50) NOT NULL, -- Pentateuch, Historical, Wisdom, Prophets, Gospels, Epistles
    total_chapters INTEGER NOT NULL,
    author VARCHAR(255),
    writing_period VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for bible_books
CREATE INDEX idx_bible_books_testament ON bible_books(testament);
CREATE INDEX idx_bible_books_category ON bible_books(category);

-- ----------------------------------------------------------------------------
-- Bible Chapters Table
-- ----------------------------------------------------------------------------
CREATE TABLE bible_chapters (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    total_verses INTEGER NOT NULL,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, chapter_number)
);

-- Indexes for bible_chapters
CREATE INDEX idx_bible_chapters_book_id ON bible_chapters(book_id);

-- ----------------------------------------------------------------------------
-- Bible Verses Table
-- ----------------------------------------------------------------------------
CREATE TABLE bible_verses (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER NOT NULL REFERENCES bible_chapters(id) ON DELETE CASCADE,
    verse_number INTEGER NOT NULL,
    text TEXT NOT NULL,
    footnotes TEXT,
    cross_references JSONB, -- Array of verse references
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chapter_id, verse_number)
);

-- Indexes for bible_verses
CREATE INDEX idx_bible_verses_chapter_id ON bible_verses(chapter_id);

-- Full-text search index for Bible verses
CREATE INDEX idx_bible_verses_text_fts ON bible_verses 
    USING gin(to_tsvector('indonesian', text));

-- Trigram index for similarity search
CREATE INDEX idx_bible_verses_text_trgm ON bible_verses 
    USING gin(text gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- Catechism Structure Table
-- ----------------------------------------------------------------------------
CREATE TABLE catechism_structure (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES catechism_structure(id) ON DELETE CASCADE,
    level INTEGER NOT NULL, -- 1=Part, 2=Section, 3=Chapter, 4=Article
    order_index INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    paragraph_start INTEGER,
    paragraph_end INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for catechism_structure
CREATE INDEX idx_catechism_structure_parent_id ON catechism_structure(parent_id);
CREATE INDEX idx_catechism_structure_level ON catechism_structure(level);

-- ----------------------------------------------------------------------------
-- Catechism Paragraphs Table
-- ----------------------------------------------------------------------------
CREATE TABLE catechism_paragraphs (
    id SERIAL PRIMARY KEY,
    paragraph_number INTEGER UNIQUE NOT NULL, -- 1 to 2865
    structure_id INTEGER REFERENCES catechism_structure(id),
    title VARCHAR(500),
    content TEXT NOT NULL,
    bible_references JSONB, -- Array of verse references
    cross_references JSONB, -- Array of other paragraph numbers
    in_brief BOOLEAN DEFAULT FALSE, -- "In Brief" summary paragraphs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for catechism_paragraphs
CREATE INDEX idx_catechism_paragraphs_structure_id ON catechism_paragraphs(structure_id);
CREATE INDEX idx_catechism_paragraphs_number ON catechism_paragraphs(paragraph_number);

-- Full-text search index for Catechism
CREATE INDEX idx_catechism_paragraphs_content_fts ON catechism_paragraphs 
    USING gin(to_tsvector('indonesian', content));

-- Trigram index for similarity search
CREATE INDEX idx_catechism_paragraphs_content_trgm ON catechism_paragraphs 
    USING gin(content gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- Categories Table (Dynamic - NOT hardcoded)
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content_type content_type NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for categories
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_content_type ON categories(content_type);

-- ----------------------------------------------------------------------------
-- Contents Table (Generic - for articles, documents, prayers, homilies, Q&A)
-- ----------------------------------------------------------------------------
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type content_type NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    body TEXT NOT NULL,
    featured_image TEXT,
    author_id UUID REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    status content_status NOT NULL DEFAULT 'draft',
    
    -- SEO fields
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    
    -- Document-specific fields (for document content_type)
    document_type document_type,
    document_number VARCHAR(50),
    promulgation_date DATE,
    source_url TEXT,
    
    -- Flexible metadata (JSONB for extensibility)
    metadata JSONB DEFAULT '{}'::jsonb, -- tags, custom fields, etc.
    
    -- Bible/Catechism references
    bible_references JSONB,
    catechism_references JSONB,
    
    -- Publishing
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    
    -- View counter
    view_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes for contents
CREATE INDEX idx_contents_content_type ON contents(content_type);
CREATE INDEX idx_contents_slug ON contents(slug);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_contents_author_id ON contents(author_id);
CREATE INDEX idx_contents_category_id ON contents(category_id);
CREATE INDEX idx_contents_published_at ON contents(published_at);

-- Full-text search index for contents
CREATE INDEX idx_contents_title_body_fts ON contents 
    USING gin(to_tsvector('indonesian', title || ' ' || body));

-- Trigram index for similarity search
CREATE INDEX idx_contents_title_trgm ON contents 
    USING gin(title gin_trgm_ops);

-- JSONB indexes for metadata
CREATE INDEX idx_contents_metadata ON contents USING gin(metadata);

-- ----------------------------------------------------------------------------
-- Tags Table
-- ----------------------------------------------------------------------------
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for tags
CREATE INDEX idx_tags_slug ON tags(slug);

-- ----------------------------------------------------------------------------
-- Content Tags (Many-to-Many)
-- ----------------------------------------------------------------------------
CREATE TABLE content_tags (
    content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (content_id, tag_id)
);

-- Indexes for content_tags
CREATE INDEX idx_content_tags_content_id ON content_tags(content_id);
CREATE INDEX idx_content_tags_tag_id ON content_tags(tag_id);

-- ----------------------------------------------------------------------------
-- Saints Table
-- ----------------------------------------------------------------------------
CREATE TABLE saints (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255), -- Martyr, Bishop, Doctor of the Church, etc.
    feast_day_month INTEGER NOT NULL CHECK (feast_day_month BETWEEN 1 AND 12),
    feast_day_date INTEGER NOT NULL CHECK (feast_day_date BETWEEN 1 AND 31),
    feast_rank liturgical_rank,
    liturgical_color liturgical_color,
    birth_year INTEGER,
    death_year INTEGER,
    biography TEXT NOT NULL,
    patron_of TEXT[], -- Array of patronages
    symbols TEXT[], -- Array of symbols
    image_url TEXT,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(feast_day_month, feast_day_date, name)
);

-- Indexes for saints
CREATE INDEX idx_saints_feast_day ON saints(feast_day_month, feast_day_date);
CREATE INDEX idx_saints_name ON saints(name);

-- Full-text search index for saints
CREATE INDEX idx_saints_biography_fts ON saints 
    USING gin(to_tsvector('indonesian', name || ' ' || biography));

-- ----------------------------------------------------------------------------
-- Liturgical Calendar Table
-- ----------------------------------------------------------------------------
CREATE TABLE liturgical_calendar (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    year INTEGER NOT NULL,
    liturgical_year CHAR(1) NOT NULL, -- A, B, or C
    season liturgical_season NOT NULL,
    week_number INTEGER, -- Week in Ordinary Time, Advent, etc.
    rank liturgical_rank NOT NULL,
    liturgical_color liturgical_color NOT NULL,
    celebration_name VARCHAR(500) NOT NULL,
    saint_id INTEGER REFERENCES saints(id),
    is_solemnity BOOLEAN DEFAULT FALSE,
    is_holy_day_of_obligation BOOLEAN DEFAULT FALSE,
    
    -- Readings
    first_reading_ref VARCHAR(100),
    psalm_ref VARCHAR(100),
    second_reading_ref VARCHAR(100),
    gospel_ref VARCHAR(100),
    
    -- Notes
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for liturgical_calendar
CREATE INDEX idx_liturgical_calendar_date ON liturgical_calendar(date);
CREATE INDEX idx_liturgical_calendar_year ON liturgical_calendar(year);
CREATE INDEX idx_liturgical_calendar_season ON liturgical_calendar(season);
CREATE INDEX idx_liturgical_calendar_saint_id ON liturgical_calendar(saint_id);

-- ----------------------------------------------------------------------------
-- Media Library Table
-- ----------------------------------------------------------------------------
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL, -- bytes
    width INTEGER, -- for images
    height INTEGER, -- for images
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text VARCHAR(255),
    caption TEXT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for media
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_media_mime_type ON media(mime_type);

-- ----------------------------------------------------------------------------
-- Audit Logs Table
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT
    entity_type VARCHAR(50) NOT NULL, -- users, contents, saints, etc.
    entity_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ----------------------------------------------------------------------------
-- Settings Table (Key-Value Store)
-- ----------------------------------------------------------------------------
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Can be accessed by public API
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Update updated_at timestamp automatically
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Increment tag usage count
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Decrement tag usage count
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION decrement_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Auto-generate slug from title
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_slug(text_value TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                unaccent(text_value),
                '[^a-zA-Z0-9\s-]', '', 'g'
            ),
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at on users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on api_keys
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on bible_books
CREATE TRIGGER update_bible_books_updated_at BEFORE UPDATE ON bible_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on bible_chapters
CREATE TRIGGER update_bible_chapters_updated_at BEFORE UPDATE ON bible_chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on bible_verses
CREATE TRIGGER update_bible_verses_updated_at BEFORE UPDATE ON bible_verses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on catechism_structure
CREATE TRIGGER update_catechism_structure_updated_at BEFORE UPDATE ON catechism_structure
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on catechism_paragraphs
CREATE TRIGGER update_catechism_paragraphs_updated_at BEFORE UPDATE ON catechism_paragraphs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on categories
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on contents
CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on saints
CREATE TRIGGER update_saints_updated_at BEFORE UPDATE ON saints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on liturgical_calendar
CREATE TRIGGER update_liturgical_calendar_updated_at BEFORE UPDATE ON liturgical_calendar
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on settings
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tag usage count triggers
CREATE TRIGGER increment_tag_usage_trigger AFTER INSERT ON content_tags
    FOR EACH ROW EXECUTE FUNCTION increment_tag_usage();

CREATE TRIGGER decrement_tag_usage_trigger AFTER DELETE ON content_tags
    FOR EACH ROW EXECUTE FUNCTION decrement_tag_usage();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Bible Verses with Full Reference View
-- ----------------------------------------------------------------------------
CREATE VIEW bible_verses_full AS
SELECT 
    bv.id,
    bv.verse_number,
    bv.text,
    bv.footnotes,
    bv.cross_references,
    bc.chapter_number,
    bb.name_indonesian AS book_name,
    bb.abbreviation AS book_abbreviation,
    bb.testament,
    CONCAT(bb.abbreviation, ' ', bc.chapter_number, ':', bv.verse_number) AS reference
FROM bible_verses bv
JOIN bible_chapters bc ON bv.chapter_id = bc.id
JOIN bible_books bb ON bc.book_id = bb.id;

-- ----------------------------------------------------------------------------
-- Contents with Author and Category View
-- ----------------------------------------------------------------------------
CREATE VIEW contents_full AS
SELECT 
    c.*,
    u.full_name AS author_name,
    cat.name AS category_name,
    cat.slug AS category_slug,
    ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL) AS tags
FROM contents c
LEFT JOIN users u ON c.author_id = u.id
LEFT JOIN categories cat ON c.category_id = cat.id
LEFT JOIN content_tags ct ON c.id = ct.content_id
LEFT JOIN tags t ON ct.tag_id = t.id
GROUP BY c.id, u.full_name, cat.name, cat.slug;

-- ----------------------------------------------------------------------------
-- Today's Liturgy View
-- ----------------------------------------------------------------------------
CREATE VIEW todays_liturgy AS
SELECT 
    lc.*,
    s.name AS saint_name,
    s.biography AS saint_biography,
    s.image_url AS saint_image
FROM liturgical_calendar lc
LEFT JOIN saints s ON lc.saint_id = s.id
WHERE lc.date = CURRENT_DATE;

-- ----------------------------------------------------------------------------
-- Saints Calendar View (All feast days)
-- ----------------------------------------------------------------------------
CREATE VIEW saints_calendar AS
SELECT 
    s.id,
    s.name,
    s.title,
    s.feast_day_month,
    s.feast_day_date,
    s.feast_rank,
    s.liturgical_color,
    s.image_url,
    TO_DATE(
        EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-' || 
        LPAD(s.feast_day_month::TEXT, 2, '0') || '-' || 
        LPAD(s.feast_day_date::TEXT, 2, '0'),
        'YYYY-MM-DD'
    ) AS next_feast_date
FROM saints s
ORDER BY s.feast_day_month, s.feast_day_date;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Default Admin User (password: Admin123!)
-- ----------------------------------------------------------------------------
INSERT INTO users (username, email, password_hash, full_name, role, status, email_verified)
VALUES (
    'admin',
    'admin@catholic-platform.or.id',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5CwhjKZN/C6CO', -- hashed: Admin123!
    'System Administrator',
    'admin',
    'active',
    TRUE
);

-- ----------------------------------------------------------------------------
-- Default Settings
-- ----------------------------------------------------------------------------
INSERT INTO settings (key, value, description, is_public) VALUES
('site_name', '"Catholic Information Platform"', 'Website name', TRUE),
('site_description', '"Platform informasi Katolik modern dengan Alkitab, Katekismus, dan sumber daya iman lainnya"', 'Website description', TRUE),
('site_url', '"https://catholic-platform.or.id"', 'Website URL', TRUE),
('api_rate_limit', '1000', 'Default API rate limit per hour', FALSE),
('maintenance_mode', 'false', 'Enable maintenance mode', FALSE),
('contact_email', '"info@catholic-platform.or.id"', 'Contact email', TRUE),
('google_analytics_id', '""', 'Google Analytics tracking ID', FALSE),
('facebook_app_id', '""', 'Facebook App ID for sharing', FALSE),
('max_upload_size', '5242880', 'Maximum file upload size in bytes (5MB)', FALSE),
('allowed_mime_types', '["image/jpeg", "image/png", "image/webp", "application/pdf"]', 'Allowed file MIME types', FALSE);

-- ----------------------------------------------------------------------------
-- Default Categories (Examples - can be customized)
-- ----------------------------------------------------------------------------
INSERT INTO categories (name, slug, description, content_type, order_index) VALUES
-- Articles categories
('Pengajaran Gereja', 'pengajaran-gereja', 'Artikel tentang ajaran Gereja Katolik', 'article', 1),
('Spiritualitas', 'spiritualitas', 'Artikel tentang kehidupan spiritual', 'article', 2),
('Sakramen', 'sakramen', 'Artikel tentang tujuh sakramen', 'article', 3),
('Liturgi', 'liturgi', 'Artikel tentang liturgi dan perayaan', 'article', 4),
('Santo Santa', 'santo-santa', 'Artikel tentang kehidupan para kudus', 'article', 5),

-- Document categories
('Konsili Vatikan II', 'konsili-vatikan-ii', 'Dokumen Konsili Vatikan II', 'document', 1),
('Ensiklik', 'ensiklik', 'Surat ensiklik dari para Paus', 'document', 2),
('Katekese', 'katekese', 'Katekese dari para Paus', 'document', 3),

-- Prayer categories
('Doa Harian', 'doa-harian', 'Doa-doa harian', 'prayer', 1),
('Doa Devosi', 'doa-devosi', 'Doa devosi khusus', 'prayer', 2),
('Rosario', 'rosario', 'Doa Rosario', 'prayer', 3),

-- Homily categories
('Minggu', 'minggu', 'Homili untuk Minggu', 'homily', 1),
('Perayaan Khusus', 'perayaan-khusus', 'Homili untuk perayaan khusus', 'homily', 2);

-- ============================================================================
-- SAMPLE QUERIES
-- ============================================================================

-- Example: Search Bible verses
-- SELECT * FROM bible_verses_full 
-- WHERE to_tsvector('indonesian', text) @@ to_tsquery('indonesian', 'kasih & Allah');

-- Example: Search Catechism
-- SELECT * FROM catechism_paragraphs 
-- WHERE to_tsvector('indonesian', content) @@ to_tsquery('indonesian', 'Ekaristi');

-- Example: Get today's liturgy
-- SELECT * FROM todays_liturgy;

-- Example: Get saint by feast day
-- SELECT * FROM saints WHERE feast_day_month = 12 AND feast_day_date = 25;

-- Example: Global search
-- SELECT 'bible' AS source, reference AS title, text AS excerpt 
-- FROM bible_verses_full 
-- WHERE to_tsvector('indonesian', text) @@ to_tsquery('indonesian', 'kasih')
-- UNION ALL
-- SELECT 'catechism' AS source, 'Paragraph ' || paragraph_number AS title, 
--        LEFT(content, 200) AS excerpt
-- FROM catechism_paragraphs 
-- WHERE to_tsvector('indonesian', content) @@ to_tsquery('indonesian', 'kasih')
-- UNION ALL
-- SELECT 'article' AS source, title, excerpt 
-- FROM contents_full 
-- WHERE content_type = 'article' AND status = 'published'
-- AND to_tsvector('indonesian', title || ' ' || body) @@ to_tsquery('indonesian', 'kasih');

-- ============================================================================
-- PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Analyze tables for query planner
ANALYZE users;
ANALYZE bible_books;
ANALYZE bible_chapters;
ANALYZE bible_verses;
ANALYZE catechism_structure;
ANALYZE catechism_paragraphs;
ANALYZE categories;
ANALYZE contents;
ANALYZE saints;
ANALYZE liturgical_calendar;

-- ============================================================================
-- BACKUP COMMANDS
-- ============================================================================

-- Create backup:
-- pg_dump -U postgres -d catholic_platform -F c -f backup_$(date +%Y%m%d).dump

-- Restore backup:
-- pg_restore -U postgres -d catholic_platform -c backup_20250111.dump

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
