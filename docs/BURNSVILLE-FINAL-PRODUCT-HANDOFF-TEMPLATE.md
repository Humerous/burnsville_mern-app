# BURNSVILLE — FINAL PRODUCT HANDOFF TEMPLATE

**STATUS:** INTAKE TEMPLATE / NO PRODUCT VALUES IMPLIED

Use this document when the separate product-card design workflow finishes.

Do not fill a missing value from historical catalogue files. A blank field remains unresolved until the user explicitly supplies or approves it.

## HANDOFF-LEVEL CONFIRMATION

- Final product count: `PENDING`
- Final handoff approved by user: `YES / NO`
- Final product-card visual direction complete: `YES / NO`
- Runtime integration authorised: `YES / NO`
- Database migration authorised: `YES / NO`

## INTEGRATION MODE DEFINITIONS

Choose one explicit role for each delivered visual:

- `FLAT PRODUCT ASSET` — finished card itself is displayed as an image.
- `PAGE DESIGN REFERENCE` — finished card guides implementation of the interactive React product page.
- `BOTTLE / PRODUCT ART` — supplied bottle/product artwork is used inside the existing interactive product UI.

Do not infer this field.

---

# PRODUCT ENTRY TEMPLATE

Duplicate this section once for every final product.

## PRODUCT

- Final name: `PENDING`
- Final number/code: `PENDING`
- Collection/series: `PENDING`
- User-approved status: `PENDING`

## VISUAL ASSET

- Source file supplied: `PENDING`
- Integration mode: `PENDING`
- Final filename: `PENDING`
- Runtime path: `PENDING`
- Width × height: `PENDING`
- Aspect ratio: `PENDING`
- Transparency: `PENDING`
- WebP conversion approved: `PENDING`
- Crop authorised: `NO unless explicitly approved`
- Padding/frame addition authorised: `NO unless explicitly approved`

## PRODUCT DATA

- Brand: `PENDING`
- Category: `PENDING`
- Description: `PENDING`
- Heat level: `PENDING`
- Flavour profile: `PENDING`
- Ingredients: `PENDING`
- Pairings: `PENDING`
- Price: `PENDING`
- Stock/availability: `PENDING`

## QA CONFIRMATION

- Product identity matches approved source: `[ ]`
- Artwork visually matches approved source: `[ ]`
- No accidental crop: `[ ]`
- No white border/new outer frame: `[ ]`
- No stretching: `[ ]`
- No colour shift after optimisation: `[ ]`
- Runtime image path resolves: `[ ]`
- Home/Shop display passes: `[ ]`
- Product detail passes: `[ ]`
- Cart passes: `[ ]`
- Responsive QA passes: `[ ]`

---

# FINAL DATASET GATE

Do not build or migrate the replacement runtime catalogue until every required product entry is complete enough for its intended use.

Unresolved values must remain explicitly unresolved. They must not be inferred from old repository documents, rejected asset maps, previous experiments, or generated artwork.

Final runtime implementation proceeds only through the approved sequence:

`FINAL HANDOFF → ASSET QA → DATA QA → ISOLATED INTEGRATION → RESPONSIVE/FUNCTIONAL QA → MIGRATION REVIEW → EXPLICIT APPROVAL`
