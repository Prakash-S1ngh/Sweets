# Contributing

Thanks for contributing to the Sweet Shop project. This file outlines the contribution workflow, testing expectations, and how to record AI-assisted work.

- Branching
  - Use feature branches: `feat/<short-desc>` or `fix/<short-desc>`.
  - Open pull requests against `main` and request at least one reviewer.

- Commit messages
  - Use conventional commits style: `type(scope): short description`.
  - For changes that included AI assistance, append a co-author trailer in the commit message, for example:

    ```
    feat: add place-order endpoint

    Used ChatGPT to draft initial test and controller skeleton; reviewed and adapted.

    Co-authored-by: ChatGPT <chatgpt@example.com>
    ```

  - Replace the example assistant name/email with the actual assistant record you maintain.

- Tests
  - Backend: run `cd Backend && npm install && npm test`.
  - Frontend: run `cd frontend && npm install && npm test`.
  - New features should include tests where applicable (integration tests for auth/order flow, unit tests for logic-heavy helpers).

- AI-assisted changes
  - Document each AI-assisted change either in the commit message (preferred) or in `docs/AI_USAGE.md` with a short note describing: the tool used, the prompt (or summary), and what you reviewed/changed from the generated output.

If you want, I can add a pre-push Git hook that scans commit messages for the `Co-authored-by:` trailer and warns when it's missing for certain files. Ask and I will scaffold it for you.
