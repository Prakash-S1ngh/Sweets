# AI Usage Record

This document records how AI was used during development. Keep this file in the repository for auditability and interview transparency.

## Tools used (examples)
- ChatGPT (OpenAI) — prototyping tests, suggesting code patches, and diagnosing TypeScript errors.
- GitHub Copilot — auto-completion and small boilerplate generation.

## Examples of usage
- Backend integration tests: ChatGPT was used to create a scaffold for integration tests using `mongodb-memory-server` and `supertest`. The scaffold was reviewed, types fixed, and adapted to our models and auth middleware.
- UI components: Assistant suggested a small `Modal` component and `SweetCard` 'read more' toggle. Suggestions were reviewed and integrated with Tailwind styles.

## Commit co-authoring
When an AI assistant provided code included in a commit, append a trailer to the commit message:

```
Co-authored-by: ChatGPT <chatgpt@example.com>
```

Replace the tool name and email as appropriate for your own record.

## Notes on responsibility
All AI-suggested code must be reviewed and tested by a human contributor. The contributor signing the commit is responsible for verifying correctness, tests, and license/compliance implications.
