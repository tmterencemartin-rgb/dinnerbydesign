# DinnerByDesign Engineering Notes

This file records durable implementation principles that are too detailed for `AGENTS.md` but too broad for a single code comment.

## React component identity

Use stable, unique keys for dynamic lists:

1. Prefer persisted database identifiers.
2. Use deterministic composite identifiers when the underlying data has no persisted identifier.
3. Use an array position only for short-lived, presentation-only content whose order and membership cannot change.

Generated recipes need an identity that remains stable during one search response and changes when a genuinely new search is performed. Avoid deriving identity from a title alone because duplicate or similarly named results are possible.

When a list can contain overlapping preference sources, deduplicate the data before rendering rather than relying on increasingly complicated key suffixes.

## Serverless compatibility

- Do not write application logs or state to the local filesystem at runtime.
- Resolve server paths explicitly.
- Treat the serverless environment as read-only and temporary.
- Keep secrets in deployment environment variables.

## User-facing diagnostics

Ordinary users should see a concise explanation and a practical next step. Connection mode, provider response codes and routing details belong in the restricted diagnostics view or server logs.

## Documentation boundaries

- Product-wide working rules belong in `AGENTS.md`.
- Preferences and search behaviour belong in `PREFERENCES_AND_SEARCH_RULES.md`.
- Release procedures belong in `OPERATIONS_AND_RELEASE.md`.
- Public article governance belongs in `PROGRAMMATIC_SEO_PUBLISHING_STANDARD.md`.
- A narrow implementation decision should usually be protected by a test or a nearby code comment rather than a new root-level document.
