DO $$ BEGIN
 CREATE TYPE "public"."bible_testament" AS ENUM('old_testament', 'new_testament', 'deuterocanonical');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."content_status" AS ENUM('draft', 'published', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."content_type" AS ENUM('article', 'document', 'prayer', 'homily', 'qa', 'page');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."document_type" AS ENUM('vatican_ii', 'encyclical', 'apostolic_letter', 'apostolic_exhortation', 'motu_proprio', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."liturgical_color" AS ENUM('white', 'red', 'green', 'purple', 'rose', 'black');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."liturgical_rank" AS ENUM('solemnity', 'feast', 'memorial', 'optional_memorial', 'feria', 'sunday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."liturgical_season" AS ENUM('advent', 'christmas', 'ordinary_time', 'lent', 'easter', 'pentecost');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('admin', 'content_manager', 'viewer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"key_hash" varchar(255) NOT NULL,
	"permissions" text DEFAULT '[]' NOT NULL,
	"rate_limit" integer DEFAULT 1000,
	"is_active" boolean DEFAULT true,
	"last_used_at" timestamp with time zone,
	"usage_count" integer DEFAULT 0,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token_hash" varchar(255) NOT NULL,
	"user_agent" text,
	"ip_address" "inet",
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"last_used_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"role" "user_role" DEFAULT 'viewer' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"email_verified" boolean DEFAULT false,
	"email_verification_token" varchar(255),
	"password_reset_token" varchar(255),
	"password_reset_expires" timestamp with time zone,
	"last_login" timestamp with time zone,
	"login_attempts" integer DEFAULT 0,
	"locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bible_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_number" integer NOT NULL,
	"name_indonesian" varchar(100) NOT NULL,
	"name_english" varchar(100) NOT NULL,
	"abbreviation" varchar(10) NOT NULL,
	"testament" "bible_testament" NOT NULL,
	"category" varchar(50) NOT NULL,
	"total_chapters" integer NOT NULL,
	"author" varchar(255),
	"writing_period" varchar(100),
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "bible_books_book_number_unique" UNIQUE("book_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bible_chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"chapter_number" integer NOT NULL,
	"total_verses" integer NOT NULL,
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bible_cross_references" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_verse_id" integer NOT NULL,
	"to_verse_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bible_footnotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"verse_id" integer NOT NULL,
	"footnote_number" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bible_verses" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL,
	"verse_number" integer NOT NULL,
	"text" text NOT NULL,
	"search_vector" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catechism_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL,
	"article_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catechism_bible_references" (
	"id" serial PRIMARY KEY NOT NULL,
	"paragraph_id" integer NOT NULL,
	"reference" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catechism_chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"chapter_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catechism_cross_references" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_paragraph_id" integer NOT NULL,
	"to_paragraph_number" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catechism_paragraphs" (
	"id" serial PRIMARY KEY NOT NULL,
	"paragraph_number" integer NOT NULL,
	"article_id" integer,
	"text" text NOT NULL,
	"search_vector" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "catechism_paragraphs_paragraph_number_unique" UNIQUE("paragraph_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catechism_parts" (
	"id" serial PRIMARY KEY NOT NULL,
	"part_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "catechism_parts_part_number_unique" UNIQUE("part_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catechism_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"part_id" integer NOT NULL,
	"section_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"parent_id" integer,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_tags" (
	"content_id" uuid NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"excerpt" text,
	"body" text NOT NULL,
	"content_type" "content_type" NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"category_id" integer,
	"featured_image_url" varchar(500),
	"meta_title" varchar(255),
	"meta_description" text,
	"view_count" integer DEFAULT 0,
	"published_at" timestamp with time zone,
	"search_vector" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "contents_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" uuid NOT NULL,
	"document_type" "document_type" NOT NULL,
	"author" varchar(255),
	"publication_date" timestamp with time zone,
	"document_number" varchar(100),
	"external_url" varchar(500),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "documents_content_id_unique" UNIQUE("content_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_size" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"thumbnail_url" varchar(500),
	"alt" varchar(255),
	"caption" text,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prayers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" uuid NOT NULL,
	"latin_text" text,
	"is_traditional" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "prayers_content_id_unique" UNIQUE("content_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tags_name_unique" UNIQUE("name"),
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "saints" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"title" varchar(255),
	"feast_day" date NOT NULL,
	"birth_year" integer,
	"death_year" integer,
	"biography" text NOT NULL,
	"patronage" text,
	"symbols" text,
	"image_url" varchar(500),
	"search_vector" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "liturgical_calendar" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"season" "liturgical_season" NOT NULL,
	"week" integer,
	"weekday" integer NOT NULL,
	"color" "liturgical_color" NOT NULL,
	"rank" "liturgical_rank" NOT NULL,
	"title" varchar(500) NOT NULL,
	"readings" text,
	"psalm" text,
	"gospel" varchar(255),
	"saint_id" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "liturgical_calendar_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics" (
	"id" integer PRIMARY KEY NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"endpoint" varchar(255) NOT NULL,
	"method" varchar(10) NOT NULL,
	"status_code" integer NOT NULL,
	"response_time" integer,
	"api_key_id" varchar(255),
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bible_chapters" ADD CONSTRAINT "bible_chapters_book_id_bible_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."bible_books"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bible_cross_references" ADD CONSTRAINT "bible_cross_references_from_verse_id_bible_verses_id_fk" FOREIGN KEY ("from_verse_id") REFERENCES "public"."bible_verses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bible_cross_references" ADD CONSTRAINT "bible_cross_references_to_verse_id_bible_verses_id_fk" FOREIGN KEY ("to_verse_id") REFERENCES "public"."bible_verses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bible_footnotes" ADD CONSTRAINT "bible_footnotes_verse_id_bible_verses_id_fk" FOREIGN KEY ("verse_id") REFERENCES "public"."bible_verses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bible_verses" ADD CONSTRAINT "bible_verses_chapter_id_bible_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."bible_chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catechism_articles" ADD CONSTRAINT "catechism_articles_chapter_id_catechism_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."catechism_chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catechism_bible_references" ADD CONSTRAINT "catechism_bible_references_paragraph_id_catechism_paragraphs_id_fk" FOREIGN KEY ("paragraph_id") REFERENCES "public"."catechism_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catechism_chapters" ADD CONSTRAINT "catechism_chapters_section_id_catechism_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."catechism_sections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catechism_cross_references" ADD CONSTRAINT "catechism_cross_references_from_paragraph_id_catechism_paragraphs_id_fk" FOREIGN KEY ("from_paragraph_id") REFERENCES "public"."catechism_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catechism_paragraphs" ADD CONSTRAINT "catechism_paragraphs_article_id_catechism_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."catechism_articles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catechism_sections" ADD CONSTRAINT "catechism_sections_part_id_catechism_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."catechism_parts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content_tags" ADD CONSTRAINT "content_tags_content_id_contents_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."contents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content_tags" ADD CONSTRAINT "content_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contents" ADD CONSTRAINT "contents_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contents" ADD CONSTRAINT "contents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contents" ADD CONSTRAINT "contents_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_content_id_contents_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."contents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prayers" ADD CONSTRAINT "prayers_content_id_contents_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."contents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liturgical_calendar" ADD CONSTRAINT "liturgical_calendar_saint_id_saints_id_fk" FOREIGN KEY ("saint_id") REFERENCES "public"."saints"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_api_keys_user_id" ON "api_keys" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_api_keys_key_hash" ON "api_keys" USING btree ("key_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_api_keys_is_active" ON "api_keys" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_expires_at" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_status" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_bible_books_testament" ON "bible_books" USING btree ("testament");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_bible_books_category" ON "bible_books" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_bible_chapters_book_id" ON "bible_chapters" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_bible_verses_chapter_id" ON "bible_verses" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_catechism_articles_chapter_id" ON "catechism_articles" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_catechism_chapters_section_id" ON "catechism_chapters" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_catechism_paragraphs_paragraph_number" ON "catechism_paragraphs" USING btree ("paragraph_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_catechism_paragraphs_article_id" ON "catechism_paragraphs" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_catechism_sections_part_id" ON "catechism_sections" USING btree ("part_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_categories_slug" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_categories_parent_id" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_content_tags_content_id" ON "content_tags" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_content_tags_tag_id" ON "content_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contents_slug" ON "contents" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contents_content_type" ON "contents" USING btree ("content_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contents_status" ON "contents" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contents_category_id" ON "contents" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contents_published_at" ON "contents" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_documents_document_type" ON "documents" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_media_filename" ON "media" USING btree ("filename");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_media_uploaded_by" ON "media" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tags_slug" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_saints_feast_day" ON "saints" USING btree ("feast_day");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_liturgical_calendar_date" ON "liturgical_calendar" USING btree ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_liturgical_calendar_season" ON "liturgical_calendar" USING btree ("season");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_liturgical_calendar_color" ON "liturgical_calendar" USING btree ("color");