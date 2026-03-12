/**
 * Video 3.1: The RALPH Loop — Autonomous Iteration
 *
 * STUB: This file is a skeleton for the AI agent to complete during the RALPH Loop.
 *
 * The agent's job:
 * 1. Run `npm test`
 * 2. See test failures
 * 3. Implement the paginate function
 * 4. Run `npm test` again
 * 5. Repeat until ALL tests pass (zero failures)
 * 6. Document learnings in AGENTS.md
 *
 * Instructions for the AI agent:
 *
 *   You are implementing a pagination utility. Your task is to implement the
 *   `paginate` function below to pass ALL tests in tests/pagination.test.ts.
 *
 *   Read src/pagination-spec.md for detailed requirements.
 *
 *   Your workflow:
 *   1. Run `npm test` to see the current failures
 *   2. Implement the paginate function
 *   3. Run `npm test` again
 *   4. Fix any failures
 *   5. Repeat until ALL tests pass
 *
 *   Do NOT stop until there are zero test failures.
 *
 *   After all tests pass, write a summary in AGENTS.md documenting:
 *   - Patterns and conventions used
 *   - Gotchas discovered
 *   - Test coverage status
 *   - Learnings for future iterations
 */

export interface PaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function paginate<T extends { id: string }>(
  items: T[],
  options: { first: number; after?: string },
): PaginationResult<T> {
  const { first, after } = options;

  // Handle empty dataset
  if (items.length === 0) {
    return {
      data: [],
      nextCursor: null,
      hasMore: false,
    };
  }

  // Decode the cursor if provided
  let startIndex = 0;
  if (after) {
    try {
      const decodedId = Buffer.from(after, 'base64').toString();
      const foundIndex = items.findIndex(item => item.id === decodedId);
      if (foundIndex !== -1) {
        startIndex = foundIndex + 1;
      }
    } catch {
      // Invalid cursor, start from beginning
      startIndex = 0;
    }
  }

  // Get the slice of items
  const endIndex = startIndex + first;
  const data = items.slice(startIndex, endIndex);

  // Check if there are more items
  const hasMore = endIndex < items.length;

  // Generate next cursor if there are more items
  const nextCursor = hasMore && data.length > 0
    ? Buffer.from(data[data.length - 1].id).toString('base64')
    : null;

  return {
    data,
    nextCursor,
    hasMore,
  };
}
