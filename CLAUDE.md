# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
npx playwright test                          # Run all e2e tests (requires dev server)
npx playwright test tests/e2e.spec.ts        # Run specific test file
npx playwright test --project=chromium      # Run on a single browser
```

## Architecture

**Calma** is a Next.js 16 (App Router) emotional wellness app built as a TFM (university final project). It uses Supabase for auth and database, Tailwind CSS v4, shadcn/ui components, and Zod for server-side validation.

### Data flow pattern

All data mutations use Next.js Server Actions (`'use server'`). Each feature area has an `actions.ts` that:
1. Creates a Supabase server client via `src/utils/supabase/server.ts`
2. Validates input with a Zod schema from `src/lib/schemas.ts`
3. Performs the DB operation
4. Calls `revalidatePath()` and/or `redirect()`

Client components that need to call actions use `useState` + manual async invocation (not `useFormState`/`useActionState`) — see `src/app/therapists/contact/contact-form.tsx` as the canonical example.

### Auth

Auth is handled by Supabase in `src/app/(auth)/` (route group, no shared layout except the auth-specific one). The middleware at `src/utils/supabase/middleware.ts` protects `/profile` and `/journal` routes, redirecting unauthenticated users to `/login` and authenticated users away from `/login` and `/register`.

### Static vs. live data

- **Exercises** and **Therapists** are hardcoded static arrays in `src/data/`. No DB reads for these.
- **Journal entries**, **user progress**, and **profiles** are stored in Supabase.
- The therapist contact form (`src/app/therapists/actions.ts`) is mocked — it validates with Zod then returns success after a 1s delay without writing to DB.

### Database

Schema is in `db_schema.sql`. Applied migrations live in `migrations/`. Key tables:
- `profiles` — auto-created by trigger on `auth.users` insert
- `journal_entries` — user diary entries with mood enum
- `user_progress` — tracks which exercises a user has completed (unique per user+exercise)

All tables have RLS enabled. The anon key is used in the browser; the service role key is never used client-side.

### Routing

| Path | Auth required | Notes |
|---|---|---|
| `/` | No | Landing page |
| `/exercises` | No | Static data |
| `/exercises/[id]` | No | Completion toggle requires auth (redirects) |
| `/journal` | Yes | Middleware redirect |
| `/journal/new` | Yes | Middleware redirect |
| `/profile` | Yes | Middleware redirect |
| `/therapists` | No | Static data |
| `/therapists/contact?id=<id>` | No | Contact form — requires `?id` param or redirects |

### Environment variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
