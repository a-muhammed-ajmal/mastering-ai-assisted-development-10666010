# AGENTS.md — Pagination Utility

This is an example of a persistent memory file built up over multiple RALPH iterations.

## Patterns & Conventions

- **Cursor-based pagination, not offset-based**: Each cursor points to an item. No offset integer.
- **Base64-encoded cursors**: Cursors are opaque strings. Format: `Buffer.from(itemId).toString('base64')`
- **Generic types**: All functions use `<T extends { id: string }>`. This keeps the utility flexible.
- **Response shape**: Always `{ data: T[], nextCursor: string | null, hasMore: boolean }`

## Gotchas Discovered

### Loop 1: Basic Implementation
- Empty dataset must return `{ data: [], nextCursor: null, hasMore: false }` — not throw an error
- Cursor encoding: Use `Buffer.from(itemId, 'utf8').toString('base64')` (not UTF-16 or other)
- The `after` parameter is required to use a cursor. If omitted, start from the beginning.

### Loop 2: Edge Cases
- **Cursor pointing to deleted item**: The API should not throw. Instead, fall back to the beginning of the dataset.
- **Page size of 0**: Should throw a `ValidationError`, not return empty results silently.
- **Negative page size**: Should throw `ValidationError` too.

### Loop 3: Type Safety
- Jest `toMatchObject` is better than `toEqual` for partial assertions in pagination tests.
- Generic constraint `<T extends { id: string }>` catches problems at compile time.
- Don't allow `first: undefined` — make it required in the options parameter.

## Test Coverage Status

### Implemented (All Passing ✅)
- Happy path: multi-page navigation works correctly
- Empty dataset: returns correct empty response
- Single page: all items fit on one page, `hasMore: false`
- Last page detection: `hasMore: false` when no more items remain
- Invalid cursor handling: cursor from different dataset doesn't break
- Cursor decoding: base64 cursor decodes to correct item ID
- Different page sizes: page size 1, 2, 5, 10+ all work

### Not Yet Covered (⬜)
- Concurrent modification: items added/removed during pagination (architectural decision needed)
- Very large datasets: 1M+ items (performance testing, may need pagination strategy change)
- Duplicate item IDs: behavior undefined (should spec this)

## Recent Learnings (Loop 3)

1. **Test structure matters**: Organizing tests by scenario (empty, single-page, multi-page) makes failures clearer than organizing by function.
2. **Cursor format**: Keep cursors simple. Base64-encoded ID is better than JSON or base64(JSON).
3. **Error types**: Create custom error classes (`ValidationError`, `CursorError`) instead of throwing generic `Error`.
4. **TypeScript generics**: The constraint `<T extends { id: string }>` is essential. It prevents callers from passing items without IDs.

## Next Steps If Extended

- [ ] Performance testing with large datasets (run pagination on 10k items, measure time)
- [ ] Cursor versioning: if pagination logic changes, old cursors should fail gracefully
- [ ] Serialization: support encoding pagination state to JSON for caching (e.g., in Redis)
- [ ] Bidirectional pagination: support `before` cursor for going backward

## Files Modified

- `src/paginate.ts` — Main implementation
- `tests/pagination.test.ts` — 7 test cases covering happy path and edge cases

## Commits

```
Loop 1:
  - paginate: implement cursor encoding and decoding
  - paginate: add empty dataset handling

Loop 2:
  - paginate: fix cursor format (use base64, not hex)
  - paginate: add validation for page size

Loop 3:
  - paginate: refactor to custom error types
  - paginate: expand test coverage for edge cases
```

---

**Last Updated By**: RALPH Loop (Loop 3)
**Status**: All tests passing ✅
**Ready for**: Extension or new features
