# Backend Testing Guide

Run these steps locally to install deps and execute tests for the backend.

1. Install dependencies

```bash
cd Backend
npm install
```

2. Run tests

```bash
npm test
```

This runs Jest in band. If you want coverage:

```bash
npx jest --coverage --runInBand
```

Notes
- Ensure your environment doesn't point to a production MongoDB when running tests; the test suite uses an in-memory MongoDB instance (`mongodb-memory-server`).
- If you see TypeScript declaration errors for `supertest`, install `@types/supertest`:

```bash
npm install -D @types/supertest
```

If you hit other type errors, please paste the failing stack and I'll help patch them.
