# BURNSVILLE — ISOLATED CATALOGUE MIGRATION PLAN

**STATUS:** PREPARED / NO DATABASE MUTATION AUTHORISED

**BRANCH:** `modernise/burnsville-v2-integration-spec`

## PURPOSE

Define the safe procedure for replacing the legacy third-party catalogue with the final approved Burnsville catalogue after the product-card/design handoff is complete.

This document does not authorise any Preview/Production Atlas write.

## NON-NEGOTIABLE SAFETY RULES

- Do not use `backend/seeder.js` for the replacement.
- Do not delete users or orders as part of catalogue replacement.
- Do not run `backend/bootstrap.js` against a non-empty product collection.
- Do not use old product/asset maps to fill missing final data.
- Do not infer product facts.
- Do not mutate Preview/Production Atlas until the final dataset and migration procedure are explicitly approved.

## INPUTS REQUIRED BEFORE MIGRATION WORK BEGINS

The complete final replacement set must be available in one reviewable source with:

- approved product identity
- approved image path
- approved description where required
- approved heat where required
- approved flavour profile where required
- approved ingredients where required
- approved pairings where required
- approved price
- approved stock/availability

Any unresolved field blocks the final migration dataset from being considered complete.

## MIGRATION STRATEGY

Use an isolated replacement procedure rather than the legacy destructive seeder.

The migration should operate only on product records and should preserve unrelated collections.

### PRE-MIGRATION

1. Confirm target environment explicitly.
2. Export/backup the current product collection.
3. Record current product IDs, names and image paths for rollback evidence.
4. Validate the final Burnsville replacement dataset offline.
5. Validate all referenced image assets exist and return successfully.
6. Confirm the final dataset contains no third-party product/brand content.
7. Confirm rating/review handling has been explicitly approved.

### ISOLATED TEST

Before any shared environment:

1. Run the replacement procedure against a local/isolated test database.
2. Verify only intended product records are affected.
3. Verify users remain unchanged.
4. Verify orders remain unchanged.
5. Verify product API list/detail responses.
6. Verify cart/order creation using replacement products.
7. Verify rerun behaviour is controlled and does not duplicate products.
8. Verify rollback from the saved product snapshot.

### PREVIEW GATE

Preview migration may proceed only after explicit approval.

After migration:

- compare product count with approved handoff
- compare every product identity/path with approved source
- verify no third-party catalogue entries remain exposed
- run automated API/frontend QA
- run responsive visual QA
- run cart/checkout regression

### PRODUCTION GATE

Production migration remains blocked until Preview passes and Production migration is explicitly authorised.

Production procedure must use the same reviewed dataset and migration code/procedure that passed isolated and Preview QA.

## ROLLBACK REQUIREMENT

Rollback must restore the pre-migration product collection without touching users/orders.

Do not rely on the legacy seeder as rollback.

## LEGACY FILE CLEANUP

Repository cleanup is a separate post-migration step.

Do not delete old third-party product assets/source until:

- final Burnsville data is live in the intended environment
- image paths resolve
- frontend/product/cart/order QA passes
- rollback evidence is preserved

## PASS CONDITION

A catalogue migration is considered safe only when:

- only intended product records change
- approved Burnsville data matches source exactly
- users/orders are preserved
- all product assets resolve
- home/shop/product/cart/checkout work
- rollback is proven
- no unauthorised environment was modified
