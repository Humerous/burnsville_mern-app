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
- treat old catalogue or asset maps as final authority
- seed or mutate Preview/Production Atlas
- run the legacy destructive seeder
- run catalogue bootstrap against a database that already contains products

Historical catalogue data is retained only for comparison in:

- `docs/BURNSVILLE-PRODUCT-CATALOGUE-REFERENCE.md`
- `backend/data/burnsville-product-catalogue.json`

Those references must not fill missing final values automatically.

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

The rejected 517×941 crop/padding filename map has been removed from the integration branch and must not be recreated as authority.

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

If the final product-card design is a `PAGE DESIGN REFERENCE`, this is the primary implementation surface.

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

The old third-party runtime catalogue and images may be removed only after the final Burnsville replacement set is integrated and verified.

The rejected Burnsville asset-map files are different: because they are known-invalid planning artifacts, they have been removed from this integration branch before final product handoff.

Runtime legacy cleanup includes, when separately authorised:

- third-party entries in `backend/data/products.js`
- third-party product JPGs under `frontend/public/images/`
- any stale runtime references to those files

Do not remove runtime legacy data until replacement QA passes.

## FINAL INTEGRATION SEQUENCE

1. Receive final approved handoff.
2. Confirm integration mode.
3. Record final product count and identity.
4. Validate source assets visually.
5. Approve final filenames and runtime paths.
6. Optimise runtime copies without changing artwork.
7. Build the replacement product dataset from approved values only.
8. Validate the dataset offline.
9. Integrate into isolated/local QA first.
10. Test Home, Shop, Product Detail, Cart, Checkout/Order and Admin.
11. Test responsive behaviour at 1440, 768, 390 and 320 widths.
12. Review isolated migration procedure.
13. Migrate a shared environment only after explicit approval.
14. Remove remaining third-party runtime data/assets only after replacement QA passes.
15. Run final performance and Preview regression.

## PASS CONDITION

Integration passes only when the final approved handoff travels through:

`ASSET → DATA → API → HOME/SHOP → PRODUCT DETAIL → CART → CHECKOUT/ORDER`

without reinterpretation, missing assets, legacy third-party content, or unauthorised database changes.
