# BURNSVILLE — INTEGRATION READINESS AUDIT

**STATUS:** READ-ONLY TECHNICAL AUDIT / FINAL PRODUCT HANDOFF PENDING

**BRANCH:** `modernise/burnsville-v2-integration-spec`

## PURPOSE

Record the exact current integration constraints and legacy cleanup scope before the final product-card handoff arrives.

This document does not approve product names, product facts, filenames, final layout implementation, runtime replacement, database migration, or production deployment.

## CURRENT RUNTIME CATALOGUE

`backend/data/products.js` still contains 10 third-party sample products and is still the source imported by the catalogue bootstrap path.

Current runtime sample products:

1. Mellow Habanero | Yuzu Heaven
2. Hot Ones | The Last Dab XXX
3. Torchbearer | Reaper Evil
4. Seed Ranch | Hot Thai Green
5. The Last Dab | APOLLO
6. Puckerbutt | Chocolate Plague
7. Adoboloco | Hamajang Kiawe Smoked Ghost Pepper
8. Hell Fire Detroit | Habanero
9. Hot Ones | The Constrictor
10. Hot Ones | Brain Burner

Do not delete or replace this file until the complete approved Burnsville replacement dataset is ready and isolated QA is authorised.

## LEGACY PUBLIC PRODUCT IMAGES

`frontend/public/images/` currently contains these 12 third-party product JPG files:

- `AdobolocoHamajangKiaweSmokedGhostPepper.jpg`
- `HellFireDetroitHabanero.jpg`
- `HotOneSTheClassic.jpg`
- `HotOnesBrainBurner.jpg`
- `HotOnesTheConstrictor.jpg`
- `HotOnesTheLastDabXXX.jpg`
- `MellowHabaneroYuzuHeaven.jpg`
- `PuckerbuttChocolatePlague.jpg`
- `SeedRanchHotThaiGreen.jpg`
- `ShaquandasWestIndianCurry.jpg`
- `TheLastDabAPOLLO.jpg`
- `TorchbearerReaperEvil.jpg`

10 are referenced by the current `backend/data/products.js` catalogue.

Two files are present in the public image folder but are not referenced by that current 10-product runtime source:

- `HotOneSTheClassic.jpg`
- `ShaquandasWestIndianCurry.jpg`

Treat those as legacy/orphan candidates, but do not delete them until final replacement QA and rollback evidence are complete.

## README LEGACY CONTENT

The repository README still documents:

- importing and destroying sample database data
- sample user credentials
- a legacy database seeder workflow
- historical third-party source/reference material including Heatonist
- historical Heroku-oriented setup language

These items should be revised only after the new catalogue/runtime path is final so the public README accurately describes the modernised Burnsville project and does not encourage destructive legacy seeding.

## FRONTEND PRODUCT DATA FLOW

The product-facing frontend is primarily data-driven.

### HOME

`HomeProductShowcase.jsx` receives products from the API and displays only the first 4 products through:

`products.slice(0, 4)`

This means the final full range will not automatically all appear on the homepage. The homepage featured-product selection strategy remains a future implementation decision; do not infer it from product order.

### SHOP

`ShopScreen.jsx` displays whatever product page the API returns and already supports pagination.

### PRODUCT DETAIL

`ProductScreen.jsx` uses one `product.image` plus structured product fields including description, heat, flavour profile, pairings, ingredients, price, stock and reviews.

### CART / ORDER

The cart copies these product values when an item is added:

- product ID
- name
- image
- price
- stock
- quantity

The order schema also stores one image path per order item.

Therefore the final approved image path must be stable before shared-environment catalogue migration.

## IMPORTANT TECHNICAL CONSTRAINTS

### 1. API PAGE SIZE = 10

`backend/controllers/productController.js` currently uses:

`const pageSize = 10;`

If the final catalogue contains 16 products, the current Shop API will return them across at least 2 pages.

This is not automatically a failure. It is a product/UX decision to be made later:

- keep pagination at 10
- increase page size
- implement another catalogue browsing approach

Do not change it until the final range and intended Shop experience are confirmed.

### 2. PRODUCT MODEL SUPPORTS ONE IMAGE FIELD

The current product schema has a single required:

`image: String`

It does not currently provide a product gallery / thumbnail-array field.

This matters only if the finished product-card design is intended to become a true interactive product gallery.

If the final design handoff is:

- `FLAT PRODUCT ASSET` — existing single-image field may be sufficient.
- `BOTTLE / PRODUCT ART` — existing single-image field may be sufficient.
- `PAGE DESIGN REFERENCE` with multiple separate supporting images — schema/UI expansion may be required.

Do not add gallery fields until the integration mode is explicitly confirmed.

### 3. PRODUCT ROUTES USE MONGODB IDS

Product detail links use:

`/product/:id`

There is no product slug routing requirement in the current system.

Do not introduce slugs unless separately approved.

### 4. HOME SHOWCASE = 4 PRODUCTS

The exact homepage currently displays four catalogue products, not the full catalogue.

Final featured selection/order remains unresolved.

### 5. TOP PRODUCTS = 3

The top-products API sorts current products by authoritative review summary and returns the top three.

No product-specific names are hard-coded in the carousel component.

### 6. SHOP-BY-HEAT IS CURRENTLY A GUIDE, NOT A FILTER

The five updated heat illustrations are implemented as a visual guide:

- Mild 1–3/10
- Medium 4–6/10
- Hot 7–8/10
- Very Hot 9/10
- Extreme 10/10

The current individual heat-level items are not links or filters; the section's CTA routes to `/shop`.

Do not convert it into heat filtering unless separately requested.

## CURRENT SAFE / READY AREAS

These areas already accept product data dynamically and do not need product names hard-coded:

- API product list/detail
- Home product showcase
- Shop product cards
- Product detail
- Cart
- Checkout/order item identity
- Admin product editing
- Top-products carousel

## CURRENT WAITING ITEMS

The following remain blocked on the final approved product handoff:

- final product count
- final product names/codes
- final product visual role / integration mode
- final asset filenames and paths
- final descriptions
- final heat values
- final flavour profiles
- final ingredients
- final pairings
- final prices
- final stock/availability
- homepage featured-product selection
- whether 10-per-page Shop pagination should remain
- whether product gallery/schema expansion is required

## LEGACY CLEANUP ORDER

After final replacement integration passes isolated QA:

1. Confirm no runtime product references old third-party image paths.
2. Confirm no public-facing page exposes old third-party catalogue data.
3. Preserve rollback evidence/snapshot.
4. Replace/supersede `backend/data/products.js` using the approved final dataset.
5. Remove legacy product JPGs no longer referenced.
6. Remove orphan legacy JPGs.
7. Rewrite README legacy seeder/reference sections.
8. Re-run build/API/cart/order/responsive QA.
9. Only then consider shared-environment catalogue migration under the separate migration plan.

## PASS CONDITION FOR READINESS

The repository is considered ready to receive the final handoff when:

- known-invalid asset-map assumptions are removed
- legacy runtime dependencies are inventoried
- data flow is documented
- pagination and single-image constraints are recorded
- database migration remains isolated and blocked pending approval
- no product facts have been invented to fill unresolved fields

At this stage, those preparation conditions are satisfied. Final implementation remains intentionally blocked on the approved product handoff.
