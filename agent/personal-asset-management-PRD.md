# Personal Asset Management System — Product Requirements Document (PRD)

> A personal, web-based inventory system to track purchased physical assets
> (PCs, PC components, cameras, furniture, etc.) with price, warranty, value,
> documents, and lifecycle history.

---

## 1. Overview & Goals

**Problem:** Personal purchases of electronics, furniture, and equipment are
scattered across emails, receipts, and memory. There's no single place to know
*what I own, what it cost, what it's worth now, what's under warranty, and what
needs maintenance.*

**Goal:** A single web app to register every owned asset, track its financial
and physical lifecycle, and surface insights (net worth, depreciation, warranty
expiry) with minimal data-entry friction.

**Target user:** Single user (you) initially; designed to extend to a household.

**Success metrics (personal):**
- Every asset > a threshold value is logged within 1 week of purchase.
- Time to add a new asset < 2 minutes.
- Warranty alerts surface before expiry, not after.

---

## 2. Tech Stack

| Layer            | Choice                                  |
|-----------------|------------------------------------------|
| Framework        | **TanStack Start + React 19 + TypeScript** |
| Styling          | **Tailwind CSS v4 + shadcn/ui theme tokens** |
| Database         | **Turso (libSQL/SQLite)**                |
| ORM              | **Prisma** (with `@prisma/adapter-libsql`) |
| Validation       | **Valibot**                              |
| Data fetching    | **TanStack Query**                       |
| Auth             | **Better Auth** (email/password + Google OAuth) |
| File storage     | **TBD** (R2 / UploadThing)               |
| Charts           | **TBD** (Recharts / Tremor)              |
| OCR (optional)   | **TBD** (Tesseract.js / Google Vision)   |
| Deployment       | **Nitro** (Node-compatible hosts)        |
| Currency FX      | **TBD** (open.er-api.com)                |
| Lint/Format      | **Biome**                                |
| Icons            | **Lucide React**                         |
| React Compiler   | **Babel plugin** (automatic memoization) |

**Why Turso fits well**
- SQLite schema = simple, portable, easy to reason about.
- Edge replicas = fast reads from anywhere.
- libSQL supports embedded use if you later go desktop/mobile.
- Built-in **FTS5** for full-text asset search without extra infra.
- Free tier comfortably covers a personal catalog.

---

## 3. Core Features (MVP — Phase 1)

### 3.1 Asset CRUD
Create, read, update, delete, and archive assets. Soft-delete (archive) instead
of hard delete so disposal history is preserved.

### 3.2 Asset attributes
Each asset stores:

| Field              | Type        | Notes |
|--------------------|-------------|-------|
| Name               | string      | e.g. "Main Desktop PC" |
| Category           | FK          | e.g. PC, PC Component, Camera, Furniture |
| Subcategory        | string?     | e.g. GPU, Lens, Chair |
| Brand              | string?     | e.g. Logitech, Sony |
| Model              | string?     | e.g. MX Master 3S |
| Serial number      | string?     | for warranty/insurance claims |
| Purchase date      | date        | |
| Purchase price     | decimal     | |
| Currency           | string      | ISO code, e.g. USD/BDT |
| Vendor / store     | string?     | where bought |
| Purchase URL       | url?        | link to product/order page |
| Condition          | enum        | new / used / refurbished |
| Estimated value    | decimal?    | manual override for current market value |
| Location           | FK?         | where the asset physically lives (House → Room → Shelf) |
| Parent asset       | FK?         | self-referential; e.g. GPU belongs to Desktop PC |
| Notes              | text?       | free-form |
| Photos             | files[]     | multiple images |
| Receipt / invoice  | file?       | PDF/image |
| Warranty expiry    | date?       | |
| Warranty terms     | text?       | what's covered |
| Is archived        | bool        | sold/disposed |
| Created / updated  | timestamps  | audit |

### 3.3 Categories
Customizable categories with icon + parent (so "PC Component" can be a subcategory
of "Electronics"). Seed defaults: PC, PC Component, Peripheral, Camera, Lens,
Furniture, Appliance, Tool, Other.

### 3.4 Search & filter
- Free-text search (name, model, serial, brand, notes) via **SQLite FTS5**.
- Filters: category, condition, price range, purchase date range,
  warranty status (active / expiring / expired).

### 3.5 Dashboard

**Stat cards (top row, 4-col on desktop):**
- Total Assets (count).
- Portfolio Value (total purchase price in base currency).
- Warranty Alerts (count of expiring/expired, color-coded: red/amber/green).
- Condition Breakdown (count per `AssetCondition`: new / used / refurbished).

**Charts & lists (middle row, 2-col on desktop):**
- Value by Category donut chart with per-category item counts in the legend.
- Warranty Expiry List — top 5 assets by nearest expiry date, with days-remaining badge; "View all →" link.

**Bottom row (2-col on desktop):**
- Most Valuable Assets — ranked list (top 5 by purchase price).
- Recent Activity Feed — last 8–10 actions from `AssetHistory`, showing action icon + asset name + relative timestamp.

**Phase 2 addition:**
- Incomplete Assets / Data Quality card — surface missing serials, photos, warranty dates, categories; checklist-style with completion percentage.

### 3.6 Warranty tracking
List of assets with warranty expiry; badge for expiring-soon / expired; optional
email/in-app reminder.

### 3.7 Image & receipt upload
Upload photos and receipt; thumbnails; link stored in DB, file in R2/UploadThing.

### 3.8 Hierarchical Locations
A self-referential `Location` tree (House → Room → Shelf → Box) to answer *"where is my thing?"*.
- Each asset can be assigned to one location.
- Location has a name and an optional parent (tree structure).
- Browseable tree view on the assets page; filter assets by location.
- Expand/collapse with asset counts per node.

### 3.9 Settings
Base currency, date format, theme (light/dark), profile.

---

## 4. Additional / Suggested Features (Phase 2+)

These are ranked by value-to-effort. Features marked ~~struck~~ were dropped after a feature audit (see `agent/feature-audit.md`) as over-engineering for a personal/single-user app or better replaced by simpler alternatives.

### Phase 2 — Value & Utility

| # | Feature | Why it's worth it |
|---|---------|-------------------|
| 1 | **Maintenance / repair log** | Per-asset history: what broke, when, cost, who fixed. Simple CRUD sub-list on asset detail. High value for PC builds and cameras. |
| 2 | **Simple depreciation** | Computed at read-time: `currentValue = purchasePrice × (1 - depreciationRate × yearsOwned)`. Rate stored per category, no snapshot model. Powers portfolio value estimates. |
| 3 | **Net worth & value-over-time dashboard** | Charts of total value, depreciation curve, spend by month/year. |
| 4 | **Asset relationships (parent/child)** | Link a GPU to its PC, a lens to its camera. Self-referential `parentId` on Asset. Shows "contains / part of" trees. |
| 5 | **Sell / dispose tracking** | Record sale price + date → compute profit/loss. Archive asset. |
| 6 | **Multi-currency with FX** | Display-time FX conversion (open.er-api.com). Store `fxRateAtPurchase` on Asset for historical accuracy. Add `baseCurrency` user setting. |
| 7 | **CSV / Excel import & export** | Bulk-add existing stuff; backup to spreadsheet. |
| 8 | **Insurance report export** | PDF/CSV of all assets + values + serials for insurance claims. Pairs with CSV export. |
| 9 | **Documents** | Attach manuals, warranty PDFs, invoices beyond just the receipt. |
| 10 | **Email-forward receipt capture** | Forward purchase confirmation → auto-populate asset (vendor, date, total, items). Inbound email parser (Resend/Postmark). Dramatically reduces data-entry friction. |

### Phase 3 — Polish

| # | Feature | Why it's worth it |
|---|---------|-------------------|
| 11 | **Receipt OCR auto-fill** | Upload receipt → auto-extract vendor, date, total, items → pre-fill form. |
| 12 | **PWA + offline** | Installable, works offline, syncs when online (libSQL embedded). |
| 13 | **Mobile-optimized scan flow** | Add an asset by photo from phone (PWA camera capture). |
| 14 | **Attachments preview** | Inline PDF/image viewer; lightbox for photos. |
| 15 | **Backup & restore** | One-click DB dump download; restore from file. Turso also has platform backups. |
| 16 | **Condition photo timeline** | Timestamped photo history to document condition over time (insurance value). Extends `Media` with a `capturedAt` field + timeline view. |

### Dropped / Deferred

~~Depreciation engine (full)~~ → Computed at read-time, no `DepreciationSnapshot` model.  
~~Maintenance schedule & reminders~~ → Use Google Calendar. Building recurring-task scheduling is an entire sub-product.  
~~Loan / borrow tracking~~ → Use the `notes` field on Asset.  
~~Price / market value history~~ → Add a simple `estimatedValue` field on Asset instead.  
~~QR / barcode labels~~ → Defer until 500+ assets.  
~~Saved views / custom lists~~ → Bookmarkable filter URL params achieve 90% of this.  
~~Audit log~~ → Only relevant with multi-user. `AssetHistory` already covers lifecycle events.  
~~Bulk edit~~ → Individual archive is fine for < 200 items.  
~~Multi-user / household sharing~~ → Massive scope, separate project.

---

## 5. Data Model (Prisma schema — implemented)

### Models

```
User            id, name, email, emailVerified, image, createdAt, updatedAt,
                twoFactorEnabled, username, displayUsername, baseCurrency?
Session         id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId
Account         id, accountId, providerId, userId, accessToken, refreshToken,
                idToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, password
Verification    id, identifier, value, expiresAt
TwoFactor       id, secret, backupCodes, userId, verified
Asset           id, name, model?, serial?, purchaseDate, purchasePrice, currency,
                store?, productUrl?, condition (AssetCondition), warrantyExpiry?,
                notes?, estimatedValue?, fxRateAtPurchase?, categoryId?, brandId?,
                locationId?, parentId?, ownerId
AssetHistory    id, assetId, action (AssetAction), notes?
Media           id, assetId, url, type (MediaType), mimeType (MimeType), capturedAt?
Category        id, name (unique), depreciationRate?
Location        id, name, parentId?, userId
Brand           id, name (unique)
```

### Enums

```
AssetCondition  new | used | refurbished
AssetAction     created | updated | repaired | sold | donated | destroyed | deleted | archived | restored
MediaType       photo | invoice
MimeType        image | video | audio | document | other
```

### Planned additions (Phase 2+)

```
MaintenanceLog  id, assetId, date, description, cost, currency, vendor?
```

Full-text search virtual table (`assets_fts`) backed by FTS5 over
name/model/brand/serial/notes, kept in sync via triggers.

---

## 6. Non-Functional Requirements

- **Performance:** Dashboard loads < 1s on a catalog of ~1,000 assets.
- **Security:** All routes auth-gated; file uploads validated (type + size);
  secrets in env, never in repo; HTTPS only.
- **Privacy:** Personal financial data — encrypt sensitive fields at rest if
  hosting outside your own account; Turso data is yours.
- **Reliability:** DB backups (Turso platform + manual dump export).
- **Accessibility:** shadcn/ui components meet WCAG AA; keyboard navigable.
- **Responsiveness:** Works on mobile (add-from-phone is a key flow).
- **i18n-ready:** Keep strings externalized if you might localize later.

---

## 7. Milestones

**Phase 1 — MVP (foundation)**
1. ~~Project scaffold: TanStack Start + Tailwind + Prisma + Turso.~~ ✅
2. ~~Turso DB provisioning + schema + migrations.~~ ✅
3. ~~Auth (Better Auth — email/password + Google).~~ ✅
4. Asset CRUD + categories + brands.
5. Hierarchical Locations (House → Room → Shelf).
6. Image/receipt upload.
7. Search + filters (FTS5).
8. Dashboard (stat cards + value-by-category donut + warranty expiry list + most valuable assets + recent activity feed + condition breakdown).

**Phase 2 — Value & lifecycle**
9. Maintenance / repair log (per-asset history).
10. Simple depreciation (computed at read-time, rate per category).
11. Asset relationships (parent/child — GPU belongs to PC).
12. Multi-currency display (FX at display time, store `fxRateAtPurchase`).
13. CSV import/export + insurance report PDF.
14. Dashboard: Incomplete Assets / Data Quality widget.

**Phase 3 — Polish & automation**
15. Receipt OCR auto-fill.
16. Email-forward receipt capture (inbound email → auto-populate asset).
17. Sell / dispose tracking (record sale price + profit/loss).
18. PWA + offline + mobile camera capture.
19. Attachments preview + condition photo timeline.
20. Backup & restore.

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Data entry friction kills adoption | OCR auto-fill, email-forward receipt capture, duplicate-asset "copy", mobile capture, CSV bulk import |
| Currency confusion | Always store original currency + FX rate snapshot at purchase; show both |
| Losing receipts | Store receipt file + record vendor/order URL |
| Schema lock-in early | Use Prisma migrations; keep `notes` flexible for unstructured needs |
| Scope creep | Phased milestones; ship MVP before Phase 2 |

---

## 9. Out of Scope (initial)

- Real-time stock-market-style price feeds (manual market-value logging is enough).
- Business/fixed-asset accounting (GAAP depreciation, tax filing).
- Public marketplace / selling inside the app.
- IoT auto-detection of devices.
- **Dropped features** (per `agent/feature-audit.md`, 2026-06-30):
  - Loan/borrow tracking → use `notes` field.
  - Price/market value history → use `estimatedValue` field.
  - Full depreciation engine → computed at read-time; no snapshots.
  - Maintenance schedule & reminders → use Google Calendar.
  - QR/barcode labels → defer until 500+ assets.
  - Saved views / custom lists → bookmarkable filter URLs.
  - Audit log → only needed with multi-user; `AssetHistory` covers lifecycles.
  - Bulk edit → individual archive sufficient for < 200 items.
  - Multi-user / household sharing → massive scope, separate project.
