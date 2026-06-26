# Project Roadmap & Technical Debt

## High Priority (Pre-Deployment)
- [ ] **Create Composite Index**: In the Firebase Console, create a composite index for the `suggestions` collection.
  - **Collection**: `suggestions`
  - **Field 1**: `userId` (Ascending)
  - **Field 2**: `createdAt` (Descending)
  - **Query Scope**: `Collection`
  - *Reason*: Required for the optimized history query with server-side sorting.

## Medium Priority (Optimization)
- [ ] **Shopping List Data Model Refactor**: Transition the shopping list from a collection of individual items to a single document containing an array of items.
  - *Reason*: Reduces Firestore read/write costs from $O(N)$ to $O(1)$ per regeneration.

## Completed
- [x] **App.tsx Refactor**: Extracted helper modules and cleaned up component logic.
- [x] **Gemini Service Overhaul**: Implemented structured output, lean prompts, and robust error handling.
- [x] **Firestore Audit**: Optimized queries, tightened security rules, and verified listener hygiene.
- [x] **Utility Tests**: 24/24 tests passing.
- [x] **Token Usage Monitoring**: Added server-side logging for token counts. Monitor `candidatesTokenCount` post-deployment to determine if `maxOutputTokens` can be safely reduced from 16000.
