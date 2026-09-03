# BLOCK 11D — FINAL PRODUCT INTEGRATION CHECKLIST

**STATUS:** PREPARED / WAITING FOR FINAL PRODUCT HANDOFF

**BRANCH:** `modernise/burnsville-v2-integration-spec`

## RULE

Do not infer missing product facts. Do not redesign supplied artwork. Do not mutate Preview/Production Atlas during this checklist.

## 1. HANDOFF INTAKE

- [ ] Final product count confirmed by user/design handoff.
- [ ] Every product has an approved name/identifier.
- [ ] Every product has an approved visual asset.
- [ ] Integration mode is stated for every final card: FLAT PRODUCT ASSET / PAGE DESIGN REFERENCE / BOTTLE OR PRODUCT ART.
- [ ] Any missing heat, price, stock, description, ingredients, pairings or commercial status is explicitly marked unresolved.
- [ ] No old catalogue document is used to fill a missing value automatically.

## 1A. INTEGRATION DECISION GATES

Do not decide these automatically from historical code or old visual work.

- [ ] Confirm whether the Shop should retain the current API page size of 10 products.
- [ ] If final catalogue count exceeds 10, confirm whether pagination is acceptable or should be changed.
- [ ] Confirm which products, if any, should be featured in the homepage four-product showcase.
- [ ] Confirm whether finished product cards are flat runtime images, page-design references, or bottle/product art.
- [ ] Confirm whether the current single `image` product field is sufficient.
- [ ] If separate supporting/gallery images are required, approve schema/UI expansion before implementation.
- [ ] Confirm whether the current MongoDB-ID product routes remain acceptable; do not introduce slugs automatically.
- [ ] Confirm the heat strip remains a visual guide unless heat filtering is explicitly requested.

## 2. ASSET QA

For every delivered final asset:

- [ ] File opens correctly.
- [ ] Dimensions recorded.
- [ ] Aspect ratio recorded.
- [ ] Transparency recorded where applicable.
- [ ] No accidental crop.
- [ ] No white border or new outer frame.
- [ ] No unwanted padding.
- [ ] No stretching.
- [ ] No colour shift after optimisation.
- [ ] Product text/logo matches the approved source.
- [ ] Web-ready copy visually compared with the approved source.
- [ ] Final runtime path resolves successfully.

## 3. PRODUCT DATA QA

For every replacement product record:

- [ ] Name matches approved source.
- [ ] Identifier/code matches approved source.
- [ ] Image path matches the final approved runtime asset.
- [ ] `brand` is Burnsville.
- [ ] `category` is Hot Sauce unless explicitly changed by approved source.
- [ ] Description is approved source copy only.
- [ ] Heat is approved and within runtime schema range.
- [ ] Flavour profile is approved source data only.
- [ ] Ingredients are approved source data only.
- [ ] Pairings are approved source data only.
- [ ] Price is approved commercial data only.
- [ ] Stock is approved commercial data only.
- [ ] New replacement rating begins at 0 unless real migrated review data is separately authorised.
- [ ] New replacement review count begins at 0 unless real migrated review data is separately authorised.
- [ ] No legacy third-party review content is carried forward.

## 4. FRONTEND FLOW QA

### HOME

- [ ] Product image loads.
- [ ] Product name is correct.
- [ ] Price displays correctly.
- [ ] View sauce route works.
- [ ] Quick add works when in stock.
- [ ] Sold-out state works when stock is zero.
- [ ] Homepage featured-product selection matches the approved decision.

### SHOP

- [ ] All expected products appear across the approved catalogue browsing structure.
- [ ] Pagination/search behaviour still works.
- [ ] If pagination remains, final product count/pages match the approved decision.
- [ ] No legacy third-party product appears.
- [ ] Product cards preserve responsive layout.

### PRODUCT DETAIL

- [ ] Correct product loads by ID.
- [ ] Correct image/artwork displays.
- [ ] Name displays correctly.
- [ ] Description displays correctly when supplied.
- [ ] Heat displays correctly when supplied.
- [ ] Flavour profile displays correctly when supplied.
- [ ] Ingredients display correctly when supplied.
- [ ] Pairings display correctly when supplied.
- [ ] Price displays correctly.
- [ ] Stock/availability displays correctly.
- [ ] Quantity cannot exceed available stock.
- [ ] Add to cart works.
- [ ] Review UI still works.
- [ ] If gallery/supporting imagery was explicitly approved, all gallery assets and controls pass.

### CART

- [ ] Correct product name.
- [ ] Correct product image.
- [ ] Correct price.
- [ ] Quantity controls work.
- [ ] Stock ceiling is respected.
- [ ] Remove item works.

### CHECKOUT / ORDER

- [ ] Product identity survives cart → checkout.
- [ ] Product image/path remains valid where displayed.
- [ ] Price and quantity remain correct.
- [ ] Order creation still succeeds in isolated QA.

### ADMIN

- [ ] Product edit page loads.
- [ ] Image path can be updated.
- [ ] Name/brand/category fields persist.
- [ ] Heat/flavour/pairings/ingredients fields persist.
- [ ] Price and stock persist.
- [ ] Admin authentication remains required.

## 5. RESPONSIVE QA

Test at minimum:

- [ ] 1440px desktop.
- [ ] 768px tablet.
- [ ] 390px mobile.
- [ ] 320px narrow mobile.
- [ ] No horizontal overflow.
- [ ] Product artwork is not clipped.
- [ ] Text remains readable.
- [ ] Buttons remain reachable and tappable.
- [ ] Cart/checkout controls remain usable.
- [ ] Heat-level strip remains intact.

## 6. TECHNICAL QA

- [ ] Frontend production build passes.
- [ ] Existing automated QA passes.
- [ ] API product list passes.
- [ ] API product detail passes.
- [ ] Cart flow passes.
- [ ] Order flow passes in isolated QA.
- [ ] No broken image requests.
- [ ] No console errors introduced by product integration.
- [ ] No unexpected dependency changes.

## 7. LEGACY CLEANUP GATE

Do not begin this section until the replacement catalogue passes sections 1–6.

Then verify before deletion:

- [ ] No runtime record references old third-party image paths.
- [ ] No frontend surface exposes third-party product names.
- [ ] No required rollback source would be destroyed.
- [ ] Legacy cleanup inventory has been checked against the repository tree.

Only then remove or supersede, as separately authorised:

- [ ] legacy third-party entries in `backend/data/products.js`
- [ ] third-party product JPGs under `frontend/public/images/`
- [ ] orphan legacy product JPGs identified in the readiness audit
- [ ] stale catalogue documentation that claims rejected filenames/design decisions are final
- [ ] README instructions that encourage the destructive legacy seeder workflow
- [ ] README third-party catalogue/source references that no longer describe the modernised project

## 8. DATABASE MIGRATION GATE

- [ ] Migration procedure reviewed separately.
- [ ] Target environment confirmed.
- [ ] Backup/rollback plan confirmed.
- [ ] Final replacement dataset reviewed as a complete set.
- [ ] No legacy destructive seeder used.
- [ ] Bootstrap not run against non-empty product collection.
- [ ] Preview/Production Atlas mutation has explicit approval.

## FINAL PASS

`ASSET → DATA → API → HOME/SHOP → PRODUCT DETAIL → CART → CHECKOUT/ORDER`

must pass with approved Burnsville data and artwork only.
