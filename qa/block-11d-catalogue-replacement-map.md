# Block 11D — Burnsville Catalogue Replacement Map

Status: DRAFT SOURCE MAP — NO DATABASE MUTATION
Branch: `modernise/burnsville-v2`

## Purpose

Replace the legacy third-party hot-sauce catalogue with an original Burnsville catalogue while preserving the approved ecommerce layout and existing commerce behaviour.

This file is a source-planning artifact only. It must not seed, migrate, overwrite, or delete Preview/Production database records.

## Locked constraints

- No Hot Ones, Last Dab, or other borrowed brand/product naming.
- No copied third-party product descriptions.
- Burnsville heat scale is 1–10 only.
- Existing product/card/detail layouts remain unchanged.
- Ratings and review counts start at `0`; legacy review totals must not be carried into replacement products.
- Product image paths below are reserved names only until approved assets exist.
- Product assets should use a consistent Burnsville treatment: square WebP, centred bottle, clean cream/neutral background, consistent apparent bottle scale, no third-party logos or packaging.

## 10-product replacement catalogue

| # | Product | Heat | Flavour profile | Price | Asset filename |
|---|---|---:|---|---:|---|
| 1 | Burnsville Green Ember | 2/10 | Lime · herb · mild green chilli | R89.99 | `burnsville-green-ember.webp` |
| 2 | Burnsville Citrus Spark | 3/10 | Lemon · yellow chilli · bright acid | R119.99 | `burnsville-citrus-spark.webp` |
| 3 | Burnsville Mango Fuse | 4/10 | Mango · ginger · warm chilli | R149.99 | `burnsville-mango-fuse.webp` |
| 4 | Burnsville Redline | 5/10 | Red chilli · garlic · vinegar | R179.99 | `burnsville-redline.webp` |
| 5 | Burnsville Smoke Signal | 6/10 | Smoked pepper · tomato · garlic | R199.99 | `burnsville-smoke-signal.webp` |
| 6 | Burnsville Habanero Drive | 7/10 | Habanero · citrus · roasted onion | R229.99 | `burnsville-habanero-drive.webp` |
| 7 | Burnsville Reaper Ridge | 8/10 | Reaper chilli · roasted pepper · dark fruit | R279.99 | `burnsville-reaper-ridge.webp` |
| 8 | Burnsville Furnace Nine | 9/10 | Superhot chilli · smoke · sharp vinegar | R329.99 | `burnsville-furnace-nine.webp` |
| 9 | Burnsville Black Label | 10/10 | Superhot chilli · black garlic · molasses | R399.99 | `burnsville-black-label.webp` |
| 10 | Burnsville Final Warning | 10/10 | Superhot chilli · concentrated pepper · citrus | R449.99 | `burnsville-final-warning.webp` |

## Original catalogue copy

### 1. Burnsville Green Ember
A bright entry-level sauce built around green chilli, lime and fresh herbs. Mild enough for everyday use, with enough pepper character to keep the finish lively.

Pairings: tacos, grilled chicken, eggs.

### 2. Burnsville Citrus Spark
Yellow chilli and lemon lead a sharp, clean sauce with a quick spark of heat. Designed for food that needs acidity without overpowering the main flavour.

Pairings: seafood, roast vegetables, sandwiches.

### 3. Burnsville Mango Fuse
Ripe mango and ginger bring sweetness first, followed by a steady medium chilli finish. Fruity rather than sugary, with enough acidity to stay balanced.

Pairings: chicken wings, pork, rice bowls.

### 4. Burnsville Redline
A direct red-chilli sauce with garlic and vinegar at the centre. Medium heat, savoury body and a clean finish make it the core all-purpose bottle in the range.

Pairings: burgers, pizza, fries.

### 5. Burnsville Smoke Signal
Smoked pepper, tomato and garlic create a deeper sauce with a slow-building burn. Built for grilled food and anything that benefits from a darker savoury edge.

Pairings: braai meat, burgers, roasted potatoes.

### 6. Burnsville Habanero Drive
Habanero heat is balanced with citrus and roasted onion for a fast, aromatic burn. Hot enough to demand attention without losing the flavour underneath it.

Pairings: chicken, tacos, grilled vegetables.

### 7. Burnsville Reaper Ridge
A serious superhot sauce using reaper-style heat with roasted pepper and dark-fruit notes. The burn climbs quickly but the sauce remains food-focused rather than being heat for heat's sake.

Pairings: steak, chilli, smoked meat.

### 8. Burnsville Furnace Nine
A high-heat sauce with smoke, sharp vinegar and a concentrated pepper profile. It is designed for small doses and a long finish.

Pairings: wings, ribs, stews.

### 9. Burnsville Black Label
Black garlic and molasses give this 10/10 sauce a dense savoury base before the superhot chilli takes over. Dark, rich and intentionally intense.

Pairings: beef, barbecue, slow-cooked dishes.

### 10. Burnsville Final Warning
The top-end Burnsville bottle: concentrated pepper heat, a tight citrus edge and minimal sweetness. Intended for experienced chilli users and very small servings.

Pairings: use sparingly in sauces, marinades and challenge-level dishes.

## Data defaults for replacement products

All replacement catalogue records should begin with:

- `brand: 'Burnsville'`
- `category: 'Hot Sauce'`
- `rating: 0`
- `numReviews: 0`
- `reviews: []`
- heat values constrained to `1..10`
- stock values set explicitly during the later isolated catalogue migration step

## Asset treatment gate

Before all ten images are produced, approve one prototype product image first.

Prototype candidate: **Burnsville Redline**.

Required treatment:

- square WebP
- consistent bottle scale with existing cards/detail view
- Burnsville label only
- cream/neutral background compatible with `#F3EDE4`
- no third-party trademarks, labels, product photography or copied packaging
- no embedded promotional text outside the bottle label

## Mutation boundary

Do not run the legacy seeder.
Do not rerun the safe catalogue bootstrap against an environment that already contains products.
Do not mutate Preview/Production Atlas records until an isolated migration/update procedure is separately reviewed and approved.
