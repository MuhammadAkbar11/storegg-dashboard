When generating git commit messages, always follow the Conventional Commits specification:

- Format: <type>(<scope>): <description>
- Types: feat, fix, chore, docs, style, refactor, perf, test.
- Description: lowercase, imperative mood, no period at the end.
- Scope: optional, can be anything specifying the section of the codebase affected (e.g., "auth", "ui", "api").
- Examples:
  - feat(auth): add JWT token support
  - fix(ui): resolve button alignment issue
  - chore: update dependencies
  - docs: improve API documentation
  - style: reformat code with Prettier
  - refactor(api): simplify data fetching logic
  - perf: optimize image loading
  - test: add unit tests for user service
