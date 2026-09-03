# Block 11D — Burnsville Catalogue Replacement Map

Status: LOCKED SOURCE MAP — NO DATABASE MUTATION
Branch: `modernise/burnsville-v2`

## Purpose

Replace the legacy third-party hot-sauce catalogue with the approved original Burnsville catalogue while preserving the approved ecommerce layout and existing commerce behaviour.

This file is a source-control artifact only. It must not seed, migrate, overwrite, or delete Preview/Production database records.

## Authority

The previous draft 10-product replacement map is superseded.

Authoritative product sources:

- `docs/BURNSVILLE-LOCKED-PRODUCT-CATALOGUE.md`
- `backend/data/burnsville-product-catalogue.json`

## Locked constraints

- Product design is closed unless explicitly reopened.
- Use the exact approved Burnsville `EST. 2020` crest only.
- No Hot Ones, Last Dab, PuckerButt, Marie Sharp's, or other borrowed brand/product naming or packaging.
- No copied third-party product descriptions.
- Existing product/card/detail page layout remains unchanged.
- Core Collection uses the approved cream-label system.
- Limited Vintage uses the approved special vintage label system and vertical fluorescent/highlighter `LIMITED VINTAGE` stripe.
- Use one consistent master bottle geometry across the range.
- Ratings and review counts start at `0`; legacy review totals must not be carried into replacement products.
- Do not invent price, stock, final heat values, or commercial availability where not separately approved.
- Do not mutate Preview/Production Atlas as part of this source update.

## Core Collection — 10 products

| # | Name | Flavour |
|---|---|---|
| 01 | **LIME STRIKE** | Jalapeño + Lime |
| 02 | **GOLD RUSH** | Aji Amarillo + Pineapple |
| 03 | **CITRUS FLARE** | Habanero + Yuzu |
| 04 | **RED FORGE** | Roasted Red Pepper + Cayenne + Garlic |
| 05 | **CULTURE SHOCK** | Fermented Fresno / Red Chilli + Garlic |
| 06 | **OAK & EMBER** | Chipotle + Smoked Plum + Oak |
| 07 | **TROPIC FIRE** | Scotch Bonnet + Mango |
| 08 | **VIOLET FUSE** | Bolivian Rainbow + Blackberry |
| 09 | **BLACK GHOST** | Ghost Pepper + Black Garlic |
| 10 | **REAPER RESERVE** | Carolina Reaper + Molasses |

## Limited Vintage Series — 6 products

| Code | Name | Flavour | Ribbon |
|---|---|---|---|
| R-13 | **CASK 13** | Carolina Reaper + Smoked Rooibos + Black Lime | Acid Yellow |
| X-27 | **DESERT STATIC** | 7 Pot Primo + Prickly Pear + Strawberry | Neon Pink |
| F-09 | **GOLDEN FERMENT** | Fatalii + Cape Gooseberry + Fermented Honey | Neon Green |
| V-17 | **VELVET BURN** | Chocolate Habanero + Sour Cherry + Cacao Nib | Electric Blue |
| B-42 | **NIGHT ORCHARD** | 7 Pot Douglah + Black Plum + Star Anise | Electric Purple |
| XX-99 | **FINAL BURN** | Superhot Blend + Tamarind + Burnt Pineapple | Bright Orange |

## Data defaults for later isolated catalogue migration

When the database migration is separately authorised, new replacement records should begin with:

- `brand: 'Burnsville'`
- `category: 'Hot Sauce'`
- `rating: 0`
- `numReviews: 0`
- `reviews: []`
- stock set explicitly from approved commercial data
- price set explicitly from approved commercial data
- heat values constrained to `1..10`
- image paths mapped only to final approved production assets

## Runtime boundary

`backend/data/products.js` still contains the legacy runtime/bootstrap catalogue and is **not** replaced by this source-control update because final price, stock and production image mappings are not yet approved source data.

Do not run the legacy seeder.
Do not rerun the safe catalogue bootstrap against an environment that already contains products.
Do not mutate Preview/Production Atlas until the isolated catalogue migration/update procedure is separately reviewed and approved.

## Next implementation gate

1. Produce/map the final approved web-ready product assets without redesigning them.
2. Lock exact image filenames.
3. Lock commercial price and stock values.
4. Lock any remaining product heat values required by the runtime schema.
5. Replace `backend/data/products.js` from the authoritative catalogue source.
6. Run the isolated catalogue migration procedure only after explicit approval.
7. Complete Stage 11 — Action 5/5 Final Performance + Full Preview Regression.
