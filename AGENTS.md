# Repository Guidelines

This guide keeps contributions consistent for the PuntDonació Vite/React frontend and Express/Mongo backend. Follow the practices below to ship changes safely and quickly.

## Project Structure & Module Organization
- Frontend lives under `src/` with feature modules in `components/`, `layouts/`, `router/`, `providers/`, `stores/`, `hooks/`, and `api/`; shared styling is in `styles/` and `index.css`.
- Backend lives in `server/src/` with `controllers/`, `models/`, `middleware/`, `routes/`, and `utils/`. Mongo config and env loading sit in `server/src/config/`.
- Root config: Vite entry (`main.tsx`, `App.tsx`), `tsconfig.json` with `@/*` path alias, ESLint/Prettier configs, and Docker artifacts (`docker-compose.yml`, `Dockerfile`, `nginx.conf`).

## Build, Test, and Development Commands
- Install deps: `npm install` at the root for the frontend; `cd server && npm install` for the API.
- Frontend dev: `npm run dev` (Vite, port 5173 by default). Build for production: `npm run build`.
- Backend dev: `cd server && npm run dev` (tsx watch). Build/start: `npm run build && npm start`.
- Quality: `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run type-check`; backend type check via `cd server && npm run type-check`.
- Full stack via containers: `docker-compose up --build` brings up MongoDB, API on `:5000`, and Nginx-served frontend on `:3000`.

## Coding Style & Naming Conventions
- Prettier enforces 2-space indent, 100-char line width, semicolons, single quotes, trailing commas (es5), and LF endings. Run `npm run format` before pushing.
- ESLint is strict TypeScript-first (`no-explicit-any`, unused vars fail). Prefer typed props/params and narrow DTOs via Zod schemas.
- Use PascalCase for React components and file names, camelCase for functions/variables, `useX` for hooks, and `@/` imports for intra-frontend modules. Keep components focused; move cross-cutting logic to `lib/` or `hooks/`.

## Testing Guidelines
- No automated test runner is wired yet; add Vitest/React Testing Library for frontend code and supertest/jest for API routes when extending critical flows.
- Co-locate specs as `*.test.ts(x)` beside the module or under `__tests__/`. Include realistic fixtures and mock network/storage boundaries.
- Document any new test command in `package.json` and ensure it passes before opening a PR.

## Commit & Pull Request Guidelines
- Commit messages in history are short, imperative sentences (e.g., `Add form validation`). Keep scope tight and prefer multiple commits for distinct concerns.
- PRs should include: a concise summary of changes, linked issue/reference, screenshots or clips for UI updates, and callouts for schema/env changes (e.g., new env keys or seed data).
- Run lint/format/type-check (and tests if added) before requesting review; note any intentional skips. Avoid committing secrets, `.env`, or log files.

## Environment & Security Tips
- Frontend env: copy `.env.example` to `.env` and set `VITE_API_URL`, timeouts, and map style URL. Backend env (in `server/.env`): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, and rate-limit values; see `server/src/config/env.ts` for defaults and required keys.
- Use the provided `docker-compose.yml` to run Mongo locally; seed data via `cd server && npm run seed` if applicable.
- Rotate secrets for production, and never check credentials, tokens, or database dumps into the repository.
