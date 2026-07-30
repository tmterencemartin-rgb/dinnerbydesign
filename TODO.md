# Project Roadmap & Technical Debt

## Medium priority
- [ ] **Shopping List Data Model Refactor**: Transition the shopping list from a collection of individual items to a single document containing an array of items.
  - *Reason*: Reduces Firestore read/write costs from $O(N)$ to $O(1)$ per regeneration.

## Completed
- [x] **Suggestions Composite Index**: Added the maintained `suggestions` collection index for `userId` ascending and `createdAt` descending.
- [x] **App.tsx Refactor**: Extracted helper modules and cleaned up component logic.
- [x] **Gemini Service Overhaul**: Implemented structured output, focused prompts and plain-English error handling.
- [x] **Firestore Audit**: Optimized queries, tightened security rules, and verified listener hygiene.
- [x] **Utility and workflow tests**: The maintained automated suite covers search utilities, dietary safety, measurement conversion, planner behaviour, persistence, shopping lists, pantry data, preference migration and search lifecycle.
- [x] **Token Usage Monitoring**: Added server-side logging for token counts. Monitor `candidatesTokenCount` post-deployment to determine if `maxOutputTokens` can be safely reduced from 16000.
