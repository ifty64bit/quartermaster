# Quartermaster — Feature Audit & Prioritization

> Analysis of planned features vs. industry standards and real user feedback (2025–2026).
> Research date: June 30, 2026

---

## Current State

| Area | Status |
|------|--------|
| Auth (email + Google) | ✅ Done |
| DB schema (Prisma + Turso) | ✅ Done |
| Sidebar nav + layout | ✅ Done |
| Dashboard (partial) | 🟡 In progress |
| Asset CRUD | 🟡 In progress |
| Categories & Brands | 🟡 In progress |
| Search, Attachments, Depreciation, Maintenance | ⬜ Stub routes only |

**MVP items still unfinished:** Asset CRUD, image/receipt upload, search + filters, dashboard (counts + charts + warranty-soon), warranty tracking.

---

## 🔴 Features to CUT or Heavily Simplify

These planned features have a poor value-to-effort ratio for a personal/single-user app and represent classic scope creep:

### 1. Price / Market Value History (#11)
> *"Manually log current resale value over time (e.g., eBay 'sold' prices)"*

**Verdict: CUT**

| Factor | Assessment |
|--------|-----------|
| User demand | Very low — Reddit users never mention this for personal inventory |
| Effort | High — needs a separate model, UI for historical value entry, chart rendering |
| Alternative | A simple `estimatedCurrentValue` field on the Asset model covers 95% of the need |
| Industry reality | Only valuable if automated (API-fed). Manual logging is abandoned within weeks |

> **⚠️ Warning:** Without API automation (eBay, Reverb, etc.), this becomes a "write-once, never-update" feature that clutters the UI.

---

### 2. Loan / Borrow Tracking (#9)
> *"Lent to Sam on 2025-05-01. Reminders to get it back."*

**Verdict: CUT**

| Factor | Assessment |
|--------|-----------|
| User demand | Extremely niche — most personal inventory users track < 200 items, lending is rare |
| Effort | Medium — new model (`LoanRecord`), UI, reminder system |
| Alternative | A note on the asset record: "Lent to Sam 2025-05-01" covers this |
| Industry reality | Only 1-2 apps (e.g., Keepfully, LendItems) even offer this; they serve a different use case (libraries, equipment pools) |

> **💡 Tip:** The `notes` field on `Asset` already handles this. A dedicated system is over-engineering for a personal app.

---

### 3. Depreciation Engine (#1 in Phase 2)
> *"Straight-line or custom rate per category → current estimated value"*

**Verdict: SIMPLIFY dramatically**

| Factor | Assessment |
|--------|-----------|
| User demand | Moderate — useful for insurance, but users want *estimated current value*, not a full accounting engine |
| Effort | High — engine + `DepreciationSnapshot` model + per-category rates + charts |
| Alternative | A simple formula: `currentValue = purchasePrice × (1 - rate × yearsOwned)` computed at read-time, no snapshots needed |
| Industry reality | Personal users don't need GAAP depreciation. A single "estimated value" column suffices |

> **❗ Important:** Don't build a depreciation *engine*. Add a `depreciationRate` field to Category and compute current value at query time. Zero new models needed.

---

### 4. Maintenance Schedule & Reminders (#4)
> *"Recurring tasks (e.g., clean PC filters every 6 months) with reminders."*

**Verdict: CUT (keep only Maintenance Log)**

| Factor | Assessment |
|--------|-----------|
| User demand | Low for *scheduled* reminders — users want a repair *log*, not a calendar |
| Effort | Very high — needs cron jobs / scheduled functions, email integration (Resend), `Reminder` model, repeat-rule parsing |
| Alternative | Maintenance *log* (what broke, when, how much) is high value and simple. Reminders can be added later |
| Industry reality | Calendar/reminder apps (Google Calendar, Todoist) already do this better |

> **🚨 Caution:** Building a reminder/scheduling system is an entire sub-product. It requires persistent background workers, email delivery, timezone handling, and a repeat-rule parser. This alone could consume more effort than the entire MVP.

---

### 5. QR/Barcode Labels (#5)
> *"Generate a label per asset; print; scan with phone camera to open asset page."*

**Verdict: DEFER to Phase 4+**

| Factor | Assessment |
|--------|-----------|
| User demand | Moderate for large collections; overkill for < 100 items |
| Effort | Medium — label generation (PDF), QR encode, scan-to-URL |
| Alternative | Asset detail pages already have unique URLs; users can bookmark |
| Reality check | You need a label printer or specific label sheets. Most personal users won't bother |

---

### 6. Saved Views / Custom Lists (#23)
> *"My camera kit", "Everything under warranty", persisted filters.*

**Verdict: CUT from roadmap**

| Factor | Assessment |
|--------|-----------|
| User demand | Low for single user — you learn your own filters quickly |
| Effort | Medium — needs a `SavedView` model, serialized filter state, UI for CRUD |
| Alternative | Good filter/search UI with URL params (bookmarkable) achieves 90% of this |
| Reality | This is a power-user feature for multi-user/team apps |

---

### 7. Audit Log (#21)
> *"Who changed what and when"*

**Verdict: CUT — single user**

| Factor | Assessment |
|--------|-----------|
| User demand | Zero for single user |
| Effort | Medium — interceptor/middleware, separate table, UI |
| Reality | Only relevant with multi-user. `AssetHistory` already covers lifecycle events |

> **ℹ️ Note:** You already have `AssetHistory` which tracks actions (created, updated, repaired, sold, etc.). That's sufficient until multi-user arrives.

---

### 8. Bulk Edit (#22)
> *"Select N assets → archive"*

**Verdict: CUT from near-term**

| Factor | Assessment |
|--------|-----------|
| User demand | Low until you have hundreds of assets |
| Effort | Medium — selection state, batch mutation, conflict handling |
| Alternative | Individual archive is fine for < 200 items |

---

## 🟡 Features to KEEP but Reposition

### Maintenance Log (#3) — Move to MVP
The *log* (not schedule/reminders) is genuinely high-value:

```
MaintenanceLog { id, assetId, date, description, cost, currency }
```

It's a simple CRUD sub-list on the asset detail page. Minimal effort, high utility for PC builds and cameras.

---

### Multi-Currency with FX (#10) — Keep in Phase 2, but simplify
Your schema already has `currency` on Asset. Just:
1. Add a `baseCurrency` user setting
2. Fetch FX rate at display time (open.er-api.com is free)
3. Store `fxRateAtPurchase` on Asset for historical accuracy

Don't build a "daily rate snapshot" system.

---

### CSV Import/Export (#13) — Keep in Phase 2
This is universally requested. Export is trivial; import needs a mapper UI but is doable.

---

### Insurance Report Export (#12) — Keep in Phase 2
High value, low effort — it's essentially a styled PDF/CSV of all assets with photos and serials. Pairs naturally with CSV export.

---

## 🟢 HIGH-VALUE Features MISSING from the PRD

Based on Reddit user feedback and industry trends (2025–2026), these features are **more impactful** than several planned Phase 2/3 items:

### 1. 📍 Hierarchical Locations
> *"House → Room → Shelf → Box"*

**Priority: HIGH — Add to Phase 1 or early Phase 2**

| Factor | Assessment |
|--------|-----------|
| User demand | **#1 most requested** feature on Reddit for home inventory apps |
| Effort | Low-medium — one new `Location` model with self-referential parent |
| Impact | Transforms the app from "asset list" to "I know where everything IS" |
| Your PRD | `locations/` is mentioned in README project structure but has no model, schema, or route |

```prisma
model Location {
  id        Int        @id @default(autoincrement())
  name      String
  parentId  Int?
  parent    Location?  @relation("LocationTree", fields: [parentId], references: [id])
  children  Location[] @relation("LocationTree")
  assets    Asset[]
  userId    String
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

> **❗ Important:** This is the single most impactful feature you're currently missing. "Where is my thing?" is the question users ask more than "what is my thing worth?"

---

### 2. 📧 Email-Forward Receipt Capture
> *Forward purchase confirmation → auto-populate asset*

**Priority: MEDIUM — Phase 2**

Frictionless data entry is the #1 predictor of whether users maintain their inventory. An inbound email parser (e.g., Resend inbound or Postmark) that extracts vendor, date, total, and items would dramatically reduce entry friction.

---

### 3. 🔗 Asset Relationships / Parent-Child
> *"This GPU belongs to this PC build"*

**Priority: MEDIUM — Phase 2**

Your PRD mentions this (#7) but it's buried in the middle of the list. For a PC-component-heavy user, this is essential. Simple implementation:

```prisma
// Add to Asset model:
parentId  Int?
parent    Asset?  @relation("AssetTree", fields: [parentId], references: [id])
children  Asset[] @relation("AssetTree")
```

---

### 4. 📱 Condition Photo Timeline
> *Take a photo every 6 months to document condition*

**Priority: LOW — Phase 3**

Not widely discussed, but uniquely valuable for insurance. A timestamped photo history proves condition over time. Your `Media` model already supports this — just add a `capturedAt` field and a timeline view.

---

## 📊 Dashboard Audit

### What You Currently Have

| Widget | Type | Status |
|--------|------|--------|
| **Total Assets** stat card | KPI card | ✅ Built |
| **Portfolio Value** stat card | KPI card | ✅ Built |
| **Warranty Alerts** stat card | KPI card with color coding | ✅ Built |
| **Recently Added** stat card (last 7 days) | KPI card | ✅ Built |
| **Value by Category** | Donut/pie chart (Recharts) | ✅ Built |
| **Assets by Category** | Bar chart (Recharts) | ✅ Built |

### Current Issues

1. **Data fetching is naive** — `getDashboardOptions()` calls `getAssets()` and fetches *all* assets to compute dashboard stats client-side. This works for < 100 assets but won't scale. Should have a dedicated server function returning pre-aggregated data.
2. **Bar chart is not responsive** — hardcoded `width={500}`, will overflow on mobile.
3. **Two category charts is redundant** — "Value by Category" (donut) and "Assets by Category" (bar) both answer "how are things distributed?" Just with different metrics. One chart is enough.

---

### 🔴 Dashboard Widgets to REMOVE or MERGE

#### Assets by Category (bar chart) — MERGE into Value by Category

| Factor | Assessment |
|--------|-----------|
| Problem | Two charts showing category breakdowns is redundant. Users glance at a dashboard; two similar charts create noise |
| Solution | The **Value by Category** donut chart already has a legend with per-category values. Add the **count** next to each legend item (e.g., "Electronics — ৳45,000 · 12 items"). One chart, both data points |
| Industry best practice | Dashboards should have max 5–7 widgets. Two category charts wastes a slot |

#### Recently Added (stat card) — RETHINK

| Factor | Assessment |
|--------|-----------|
| Problem | "3 added in last 7 days" is not very actionable as a number. It's more useful as a **list** |
| Solution | Replace the stat card with a **Recent Activity feed** (see "Widgets to Add" below). The count can become a subtitle on the feed |

---

### 🟢 Dashboard Widgets to ADD

#### 1. ⏰ Warranty Expiry List (HIGH priority)

**Why:** The "Warranty Alerts" stat card shows a count (e.g., "3") but doesn't tell you *which* assets are expiring. You have to leave the dashboard to find out.

| Design | Details |
|--------|---------|
| Type | Compact list / table inside a card |
| Data | Asset name, category icon, expiry date, days remaining, status badge (🔴 expired, 🟡 ≤30 days, 🟢 ≤90 days) |
| Limit | Show top 5, with "View all →" link to filtered assets page |
| Effort | Low — data is already fetched; just needs a sorted/filtered render |

**This is the #1 missing dashboard widget.** A number without context forces an extra click.

---

#### 2. 💎 Most Valuable Assets (MEDIUM priority)

**Why:** Users want to know at a glance which items represent the most financial risk.

| Design | Details |
|--------|---------|
| Type | Ranked list (top 5–8 assets by purchase price) |
| Data | Asset name, brand, purchase price, category badge |
| Limit | Top 5 with "View all →" |
| Effort | Low — simple sort of existing data |
| Industry backing | One of the most common widgets in asset management dashboards |

---

#### 3. 🔄 Recent Activity Feed (MEDIUM priority)

**Why:** Replaces the "Recently Added" stat card with something actionable. Shows what you've been doing in the app.

| Design | Details |
|--------|---------|
| Type | Chronological activity feed (card with list items) |
| Data | Uses `AssetHistory` model — "Created Main Desktop PC", "Updated Sony A7III", "Archived old keyboard" |
| Visual | Compact rows: icon (action type) + asset name + relative timestamp ("2h ago") |
| Limit | Last 8–10 actions |
| Effort | Low-medium — needs a query on `AssetHistory` joined with `Asset` |

---

#### 4. 🏷️ Condition Breakdown (LOW priority)

**Why:** A quick health snapshot — how many assets are new vs. used vs. refurbished?

| Design | Details |
|--------|---------|
| Type | Small horizontal stacked bar or three mini stat pills |
| Data | Count per `AssetCondition` enum value (new / used / refurbished) |
| Visual | Color-coded: green (new), blue (used), amber (refurbished) |
| Effort | Very low — simple group-by on existing data |

---

#### 5. 📋 Incomplete Assets / Data Quality (LOW priority — Phase 2)

**Why:** Gamifies inventory completion. "5 assets missing photos", "3 assets without serial numbers".

| Design | Details |
|--------|---------|
| Type | Small card with list of "tasks" |
| Data | Count assets where: `serial IS NULL`, `media.length === 0`, `warrantyExpiry IS NULL`, `categoryId IS NULL` |
| Visual | Checklist-style with completion percentage |
| Effort | Low — null-check queries on existing fields |
| Industry backing | Called "Quick Audit" widget — one of the most engaging dashboard patterns because it drives user action |

---

### 📐 Recommended Dashboard Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  STAT CARDS (4-column grid on desktop, 2-col on tablet)        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ Total   │ │Portfolio│ │Warranty │ │Condition│              │
│  │ Assets  │ │ Value   │ │ Alerts  │ │Breakdown│              │
│  │  47     │ │ ৳2.3M   │ │  3 ⚠️   │ │🟢28 🔵15│              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
├──────────────────────────────────────────────────────────────────┤
│  CHARTS + LISTS (2-column grid on desktop)                     │
│  ┌────────────────────┐  ┌────────────────────┐                │
│  │ Value by Category  │  │ Warranty Expiry     │                │
│  │ (donut + legend    │  │ (sorted list)       │                │
│  │  with counts)      │  │ ⚠ Camera - 5 days   │                │
│  │                    │  │ ⚠ Monitor - 12 days  │                │
│  │                    │  │ ✓ Keyboard - 89 days │                │
│  └────────────────────┘  └────────────────────┘                │
├──────────────────────────────────────────────────────────────────┤
│  BOTTOM ROW (2-column grid)                                    │
│  ┌────────────────────┐  ┌────────────────────┐                │
│  │ Most Valuable      │  │ Recent Activity     │                │
│  │ 1. Desktop PC ৳80k │  │ 🟢 Created GPU      │                │
│  │ 2. Sony A7III ৳65k │  │ ✏️ Updated Monitor   │                │
│  │ 3. MacBook ৳55k    │  │ 📦 Archived Mouse   │                │
│  └────────────────────┘  └────────────────────┘                │
└──────────────────────────────────────────────────────────────────┘
```

### Dashboard Summary Table

| Widget | Action | Rationale |
|--------|--------|-----------|
| Total Assets stat | ✅ KEEP | Core KPI, already good |
| Portfolio Value stat | ✅ KEEP | Core KPI, already good |
| Warranty Alerts stat | ✅ KEEP | Core KPI, but needs the expiry *list* below it |
| Recently Added stat | 🔴 REPLACE | Replace with **Recent Activity feed** — a list is more useful than a count |
| Value by Category donut | ✅ KEEP | Core chart, add item counts to legend |
| Assets by Category bar | 🔴 REMOVE | Redundant — merge count into donut legend |
| Warranty Expiry list | 🟢 ADD | **#1 priority** — the count is useless without names/dates |
| Most Valuable Assets | 🟢 ADD | High value, low effort, universally expected |
| Recent Activity feed | 🟢 ADD | Replaces "Recently Added" with actionable context |
| Condition Breakdown | 🟢 ADD | Tiny widget, very low effort, useful health check |
| Incomplete Assets | 🟡 ADD (Phase 2) | Gamification — drives user engagement |

---

## Revised Roadmap Recommendation

### Phase 1 — MVP (finish what's started)
- [ ] Asset CRUD (complete)
- [ ] Image & receipt upload
- [ ] Search + filters (FTS5)
- [ ] Dashboard improvements (see dashboard audit above)
- [ ] **Hierarchical Locations** ← NEW, high impact

### Phase 2 — Value & Utility
- [ ] Maintenance **log** (not schedule/reminders)
- [ ] Simple depreciation (computed, no engine)
- [ ] Asset relationships (parent/child)
- [ ] Multi-currency (display-time FX, no snapshots)
- [ ] CSV import/export
- [ ] Insurance report PDF
- [ ] Dashboard: Incomplete Assets / Data Quality widget

### Phase 3 — Polish
- [ ] Receipt OCR auto-fill
- [ ] PWA + offline
- [ ] **Email-forward capture** ← NEW
- [ ] Sell/dispose tracking

### Dropped / Deferred Indefinitely
- ~~Price/market value history~~ → Use `estimatedValue` field
- ~~Loan/borrow tracking~~ → Use `notes` field
- ~~Maintenance schedule & reminders~~ → Use Google Calendar
- ~~QR/barcode labels~~ → Defer until 500+ assets
- ~~Saved views~~ → URL params are sufficient
- ~~Audit log~~ → Not needed until multi-user
- ~~Bulk edit~~ → Not needed until 200+ assets
- ~~Multi-user / household sharing~~ → Massive scope, separate project

---

## Final Summary

| Category | Count | Examples |
|----------|-------|---------|
| **Cut entirely** | 5 | Loan tracking, price history, audit log, saved views, bulk edit |
| **Simplify dramatically** | 2 | Depreciation (no engine), maintenance (log only, no reminders) |
| **Defer** | 2 | QR labels, multi-user |
| **Missing & high-value** | 3 | Hierarchical locations, asset relationships, email capture |
| **Keep as-planned** | 4 | CSV export, insurance report, multi-currency, OCR |
| **Dashboard: remove** | 2 | Assets by Category bar chart, Recently Added stat card |
| **Dashboard: add** | 4 | Warranty expiry list, most valuable assets, recent activity feed, condition breakdown |

> **💡 Tip:** The single highest-impact change you can make to the roadmap: **Add Locations to Phase 1.** It's low effort, high value, and directly answers the most common user question: *"Where did I put that?"*
