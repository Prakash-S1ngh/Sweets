# Sweet Shop — Fullstack (React + Node/TypeScript)

This repository is a fullstack sample project (Sweet Shop) implemented with a TypeScript/Express backend and a React + Vite frontend. The README below covers how to run the app, how the code is organized, and — importantly — practical guidance and prompt templates to use large language models (GPT and Claude) effectively to accelerate frontend development and backend debugging. Use this document when preparing a hiring submission or during paired-work with a remote team (for example, Incubyte).

---

## Quick Summary
- Frontend: React + Vite, Tailwind CSS, Axios, React Router.
- Backend: Node.js + TypeScript, Express, Mongoose (MongoDB).
- Dev tooling: `ts-node-dev` for backend, Vite dev server for frontend.

This project includes authentication, sweets CRUD, cart, and basic order flow with order history.

---

## Getting Started (local)

Prerequisites:
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (Atlas or local instance)

Backend

1. Open terminal and start backend:

```bash
cd Backend
npm install
# set env in .env (see .env.example if present)
npm run dev
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit the frontend (usually on `http://localhost:5173`) and the backend API (default `http://localhost:4000`).

Environment variables (backend `.env`) — typical values:

```
MONGODB_URI=<your-mongo-uri>
JWT_SECRET=<strong-secret>
PORT=4000
```

---

## Project Structure (high-level)

- `Backend/` — Express app, `src/controllers`, `src/models`, `src/routes`.
- `frontend/` — Vite + React app, `src/components`, `src/pages`, `src/Context`.

---

## How I use GPT and Claude (practical, results-focused)

Goal: use AI to speed up frontend implementation, improve UI/UX, and debug backend issues quickly while maintaining code quality and explainability.

General rules when using any LLM:
- Always provide the smallest reproducible context: the relevant file(s), the exact error message, and the desired behavior.
- Ask for incremental patches (single change per prompt) and request that the model output diffs or code blocks you can paste directly.
- Use the model to suggest tests, not just code — ask for unit or integration test examples.

Frontend (GPT / Claude use-cases)
- Use LLMs to prototype components and accessibility improvements. Example prompt:

```text
Context: I have a React + Tailwind project. File X (paste file) renders a product card but lacks accessible labels and keyboard support. Please produce a minimal replacement component (JSX) with: aria attributes, keyboard focus states, responsive layout, and a CSS/Tailwind snippet. Keep logic identical and avoid changing global state.
```

- Use models for UI copy, microcopy, and test cases (component snapshot or RTL tests).
- When asking for visual changes, provide a screenshot or a clear design target (spacing, color tokens, dark mode behavior).

Effective prompt pattern for frontend:
- Problem summary (1–2 lines)
- Files: paste the minimal related files (component + CSS + context hooks)
- Desired outcome (list of bullet acceptance criteria)
- Constraints (do not change X, use Tailwind, keep props the same)

Example concise prompt:

"Improve `SweetCard.jsx` to add 'Read more' toggle for long descriptions, show price with currency symbol, add accessible 'Add to cart' button with aria-live feedback. Provide only the updated component code." 

Backend debugging (GPT / Claude use-cases)
- Use LLMs as a debug assistant: give the server log, TypeScript error, or stack trace, and paste the minimal controller or route code.
- Ask the model to: (1) explain the root cause in plain words, (2) propose a minimal patch, (3) provide tests or curl commands to reproduce.

Example prompt for debugging:

```text
I get this runtime error: [paste exact stack trace]. Relevant file: `controllers/orders.ts` (paste). Expected: POST /api/orders/place should create an order. Please inspect code, find root cause, and provide a minimal fixed patch with explanation.
```

Tips for high-value debugging with LLMs:
- Include versions (Node, TypeScript, packages) and the exact `npm` error output.
- If the error is intermittent, include recent Git diffs or a description of environment changes.
- Request test commands (curl or httpie) to reproduce the issue.

When to use GPT vs Claude
- Use GPT (strong at code generation and editing): quick component scaffolds, refactors, and test generation.
- Use Claude (often helpful for longer, multi-step reasoning): high-level architecture suggestions, security checks, or longer code reviews. Both are valid — cross-validate important changes.

---

## Order / Payment / Data flows (notes to reviewer)
- Orders are created from the `Cart` document: `POST /api/orders/place` creates an `Order` and clears the cart.
- Orders support date range queries: `GET /api/orders?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`.
- Admins can fetch all orders at `/api/orders/all`.


