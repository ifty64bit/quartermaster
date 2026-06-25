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

## 2. Recommended Tech Stack

| Layer            | Choice                                  | Why |
|-----------------|------------------------------------------|-----|
| Framework        | **Next.js 14+ (App Router) + TypeScript** | SSR/RSC, API routes, great DX, deploys to Vercel |
| UI               | **Tailwind CSS + shadcn/ui**             | Fast, consistent, accessible components |
| Database         | **Turso (libSQL/SQLite)**                | Your choice. Free tier, edge replicas, SQLite familiarity, built-in FTS5 |
| ORM              | **Drizzle ORM**                          | First-class Turso/libSQL support, type-safe schema, great migrations |
| Validation       | **Zod**                                  | Schema validation shared between client/server/DB |
| Data fetching    | **TanStack Query + React Server Components** | Cache, optimistic updates, server data |
| Auth             | **Auth.js (NextAuth) or Clerk**          | Email/password or passkey; single-user can start with a single-passphrase gate |
| File storage     | **Cloudflare R2 or UploadThing**         | Receipt/invoice/photo uploads (cheap, S3-compatible) |
| Charts           | **Recharts or Tremor**                   | Net-worth, depreciation, category breakdown |
| OCR (optional)   | **Tesseract.js** or Google Vision API    | Auto-fill asset info from receipt photos |
| Deployment       | **Vercel**                               | Next.js native; Turso connects from edge |
| Currency FX      | **exchangerate.host / open.er-api.com**  | Free currency conversion for multi-currency assets |

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
| Condition          | enum        | New / Like New / Used / Worn / Broken |
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
- Total assets count + total purchase value (in chosen base currency).
- Value by category (donut chart).
- Recent additions.
- Warranty expiring soon (next 30/60/90 days).

### 3.6 Warranty tracking
List of assets with warranty expiry; badge for expiring-soon / expired; optional
email/in-app reminder.

### 3.7 Image & receipt upload
Upload photos and receipt; thumbnails; link stored in DB, file in R2/UploadThing.

### 3.8 Settings
Base currency, date format, theme (light/dark), profile.

---

## 4. Additional / Suggested Features (Phase 2+)

These are ranked by value-to-effort. Pick the ones that match how you actually use it.

| # | Feature | Why it's worth it |
|---|---------|-------------------|
| 1 | **Depreciation engine** | Straight-line or custom rate per category → current estimated value vs purchase price. Powers the "what am I worth now" number. |
| 2 | **Net worth & value-over-time dashboard** | Charts of total value, depreciation curve, spend by month/year. |
| 3 | **Maintenance / repair log** | Per-asset history: what broke, when, cost, who fixed. Great for PCs & cameras. |
| 4 | **Maintenance schedule & reminders** | Recurring tasks (e.g. clean PC filters every 6 months) with reminders. |
| 5 | **QR/barcode labels** | Generate a label per asset; print; scan with phone camera to open asset page. |
| 6 | **Receipt OCR auto-fill** | Upload receipt → auto-extract vendor, date, total, items → pre-fill form. |
| 7 | **Asset relationships** | Link a GPU to its PC, a lens to its camera. Shows "contains / part of" trees. |
| 8 | **Sell / dispose tracking** | Record sale price + date → compute profit/loss vs depreciated value. Archive asset. |
| 9 | **Loan / borrow tracking** | "Lent to Sam on 2025-05-01". Reminders to get it back. |
| 10 | **Multi-currency with FX** | Auto-convert purchase prices to base currency using daily rates; store the rate used. |
| 11 | **Price / market value history** | Manually log current resale value over time (e.g. eBay "sold" prices) to see what's appreciating (lenses!) vs depreciating. |
| 12 | **Insurance report export** | PDF/CSV of all assets + values + serials for insurance claims. |
| 13 | **CSV / Excel import & export** | Bulk-add existing stuff; backup to spreadsheet. |
| 16 | **Documents** | Attach manuals, warranty PDFs, invoices beyond just the receipt. |
| 17 | **Reminders / notifications** | In-app + optional email (Resend) for warranty & maintenance. |
| 18 | **PWA + offline** | Installable, works offline, syncs when online (libSQL embedded makes this clean). |
| 19 | **Multi-user / household sharing** | Share catalog with family; per-user permissions. |
| 20 | **Attachments preview** | Inline PDF/image viewer; lightbox for photos. |
| 21 | **Audit log** | Who changed what and when (useful once multi-user). |
| 22 | **Bulk edit** | Select N assets → archive. |
| 23 | **Saved views / custom lists** | "My camera kit", "Everything under warranty", persisted filters. |
| 24 | **Mobile-optimized scan flow** | Add an asset by photo from phone (PWA camera capture). |
| 25 | **Backup & restore** | One-click DB dump download; restore from file. Turso also has platform backups. |

---

## 5. Data Model (entities)

```
User            id, email, name, baseCurrency, createdAt
Asset           id, ownerId, name, categoryId, subcategory, brand, model,
                serial, purchaseDate, purchasePrice, currency, fxRateToBase,
                vendor, purchaseUrl, condition, notes,
                warrantyExpiry, warrantyTerms, parentAssetId?,
                depreciationRate, isArchived, archivedReason, archivedAt,
                createdAt, updatedAt
Category        id, name, icon, parentId?
Attachment       id, assetId, type(photo|receipt|document|manual),
                url, filename, mimeType, size, createdAt
MaintenanceLog  id, assetId, date, type(repair|service|upgrade),
                description, cost, currency, vendor, createdAt
DepreciationSnapshot id, assetId, date, currentValue   (periodic snapshots)
LoanRecord      id, assetId, borrowerName, lentAt, expectedReturnAt, returnedAt, notes
DisposalRecord  id, assetId, type(sold|donated|lost|scrapped), date, salePrice, currency, notes
Reminder        id, assetId, type(warranty|maintenance), dueDate, repeatRule?, done
CurrencyRate    base, quote, rate, date   (cache FX rates)
AuditLog        id, userId, entity, entityId, action, diffJson, createdAt
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
1. Project scaffold: Next.js + Tailwind + shadcn/ui + Drizzle + Turso.
2. Turso DB provisioning + schema + migrations.
3. Auth (single-user gate to start).
4. Asset CRUD + categories.
5. Image/receipt upload to R2.
6. FTS5 search + filters.
7. Dashboard (counts + by-category + warranty-soon).

**Phase 2 — Value & lifecycle**
8. Depreciation engine + net-worth charts.
9. Maintenance log + schedule reminders.
10. Sell/dispose + loan tracking.
11. QR label generation + scan-to-open.
12. CSV import/export + insurance report PDF.

**Phase 3 — Polish & power features**
13. Receipt OCR auto-fill.
14. Multi-currency FX.
15. PWA + offline + mobile camera capture.
16. Multi-user / household sharing + audit log.
17. Saved views, bulk edit, backups.

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Data entry friction kills adoption | OCR auto-fill, duplicate-asset "copy", mobile capture, CSV bulk import |
| Currency confusion | Always store original currency + FX rate snapshot at purchase; show both |
| Losing receipts | Store receipt file + record vendor/order URL |
| Schema lock-in early | Use Drizzle migrations; keep `notes` flexible for unstructured needs |
| Scope creep | Phased milestones; ship MVP before Phase 2 |

---

## 9. Out of Scope (initial)

- Real-time stock-market-style price feeds (manual market-value logging is enough).
- Business/fixed-asset accounting (GAAP depreciation, tax filing).
- Public marketplace / selling inside the app.
- IoT auto-detection of devices.
