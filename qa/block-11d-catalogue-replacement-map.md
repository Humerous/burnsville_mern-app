# BLOCK 11D — BURNSVILLE CATALOGUE REPLACEMENT MAP

**STATUS:** PREPARED / FINAL USER HANDOFF PENDING

**WORKING BRANCH:** `modernise/burnsville-v2-integration-spec`

## PURPOSE

Prepare the replacement of the legacy third-party hot-sauce catalogue with final user-approved Burnsville product data while preserving the existing ecommerce flow.

This file is a source-control planning artifact only. It must not seed, migrate, overwrite, or delete Preview/Production database records.

## CURRENT AUTHORITY

Integration and safety authority:

- `docs/BURNSVILLE-FINAL-PRODUCT-INTEGRATION-SPEC.md`
- `qa/block-11d-final-product-integration-checklist.md`
- `docs/BURNSVILLE-ISOLATED-CATALOGUE-MIGRATION-PLAN.md`

Historical catalogue reference only:

- `docs/BURNSVILLE-PRODUCT-CATALOGUE-REFERENCE.md`
- `backend/data/burnsville-product-catalogue.json`

The historical catalogue reference must **not** be used to fill missing final product facts automatically.

The final user-approved product/design handoff overrides the historical reference wherever they differ.

## LOCKED SAFETY CONSTRAINTS

- Do not invent or rename products.
- Do not invent ingredients, descriptions, heat values, prices, stock, availability, filenames, dimensions, or image paths.
- Do not infer the final product-card integration mode.
- Do not use the rejected 517×941 crop/padding asset map.
- Do not carry forward Hot Ones, Last Dab, PuckerButt, Marie Sharp's, or other third-party product naming, packaging, descriptions, ratings, or reviews into the replacement catalogue.
- Ratings and review counts for new replacement products begin at `0` unless real migrated review data is separately authorised.
- Do not mutate Preview/Production Atlas as part of source preparation.
- Do not run the legacy destructive seeder.
- Do not run catalogue bootstrap against an environment that already contains products.

## CURRENT RUNTIME BOUNDARY

`backend/data/products.js` still contains the legacy runtime/bootstrap catalogue.

It is intentionally unchanged until the final Burnsville handoff is complete and the following values are explicitly known where required:

- final product identity
- final product image/runtime asset
- final integration mode
- final description
- final heat
- final flavour profile
- final ingredients
- final pairings
- final price
- final stock/availability

Any missing value remains unresolved.

## DATA DEFAULTS FOR LATER ISOLATED REPLACEMENT

When an isolated replacement catalogue is separately authorised, new Burnsville records may use only the following general defaults:

- `brand: 'Burnsville'`
- `category: 'Hot Sauce'`
- `rating: 0`
- `numReviews: 0`
- `reviews: []`

All product-specific and commercial values must come from the final approved handoff.

## LEGACY SOURCE TO REPLACE LATER

The current `backend/data/products.js` contains third-party product records and old image paths.

Those records are not removed yet because replacement data has not passed the final integration gates.

The old product JPG assets under `frontend/public/images/` are also retained until the replacement catalogue is integrated and verified.

## NEXT IMPLEMENTATION GATE

When the final product-card/design handoff arrives:

1. Confirm the final product count and identities.
2. Confirm the integration mode for each delivered visual: `FLAT PRODUCT ASSET`, `PAGE DESIGN REFERENCE`, or `BOTTLE / PRODUCT ART`.
3. Record final approved asset dimensions and filenames.
4. Record only approved product data.
5. Build the replacement runtime catalogue in isolation.
6. Run the complete integration checklist.
7. Review the isolated database migration procedure.
8. Only after explicit approval, migrate the replacement catalogue.
9. Remove legacy third-party data/assets only after the replacement system passes QA.
10. Complete Stage 11 final performance and full preview regression.
