# BURNSVILLE — FINAL PRODUCT INTEGRATION SPEC

**STATUS:** PREPARED FOR FINAL ASSET HANDOFF

**BRANCH:** `modernise/burnsville-v2-integration-spec`

## PURPOSE

Prepare the Burnsville repository to receive the final product-card work being completed in the separate design chat, without making product, design, pricing, stock, heat, filename, or database decisions in this document.

This is an integration contract only.

## CURRENT BOUNDARY

The product-card design chat owns the final visual/product handoff.

This repository work must not:

- invent or rename products
- invent ingredients, descriptions, heat values, prices, stock, or availability
- redesign product cards or bottle artwork
- treat old asset maps as authority
- seed or mutate Preview/Production Atlas
- run the legacy destructive seeder
- run catalogue bootstrap against a database that already contains products

## REQUIRED FINAL HANDOFF FROM DESIGN CHAT

For every final product, the handoff must provide only approved values:

1. final product name
2. final product identifier or code
3. final approved visual asset
4. final asset filename, once approved
5. final asset role: product-card artwork, product bottle artwork, or page-layout reference
6. final description, if supplied
7. final heat value, if supplied
8. final flavour profile, if supplied
9. final ingredients, if supplied
10. final pairings, if supplied
11. final price, if supplied
12. final stock/availability, if supplied

Any field not supplied remains unresolved. Do not infer it.

## CRITICAL INTEGRATION MODE GATE

Before wiring final product cards into the website, the handoff must state how each final card is intended to be used:

- `FLAT PRODUCT ASSET` — the finished card itself is displayed as the product image.
- `PAGE DESIGN REFERENCE` — the finished card is a visual reference for implementing the interactive React product page.
- `BOTTLE / PRODUCT ART` — the supplied artwork is the product image used inside the existing interactive product UI.

Do not choose this mode automatically.

## CURRENT RUNTIME FLOW

The existing application already follows this data path:

`Mongo Product record`
→ `API product response`
→ `product.image / product.name / product data`
→ `HomeProductShowcase`
→ `ShopScreen`
→ `Product.jsx`
→ `ProductScreen`
→ `Cart`
→ `Checkout / Order`

The final assets should enter this existing data flow rather than creating a parallel product system.

## ASSET DESTINATION

Final public product assets should live in a dedicated Burnsville public asset directory, for example:

`frontend/public/images/burnsville/`

The exact final filenames are not locked by this document.

Do not reuse the rejected 517×941 crop/padding filename map as authority.

## ASSET RULES

When the final design assets arrive:

- preserve the approved composition
- preserve aspect ratio
- do not crop unless the design handoff explicitly authorises a crop
- do not add white borders, frames, padding, backgrounds, or decorative elements
- do not recolour or redraw artwork
- retain transparency where the approved source uses transparency
- use WebP for runtime delivery when conversion does not visibly alter the approved artwork
- keep an approved source-quality copy outside destructive optimisation steps
- verify all exported assets visually after conversion

## PRODUCT DATA MAPPING

The current product schema supports these integration fields:

- `name`
- `image`
- `brand`
- `category`
- `description`
- `heatLevel`
- `flavourProfile`
- `pairings`
- `ingredients`
- `rating`
- `numReviews`
- `price`
- `countInStock`

Only approved values may populate them.

### DEFAULTS ALREADY SAFE FOR A NEW CATALOGUE

Where an isolated replacement catalogue is later authorised:

- `brand`: `Burnsville`
- `category`: `Hot Sauce`
- `rating`: `0`
- `numReviews`: `0`
- `reviews`: `[]`

Price, stock, heat, copy, ingredients, pairings and final images must come from approved source data.

## FRONTEND INTEGRATION POINTS

### HOME

`frontend/src/components/home/HomeProductShowcase.jsx`

Uses product data dynamically. Final product images/names flow in from the API.

### SHOP

`frontend/src/screens/ShopScreen.jsx`

Lists API products using the reusable product component.

### PRODUCT CARD

`frontend/src/components/Product.jsx`

Uses:

- `product.image`
- `product.name`
- `product.brand`
- `product.rating`
- `product.numReviews`
- `product.price`
- `product.countInStock`

No product-specific names should be hard-coded here.

### PRODUCT DETAIL

`frontend/src/screens/ProductScreen.jsx`

Already supports:

- image
- name
- description
- heat
- flavour profile
- pairings
- ingredients
- price
- stock
- reviews
- quantity
- add to cart

If the final product-card design is a PAGE DESIGN REFERENCE, this is the primary implementation surface.

### ADMIN

`frontend/src/screens/ProductEditScreen.jsx`

Already exposes catalogue editing fields for:

- name
- image
- brand
- category
- price
- stock
- description
- heat
- flavour profile
- pairings
- ingredients

## DATABASE SAFETY

`backend/data/products.js` currently remains the legacy runtime catalogue.

Do not replace it until:

1. final approved product handoff is complete
2. final integration mode is known
3. final filenames are approved
4. required commercial values are approved
5. replacement data is reviewed as a complete set

`backend/seeder.js` is destructive and must not be used for catalogue replacement.

`backend/bootstrap.js` is safe only for an empty product collection and currently imports `backend/data/products.js`; therefore it must not be used for this replacement until runtime catalogue data is correct and the target environment is verified empty.

Preview/Production Atlas remains unchanged until an isolated migration procedure is separately approved.

## LEGACY CLEANUP BOUNDARY

The old third-party catalogue and images may be removed only after the final Burnsville replacement set is integrated and verified.

Legacy cleanup includes, when authorised:

- `backend/data/products.js` third-party catalogue entries
- old third-party JPG product assets under `frontend/public/images/`
- rejected asset-map documents/data
- stale catalogue statements that incorrectly claim old asset filenames or visual decisions are final

Do not delete legacy files before replacement assets and runtime records are proven working.

## FINAL ASSET HANDOFF CHECK

For each product, verify:

- correct approved product
- correct approved artwork
- correct filename/path
- no crop or distortion
- no unexpected border/background
- correct responsive behaviour
- correct alt text/name
- correct product detail route
- correct cart item image/name
- correct checkout/order image/name
- no third-party branding remains in the live product experience

## RESPONSIVE QA TARGETS

At minimum test:

- desktop: 1440px
- tablet: 768px
- mobile: 390px
- narrow mobile: 320px

Also verify intermediate responsive behaviour rather than relying only on four screenshots.

## IMPLEMENTATION ORDER AFTER FINAL DESIGN HANDOFF

1. Receive approved product handoff.
2. Confirm integration mode.
3. Validate source files and dimensions.
4. Optimise copies without altering the approved artwork.
5. Place assets in the final public asset directory.
6. Build the complete replacement product-data set.
7. Review product names, paths, commercial data and heat values against approved source.
8. Replace the legacy runtime catalogue in source control.
9. Run local/isolated database migration tests only.
10. Run frontend build and automated QA.
11. Run desktop/tablet/mobile visual QA.
12. Verify home, shop, product detail, cart, checkout and admin.
13. Only then prepare the separately authorised Preview/Production catalogue migration.
14. Remove legacy third-party content after the replacement passes.

## PASS CONDITION

This integration phase passes only when the approved final Burnsville product set flows correctly through:

`ASSET → PRODUCT DATA → API → HOME/SHOP → PRODUCT DETAIL → CART → CHECKOUT/ORDER`

with no invented product data, no visual alteration, no third-party catalogue content exposed to users, and no unauthorised production database mutation.
