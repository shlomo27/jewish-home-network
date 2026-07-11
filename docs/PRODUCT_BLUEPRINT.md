# Kehila Network — Global Community Platform
## Master Blueprint & Product Requirements Document (PRD)
### Phase 1: Real Estate Marketplace (MVP)

**Document owner:** Product & Engineering Leadership
**Status:** Draft v1.0 — for internal alignment and investor diligence
**Last updated:** 2026-07-11

---

## Table of Contents

1. [Executive Summary & GTM Strategy](#1-executive-summary--gtm-strategy)
2. [Core Feature Specifications (MVP Scope)](#2-core-feature-specifications-mvp-scope)
3. [System Architecture & Tech Stack](#3-system-architecture--tech-stack)
4. [Database Schema (ERD Design)](#4-database-schema-erd-design)
5. [90-Day MVP Implementation Roadmap](#5-90-day-mvp-implementation-roadmap)
6. [Appendix: Compliance & Risk Notes](#6-appendix-compliance--risk-notes)

---

## 1. Executive Summary & GTM Strategy

### 1.1 Positioning Statement

> **Kehila Network is the trust infrastructure layer for global community-oriented real estate.**
> We are not a religious filtering tool — we are a PropTech company solving the "trust gap" in rental and sales markets by combining verified identity, dynamic infrastructure scoring, and passive AI-driven matching. Our first vertical community is the global Jewish diaspora; our architecture is a horizontal platform that can serve any affinity community (relocating professionals, students, retirees, faith communities) with the same modular core.

Legacy marketplaces (Zillow, Rightmove, Idealista, Yad2) answer **"how much does it cost?"**. They are commodity listing aggregators with declining differentiation and margin. Kehila Network answers a fundamentally different, higher-value question: **"can I build my life here, and can I trust the person on the other end of this transaction?"**

### 1.2 Why Now (Market Thesis)

- **Trust is the #1 unsolved problem in online real estate.** Fraud, ghost listings, and stock photos erode confidence; no major platform has shipped a portable, cross-listing reputation system for either landlords or tenants.
- **Affinity-driven relocation is underserved.** Diaspora, expat, and community-anchored home seekers today cobble together Facebook groups, WhatsApp chats, and word-of-mouth to find where they will feel "at home." This is a fragmented, low-trust, high-friction process ready for a structured product.
- **Legal exposure has kept incumbents out.** Fair Housing Act (US), UK Equality Act, and EU anti-discrimination law prohibit filtering housing by religion/ethnicity. This has left a gap: nobody has built a **compliant, infrastructure-based proxy** (distance to synagogues, kosher stores, language-friendly services) that delivers the same practical outcome as a "filter" without ever filtering people. This is our legal and product moat.
- **Modular data assets compound.** Property Passport™ and Landlord Passport™ create durable, defensible data assets that appreciate with time and usage — the more transactions flow through the platform, the harder we are to displace (classic two-sided-marketplace + proprietary-data moat).

### 1.3 Target Segments (Phase 1)

| Segment | Description | Primary Value Prop |
|---|---|---|
| Home Seekers (Tenants/Buyers) | Individuals/families relocating within or across cities/countries who prioritize community infrastructure | Confidence, speed, passive discovery via Property Match™ |
| Landlords / Owners | Individual property owners renting or selling | Verified, lower-friction tenant pool; reputation-building |
| Agencies / Brokers | Small-to-mid real estate agencies serving community-dense neighborhoods | Multi-listing tools, premium placement, analytics |
| Platform Admin | Internal trust & safety, compliance, ops | Fraud control, verification workflows |

### 1.4 Business Model (Phase 1 Monetization)

1. **Freemium listings** — free basic listing; paid boosts/featured placement for owners & agencies.
2. **Agency SaaS tier** — subscription for multi-agent dashboards, bulk upload, branding, analytics.
3. **Verification & Passport add-ons** — paid identity/income verification for Tenant Passport™ (optional, never required to use the platform).
4. **Lead-gen / concierge referrals (future)** — mortgage, movers, insurance partners once volume justifies it (explicitly out of scope for MVP build, but architecture should not block it).

### 1.5 Go-To-Market Strategy

- **Seed markets:** Launch in 2–3 high-density diaspora metro areas (e.g., Greater NY/NJ, London (Golders Green/Hendon), and one European or Israeli-adjacent city) to reach density-driven network effects quickly rather than spreading thin globally.
- **Supply-first bootstrapping:** Manually onboard and white-glove-verify the first 200–500 landlord/agency listings per metro before opening broad tenant acquisition — a trust platform cannot launch with a thin, unverified catalog.
- **Community-channel distribution:** Partner with local synagogues, JCCs, and community WhatsApp/Facebook groups as initial distribution (organic, low-CAC), while marketing copy and public positioning remain strictly infrastructure/lifestyle-based (never "Jewish-only housing").
- **Trust as the marketing hook:** Launch messaging leads with "verified landlords, verified listings, real photos" — trust is a universal pain point that also appeals to non-Jewish users in the same neighborhoods, keeping the top of funnel legally and reputationally clean.
- **VC narrative:** Position as "Trust-layer PropTech with a proven wedge community, expanding into a full community-commerce OS" — comparable framing to how Faire started with a wedge (independent retailers) before becoming horizontal infrastructure.

---

## 2. Core Feature Specifications (MVP Scope)

### 2.1 Real Estate Marketplace (Core)

**Functional requirements:**
- Listing creation flow for Long-Term Rental, Short-Term Rental, and For-Sale property types, each with type-specific fields (lease length & deposit vs. nightly rate & min-stay vs. sale price & closing terms).
- Rich media upload (photos, floor plans, video walkthroughs) with AI-based quality scoring (blur/lighting/staging detection) gating a listing's visibility tier.
- Structured attribute schema: property type, bedrooms/bathrooms, square footage, amenities (parking, balcony, elevator, pet-friendly, accessibility), utilities included, availability date.
- Search & filter UI: standard filters (price, beds, location) plus differentiated filters ("walking distance to Synagogue," "within 10 min of kosher supermarket," "Hebrew/French-speaking landlord").
- Map-based and list-based browsing with saved searches.
- Secure in-platform messaging between seeker and owner/agent (no phone/email exposed until both parties opt in), with message-based fraud pattern detection (e.g., off-platform payment requests, wire-transfer scams).
- Listing lifecycle states: Draft → Pending Review → Live → Under Offer/Leased → Archived, with full audit trail (feeds Property Passport™).
- Agency multi-listing bulk import (CSV/XML feed ingestion) and multi-agent seat management.

**Non-functional requirements:**
- Listing search P95 latency < 300ms at MVP scale (~50k listings).
- All media stored with signed URLs / CDN delivery; no direct bucket exposure.
- Full internationalization (i18n) scaffolding from day one (English, Hebrew, French, Spanish as first locales) — even if only English ships in MVP, strings must be externalized.

### 2.2 Property Passport™

A permanent record object keyed to the physical property (address + parcel/unit identifier), not to any single listing instance.

- **Historical ledger:** every past listing (price, dates, listing owner), price-change events, renovation/structural update entries (owner-submitted, admin-moderated).
- **Verified documents:** floor plans, building compliance docs, energy certificate — uploaded, stored, and stamped "Verified" only after admin or trusted-partner document review.
- **Media gallery:** cumulative AI-quality-scored photo/video history (not lost when a listing is taken down and re-listed).
- **Badges:** `Verified Ownership` (deed/title or utility-bill cross-check), `Verified Availability` (recent physical/video confirmation of vacancy).
- **Continuity rule:** Property Passport persists across ownership/agent changes — it is an asset-level record, immutable audit log style (append-only events), surfaced read-only to any future listing of that same unit.

### 2.3 Landlord Passport™

Public reputation profile bound to a verified user account with an `Owner` or `Agent` role.

- Identity verification status (KYC tier: none / email-verified / ID-verified / ID+address-verified).
- Tenure: "on platform since," total listings published, total successful transactions closed.
- Responsiveness metrics: average response time, response rate (rolling 90-day window).
- Ratings: aggregate star rating + written reviews from completed-transaction tenants only (prevents fake/competitor reviews).
- Languages spoken (self-declared, optionally verified via short conversational check).
- Public profile URL, shareable, SEO-indexable (drives organic acquisition).

### 2.4 Tenant Passport™ (Optional)

Opt-in profile for Home Seekers to increase match quality and landlord confidence.

- Identity verification (ID-verified badge).
- Employment/income verification (optional third-party verification integration — e.g., Plaid-like income API or manual document upload reviewed by admin).
- Past-landlord recommendations (structured short-form reviews, requestable by the tenant, submitted by a previous *Verified* landlord — same anti-fraud pairing constraint as Landlord Passport reviews).
- Tenant Trust Score: composite, generalized (not "approved/rejected" — a soft signal only, never an automated denial mechanism, to avoid disparate-impact liability).
- Full visibility control: tenant chooses per-application whether to share the Passport, defaulting to hidden.

### 2.5 AI Trust Score™ (0–100)

Composite fraud/quality score computed per listing and refreshed on every material edit.

**Signal inputs (MVP scope):**
- Duplicate-listing detection (image hashing + text similarity across the corpus).
- Price-outlier detection (z-score vs. comparable properties in the same micro-area).
- Stock-photo detection (reverse-image-search / perceptual hash against known stock catalogs).
- Account-level fraud heuristics (new account + high-value listing + payment-off-platform request pattern).
- Bait-and-switch detection (repeated price/detail edits shortly after publishing, listing reactivation churn).

**Output:**
- Score 0–100 displayed as a tiered badge (e.g., "Trust Verified" ≥ 85, "Standard" 50–84, "Under Review" < 50, auto-suppressed from search below a hard floor pending manual review).
- Score and top contributing factors visible to Admin trust & safety tooling (not full transparency to end users, to prevent gaming).

### 2.6 Community Score™ & Insights

Infrastructure-accessibility scoring engine, computed per listing from geocoded proximity — **never** from resident demographics.

**Data categories (MVP):**
- Religious/cultural: synagogues, Chabad centers, JCCs, Mikvahs.
- Commerce: kosher restaurants, kosher/Judaica supermarkets.
- Education: Jewish day schools, yeshivas.
- Language-friendly services (Hebrew/French/Spanish-speaking businesses, clinics).
- Standard livability: walk score, transit score, hospitals/urgent care, general safety data (public crime stats where legally available), noise-level estimate, family-friendliness proxy (parks/playgrounds density).

**Product behavior:**
- Each listing shows a "Community Score" summary card + expandable map layer with walking-time badges ("6 min to Chabad of Downtown").
- Data sourced from a combination of licensed POI datasets (Google Places / OSM / Foursquare) plus a curated, community-submitted directory (admin-moderated) for niche entries (Mikvahs, Chabad houses) not reliably present in generic POI datasets.
- Filters expressed as **infrastructure proximity**, never as population/demographic filters — this is a hard compliance boundary enforced at the product and query layer (see §6).

### 2.7 Property Match™ (Passive Engagement Engine)

- Seeker builds a structured preference profile: budget range, neighborhoods/radius, bed/bath, must-have amenities, Community Score thresholds (e.g., "≤10 min walk to synagogue"), pet policy, family-environment preference.
- Background matching job scores every new/updated listing against every active seeker profile.
- On match score ≥ configurable threshold (default 95%), trigger an instant push/email/SMS smart alert with deep link.
- Retention loop: seekers who haven't logged in recently still receive high-confidence match alerts, pulling them back — this is the primary lifecycle/retention mechanism for MVP.
- Feedback loop: seeker marks a delivered match "not relevant" → adjusts future scoring weights for that user (lightweight personalization, not full ML in MVP — rule-based weighted scoring is sufficient for v1).

### 2.8 User Roles & Permissions Matrix

| Capability | Home Seeker | Landlord/Owner | Agency/Broker | Admin |
|---|---|---|---|---|
| Browse/search listings | ✅ | ✅ | ✅ | ✅ |
| Create/manage listings | — | ✅ (own) | ✅ (multi, org-scoped) | ✅ (moderation) |
| Build Tenant Passport | ✅ (optional) | — | — | view (support) |
| Build Landlord Passport | — | ✅ | ✅ (per agent + org) | view (support) |
| Messaging | ✅ | ✅ | ✅ | read (fraud review) |
| Property Match preferences | ✅ | — | — | — |
| Bulk listing import | — | — | ✅ | ✅ |
| Multi-seat team management | — | — | ✅ (org admin) | ✅ |
| Content moderation / verification | — | — | — | ✅ |
| Analytics dashboard | own activity | own listings | org-level | platform-wide |
| Subscription/billing management | own | own | org | all |

---

## 3. System Architecture & Tech Stack

### 3.1 Guiding Principle

Everything is modeled around a **shared identity + trust + messaging core**, with each vertical (Real Estate today; Jobs, Businesses, Events, Directories tomorrow) as a **plug-in module** that references the core but owns its domain-specific schema and services. No future module should require touching the User, Auth, Trust Score, or Messaging services — it should only register new entity types and scoring inputs.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Applications                      │
│        Web (Next.js)   |   iOS/Android (React Native)            │
└───────────────────────────────┬───────────────────────────────────┘
                                  │ GraphQL / REST (BFF)
┌───────────────────────────────▼───────────────────────────────────┐
│                        API Gateway / BFF Layer                     │
│         (Auth middleware, rate limiting, request routing)          │
└───────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────┬──────────┼──────────┬───────────────┐
        ▼             ▼          ▼          ▼               ▼
 ┌────────────┐ ┌────────────┐ ┌────────┐ ┌───────────┐ ┌───────────┐
 │  Identity  │ │   Trust &  │ │Messaging│ │ Real Estate│ │  Search / │
 │  & Profile │ │   Passport │ │ Service │ │  Module    │ │  Match    │
 │  Service   │ │   Service  │ │        │ │ (Phase 1)  │ │  Engine   │
 └─────┬──────┘ └─────┬──────┘ └───┬────┘ └─────┬──────┘ └─────┬─────┘
       │              │            │            │              │
       └──────┬───────┴─────┬──────┴─────┬──────┴──────┬──────┘
              ▼              ▼            ▼             ▼
        ┌───────────┐  ┌───────────┐ ┌──────────┐ ┌────────────┐
        │ PostgreSQL│  │  Redis    │ │  S3/CDN  │ │Elasticsearch│
        │ (core RDS)│  │ (cache/  │ │ (media)  │ │ / OpenSearch│
        │           │  │  queues) │ │          │ │  (search)   │
        └───────────┘  └───────────┘ └──────────┘ └────────────┘

  Cross-cutting: AI/ML services (fraud, quality scoring, Community Score
  ETL, matching) run as async workers consuming an event bus (Kafka/SQS),
  never inline in the request path.
```

### 3.2 Recommended Production Stack

| Layer | Recommendation | Rationale |
|---|---|---|
| **Frontend (Web)** | Next.js (React) + TypeScript, Tailwind CSS | SSR/SEO critical for listing pages & Landlord Passport public profiles; strong ecosystem, fast iteration |
| **Mobile** | React Native (Expo) | Single codebase leverage with web team's React skillset; push notifications for Property Match alerts |
| **Backend API** | Node.js (NestJS) or alternatively Go for high-throughput search/matching services | NestJS gives modular, dependency-injected structure that mirrors the "pluggable module" architecture requirement directly |
| **API style** | GraphQL (Apollo/Federation) at the BFF, internal REST/gRPC between services | GraphQL federation lets each future module publish its own schema without a monolithic gateway rewrite |
| **Primary database** | PostgreSQL (with PostGIS extension) | Relational integrity for Users/Trust/Transactions; PostGIS gives native geospatial queries for Community Score proximity |
| **Search** | OpenSearch (or Elasticsearch) | Faceted search, geo-distance filters, typo-tolerant text search across listings |
| "Passport" documents/media metadata | PostgreSQL (JSONB columns) rather than a separate document DB | Avoids premature polyglot-persistence complexity; JSONB is sufficient for semi-structured passport fields at MVP scale |
| **Cache / queues** | Redis (cache) + a managed message queue (AWS SQS or Kafka via MSK) | Async processing for AI scoring, matching engine, notification fan-out |
| **Object storage / CDN** | AWS S3 + CloudFront (or Cloudflare R2 + CDN) | Media at scale, signed URLs, image transformation pipeline |
| **Auth** | Auth0 or Clerk (managed) at MVP; evaluate self-hosted (Keycloak/Ory) at scale | Managed auth de-risks security surface for a small team; must support custom claims for role-based access (Seeker/Owner/Agency/Admin) |
| **Maps / geocoding** | Google Maps Platform (Places, Geocoding, Distance Matrix) primary; OpenStreetMap/Mapbox as cost-control fallback for static map rendering | Distance Matrix API directly powers Community Score walking-time badges |
| **AI / ML integration** | Claude (Anthropic API) for: fraud-signal reasoning over listing text/messages, content moderation, matching-explanation generation; a lightweight vision model or managed image-moderation API for photo quality/stock-photo detection | Use managed LLM APIs rather than building custom NLP models in-house for MVP speed; keep AI signals as inputs to deterministic scoring, not sole decision-makers (auditability, compliance) |
| **Cloud hosting** | AWS (primary) — ECS Fargate or EKS for services, RDS for Postgres, ElastiCache for Redis | Mature managed-service ecosystem reduces early ops burden; avoid Kubernetes complexity until team/scale justifies EKS over Fargate |
| **CI/CD** | GitHub Actions + infrastructure as code (Terraform) | Reproducible environments from day one |
| **Observability** | Datadog or Grafana/Prometheus + Sentry | Error tracking and latency monitoring for search/matching SLAs |
| **Payments/billing** | Stripe (Billing + Connect for future agency payouts) | Subscription tiers, usage-based add-ons |

### 3.3 Modularity Enforcement Rules

1. **Core services never import module-specific code.** Identity, Trust/Passport, and Messaging services expose generic APIs (`entity_type`, `entity_id` polymorphic references) so a future "Job Listing" or "Business Listing" can attach to the same Trust Score and Messaging pipes without schema changes to core tables.
2. **Every module registers, it is not hard-coded.** A lightweight internal "Module Registry" config declares each vertical's entity types, search-index mappings, and scoring-input hooks — Real Estate is the first (and for MVP, only) registered module.
3. **Trust Score is entity-agnostic.** The AI Trust Score service accepts a generic `(entity_type, entity_id, signals[])` payload; Real Estate listings are simply the first signal producer.
4. **Community Score is location-agnostic, not vertical-specific.** It operates on any lat/lng + radius, so it can be reused unmodified for future Business Directory or Event modules.

---

## 4. Database Schema (ERD Design)

Relational (PostgreSQL + PostGIS) schema skeleton. Primary keys are UUIDs throughout for safe cross-service reference. Polymorphic associations (`entity_type` + `entity_id`) are used deliberately at the trust/media/review boundary to keep the core schema future-proof.

### 4.1 Entity-Relationship Overview

```
User ──1:1── LandlordPassport
User ──1:1── TenantPassport
User ──1:N── Property (as owner)
User ──1:N── Organization Membership ──N:1── Organization (Agency)
User ──1:N── SearchPreference (Property Match criteria)
User ──1:N── Message (as sender)

Organization ──1:N── User (agents/seats)
Organization ──1:N── Property (agency-managed listings)

Property ──1:1── PropertyPassport
Property ──1:N── Listing (historical + current — Passport aggregates these)
Property ──1:1── CommunityScoreSnapshot (recomputed periodically)
Property ──1:N── MediaAsset
Property ──1:N── TrustScoreEvent

Listing ──N:1── Property
Listing ──1:N── Message Thread
Listing ──1:N── TrustScoreEvent (listing-level signals)

TrustScoreSubject (polymorphic: Property | Listing | User) ──1:N── TrustScoreEvent
ReviewableSubject (polymorphic: LandlordPassport | TenantPassport) ──1:N── Review

CommunityInfrastructurePOI ──N:N── Property (via computed proximity, not stored FK — derived at query/ETL time)

SearchPreference ──N:N── Property (via MatchEvent, generated by background matching job)
```

### 4.2 Core Tables (Skeleton DDL)

```sql
-- ============ IDENTITY CORE ============
CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email             TEXT UNIQUE NOT NULL,
    phone             TEXT,
    role              TEXT NOT NULL CHECK (role IN ('seeker','owner','agent','admin')),
    kyc_tier          TEXT NOT NULL DEFAULT 'none'
                        CHECK (kyc_tier IN ('none','email_verified','id_verified','id_address_verified')),
    locale            TEXT DEFAULT 'en',
    languages_spoken  TEXT[] DEFAULT '{}',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE organizations (            -- Agencies/Brokers
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    branding      JSONB DEFAULT '{}',   -- logo, colors, public profile config
    plan_tier     TEXT NOT NULL DEFAULT 'free',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE organization_members (
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seat_role       TEXT NOT NULL DEFAULT 'agent' CHECK (seat_role IN ('org_admin','agent')),
    PRIMARY KEY (organization_id, user_id)
);

-- ============ TRUST & PASSPORT ============
CREATE TABLE landlord_passports (
    user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    member_since      TIMESTAMPTZ NOT NULL DEFAULT now(),
    response_rate_pct NUMERIC(5,2) DEFAULT 0,
    avg_response_secs INTEGER,
    total_transactions INTEGER DEFAULT 0,
    rating_avg        NUMERIC(3,2),
    rating_count      INTEGER DEFAULT 0
);

CREATE TABLE tenant_passports (
    user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    income_verified     BOOLEAN DEFAULT false,
    employment_verified BOOLEAN DEFAULT false,
    trust_score         SMALLINT CHECK (trust_score BETWEEN 0 AND 100),
    visibility          TEXT NOT NULL DEFAULT 'hidden' CHECK (visibility IN ('hidden','shared_on_request'))
);

CREATE TABLE reviews (                     -- powers both passports; polymorphic subject
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_type    TEXT NOT NULL CHECK (subject_type IN ('landlord_passport','tenant_passport')),
    subject_user_id UUID NOT NULL REFERENCES users(id),
    author_user_id  UUID NOT NULL REFERENCES users(id),
    listing_id      UUID REFERENCES listings(id),   -- ties review to a completed transaction
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    body            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trust_score_events (           -- polymorphic: property | listing | user
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_type  TEXT NOT NULL CHECK (subject_type IN ('property','listing','user')),
    subject_id    UUID NOT NULL,
    signal_code   TEXT NOT NULL,            -- e.g. 'DUPLICATE_IMAGE','PRICE_OUTLIER','STOCK_PHOTO'
    signal_weight NUMERIC(5,2) NOT NULL,
    metadata      JSONB DEFAULT '{}',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ REAL ESTATE MODULE ============
CREATE TABLE properties (                   -- Property Passport anchor: persists across listings/owners
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address_line1     TEXT NOT NULL,
    unit              TEXT,
    city              TEXT NOT NULL,
    region            TEXT,
    country           TEXT NOT NULL,
    postal_code       TEXT,
    location          GEOGRAPHY(POINT, 4326) NOT NULL,   -- PostGIS
    property_type     TEXT NOT NULL,        -- apartment, house, condo, etc.
    verified_ownership BOOLEAN DEFAULT false,
    verified_availability_at TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE property_documents (           -- floor plans, energy cert, building info
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id   UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    doc_type      TEXT NOT NULL,
    file_url      TEXT NOT NULL,
    verified      BOOLEAN DEFAULT false,
    uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE listings (                     -- one row per publish event; historical ledger
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id      UUID NOT NULL REFERENCES properties(id),
    owner_user_id    UUID NOT NULL REFERENCES users(id),
    organization_id  UUID REFERENCES organizations(id),
    listing_kind     TEXT NOT NULL CHECK (listing_kind IN ('long_term_rental','short_term_rental','sale')),
    status           TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','pending_review','live','under_offer','archived')),
    price_amount     NUMERIC(12,2) NOT NULL,
    price_currency   TEXT NOT NULL DEFAULT 'USD',
    bedrooms         SMALLINT,
    bathrooms        SMALLINT,
    sqft             INTEGER,
    amenities        JSONB DEFAULT '{}',    -- {parking: true, balcony: true, pets_ok: false, ...}
    available_from   DATE,
    ai_trust_score   SMALLINT CHECK (ai_trust_score BETWEEN 0 AND 100),
    published_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE media_assets (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id  UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    listing_id   UUID REFERENCES listings(id),
    media_type   TEXT NOT NULL CHECK (media_type IN ('photo','video','floor_plan')),
    file_url     TEXT NOT NULL,
    quality_score SMALLINT CHECK (quality_score BETWEEN 0 AND 100),
    is_stock_flagged BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ COMMUNITY INFRASTRUCTURE ============
CREATE TABLE community_infrastructure_pois (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poi_type     TEXT NOT NULL,   -- synagogue, chabad, kosher_restaurant, kosher_market,
                                    -- jewish_school, jcc, mikvah, language_service
    name         TEXT NOT NULL,
    location     GEOGRAPHY(POINT, 4326) NOT NULL,
    source       TEXT NOT NULL CHECK (source IN ('licensed_api','community_submitted')),
    verified     BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE community_score_snapshots (    -- recomputed by scheduled ETL job
    property_id       UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    overall_score     SMALLINT CHECK (overall_score BETWEEN 0 AND 100),
    walk_score        SMALLINT,
    transit_score     SMALLINT,
    safety_score      SMALLINT,
    proximity_detail  JSONB NOT NULL DEFAULT '{}',  -- {synagogue: {name, meters, walk_minutes}, ...}
    computed_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ MATCHING ENGINE ============
CREATE TABLE search_preferences (           -- Property Match™ profile
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    budget_min       NUMERIC(12,2),
    budget_max       NUMERIC(12,2),
    neighborhoods    TEXT[],
    center_point     GEOGRAPHY(POINT, 4326),
    radius_meters    INTEGER,
    min_bedrooms     SMALLINT,
    must_have_amenities JSONB DEFAULT '{}',
    community_thresholds JSONB DEFAULT '{}', -- {synagogue_walk_minutes_max: 10}
    match_threshold_pct SMALLINT DEFAULT 95,
    active           BOOLEAN DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE match_events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_preference_id UUID NOT NULL REFERENCES search_preferences(id) ON DELETE CASCADE,
    listing_id          UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    match_score_pct     SMALLINT NOT NULL,
    notified_at         TIMESTAMPTZ,
    user_feedback       TEXT CHECK (user_feedback IN ('relevant','not_relevant')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ MESSAGING ============
CREATE TABLE message_threads (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id   UUID NOT NULL REFERENCES listings(id),
    seeker_id    UUID NOT NULL REFERENCES users(id),
    owner_id     UUID NOT NULL REFERENCES users(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id    UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    sender_id    UUID NOT NULL REFERENCES users(id),
    body         TEXT NOT NULL,
    fraud_flagged BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.3 Key Design Notes

- **`properties` vs `listings` split** is the mechanism that implements Property Passport™: `properties` is the permanent asset record; `listings` is an append-only history of every time that asset was marketed. Nothing is ever deleted from `listings` — status moves to `archived`.
- **Polymorphic `trust_score_events` and `reviews`** keep the Trust & Passport service reusable by future modules (a "Business" or "Job" entity can emit `trust_score_events` without new tables).
- **`community_infrastructure_pois` is decoupled from `properties`** — proximity is computed at read/ETL time via PostGIS `ST_DWithin`/`ST_Distance`, not stored as a foreign key, so the POI catalog can grow independently and recompute historically.
- **All demographic/religious-affiliation-of-residents data is explicitly absent from this schema.** Only infrastructure location data (a synagogue's address) is stored — never anything about who lives at a given property. This is a deliberate compliance boundary (see §6).

---

## 5. 90-Day MVP Implementation Roadmap

Organized into six two-week sprints across three phases: **Foundation (Weeks 1–4)**, **Core Product (Weeks 5–8)**, **Trust & Launch Readiness (Weeks 9–12)**.

### Phase A — Foundation (Weeks 1–4)

| Sprint | Focus | Key Deliverables |
|---|---|---|
| Sprint 1 (Wk 1–2) | Infra & Identity | Repo/CI-CD scaffolding, Terraform base infra (VPC, RDS Postgres+PostGIS, Redis, S3), Auth provider integration, `users`/`organizations` schema live, role-based access control middleware |
| Sprint 2 (Wk 3–4) | Property Core | `properties`/`listings`/`media_assets` schema, listing CRUD API, media upload pipeline (S3 + CDN + basic image quality check), listing draft→publish state machine |

**Milestone (Wk 4):** Internal team can create, edit, and publish a property listing end-to-end with photos.

### Phase B — Core Product (Weeks 5–8)

| Sprint | Focus | Key Deliverables |
|---|---|---|
| Sprint 3 (Wk 5–6) | Search & Community Score | OpenSearch indexing pipeline for listings, geo-filter search API, POI ingestion (licensed API + admin-curated community submissions for synagogues/Chabad/kosher markets), Community Score computation job (v1: distance-based scoring, no ML yet), listing page Community Score UI |
| Sprint 4 (Wk 7–8) | Messaging & Passports v1 | In-platform messaging (threads + real-time delivery), Landlord Passport public profile page, Tenant Passport opt-in flow (identity verification only, income verification stubbed for post-MVP), review submission tied to completed transactions |

**Milestone (Wk 8):** A seeker can search with community filters, message an owner, and view a Landlord Passport; an owner has a public reputation profile.

### Phase C — Trust & Launch Readiness (Weeks 9–12)

| Sprint | Focus | Key Deliverables |
|---|---|---|
| Sprint 5 (Wk 9–10) | AI Trust Score & Property Match | Trust Score service v1 (duplicate detection, price-outlier detection, stock-photo flagging via perceptual hashing + managed vision API), Search Preference profile UI, background matching job + notification delivery (push/email) for ≥95% matches |
| Sprint 6 (Wk 11–12) | Agency Tools, Hardening, Launch Prep | Multi-agent org dashboard, bulk CSV listing import, admin moderation console (fraud queue, document verification, review moderation), load testing, security review (auth, PII handling, rate limiting), seed-market content population (manually verified first 200–500 listings per launch metro) |

**Milestone (Wk 12 / Day 90):** Platform is live in 1–2 seed metros with verified supply, full core loop (search → Community Score → message → passport trust signals → optional match alerts), agency onboarding tools, and a moderation console staffed and ready.

### 5.1 Explicit Non-Goals for MVP (Deferred Post-Day-90)

- Income/employment verification via live third-party financial API (manual document review only at MVP).
- Full ML-based matching (v1 uses transparent weighted-rule scoring, not a trained model — ship explainable first, optimize later).
- Jobs, Businesses, Events, and other future modules — architecture supports them, but zero UI/schema work ships for them in Phase 1.
- Payment processing / rent collection (MVP is a marketplace/discovery + trust layer, not a payments platform).

---

## 6. Appendix: Compliance & Risk Notes

- **Fair Housing / Equality Act compliance is a hard product constraint, not a legal afterthought.** No field, filter, or scoring input may reference the religion, ethnicity, or national origin of *people* (residents, applicants, neighbors). All "community" signals are restricted to **fixed infrastructure** (a building's address), which is legally distinct from filtering on protected-class characteristics of persons.
- **Marketing and UI copy review**: legal should review all public-facing copy to ensure language consistently frames features as "neighborhood infrastructure and lifestyle amenities" (comparable to "walk score" or "school ratings," both well-established, legal real-estate data categories) rather than any language implying suitability based on who lives there.
- **Tenant Trust Score must remain a soft signal.** It must never auto-reject an applicant; automated denial on a composite score correlated with income/identity data carries disparate-impact risk under fair-lending/fair-housing analogy even outside formal credit contexts. Human landlord discretion must remain in the loop, and the score's methodology should be available to regulators/auditors on request.
- **Data privacy**: identity verification documents (ID scans, income docs) require encryption at rest, strict access logging, and a defined retention/deletion policy (recommend deleting raw verification documents after a short retention window once a verified badge is issued, retaining only the verification *result*, not the source document, wherever legally sufficient).
- **Community-submitted POI moderation**: since Chabad/Mikvah/synagogue data is often not present in generic map APIs, community submissions are necessary — but require admin moderation before publish to prevent spam, vandalism, or inaccurate entries affecting real properties' scores.
