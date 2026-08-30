# Active Roadmap

## Current work
- [ ] **Shopping List Data Model Refactor**: Transition the shopping list from a collection of individual items to a single document containing an array of items.
  - *Reason*: Reduces Firestore read/write costs from $O(N)$ to $O(1)$ per regeneration.
