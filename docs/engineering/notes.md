# Engineering Notes

This file records implementation context that benefits from a short explanation. Durable product and working rules remain in `AGENTS.md`.

## React component identity

Use stable, unique keys for dynamic lists:

1. Prefer persisted database identifiers.
2. Use deterministic composite identifiers when the underlying data has no persisted identifier.
3. Use an array position only for short-lived, presentation-only content whose order and membership cannot change.

Generated recipes need an identity that remains stable during one search response and changes when a genuinely new search is performed. Avoid deriving identity from a title alone because duplicate or similarly named results are possible.

When a list can contain overlapping preference sources, deduplicate the data before rendering rather than relying on increasingly complicated key suffixes.

Keep a narrow implementation decision in a test or nearby code comment rather than creating another general document.
