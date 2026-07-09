# Security

Security baseline for Amara Studio, maintained via the `web-security-baseline`
skill. Update this file whenever the security posture changes.

> Legend: ✅ done · ⚠️ partial / accepted risk · ⬜ not applicable / todo

## Status: demo

Last reviewed: 2026-07-09 · Stack: Next.js 16, Prisma 7, Neon Postgres, Vercel, Resend

## Baseline

| Area | State | Notes |
|---|---|---|
| Security headers (CSP, XFO, nosniff, Referrer/Permissions-Policy, HSTS) | ✅ | `next.config.ts` `headers()`; CSP has `frame-ancestors 'none'` |
| `poweredByHeader` off | ✅ | `next.config.ts` |
| Secrets gitignored, none committed | ✅ | keys: DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET, BLOB_READ_WRITE_TOKEN, RESEND_API_KEY, EMAIL_FROM, SITE_URL, CRON_SECRET |
| Fonts self-hosted | ✅ | `next/font/google` self-hosts at build (no runtime Google request) — `lib/fonts.ts` |
| DB access parameterized | ✅ | Prisma only, no raw SQL |
| Capability tokens CSPRNG | ✅ | `managementToken` = `randomBytes(32).base64url` (`lib/booking.ts`) |
| Auth inside every privileged action | ✅ | `requireAdmin()` in all `lib/actions/*` + admin server actions |
| Public auth/mutation endpoints rate-limited | ✅ | `lib/rate-limit.ts` — login (10/5min), booking API (8/10min) |
| Input validation on public endpoints | ✅ | `lib/validation.ts`, booking/availability routes |
| User values HTML-escaped in emails | ✅ | `escapeHtml` in `lib/email.ts` |
| Upload validation (type/size/random name) | ✅ | `lib/actions/staff.ts` — JPEG/PNG/WebP, ≤5 MB, UUID name |
| Secret-gated endpoints fail closed + timing-safe | ✅ | `app/api/cron/reminders/route.ts` |
| Cookies httpOnly/secure/sameSite + session expiry | ✅ | signed expiring token (`lib/admin-auth.ts`) |
| Dependency audit (`npm audit`) | ⚠️ | 5 moderate, all in build/dev tooling (postcss via Next, Prisma CLI dev chain), not runtime path; `--force` would downgrade Next 16→9, not applied |

## What was actively tested (OWASP WSTG, live, non-destructive)

- Recon / exposed files: `.env`, `.git/config`, `package.json`, source maps → all 404/403 ✅
- Forced browsing: all `/admin/*` → 307 redirect to login ✅
- HTTP method tampering: PUT/DELETE/GET on `/api/bookings` → 405 ✅
- Injection: SQLi payloads on `/api/availability` → clean 404 (no SQL error); XSS input not reflected ✅
- Business logic: booking in the past and outside working hours → 409 rejected, no record/email created ✅
- Unauth server-action invocation: forged action to public route → 404, to `/admin/*` → 307 login ✅

## Residual risk (accepted for a demo)

- Single shared admin password, no MFA. Rate-limiting slows brute force; the
  real safeguard is a long random `ADMIN_PASSWORD` in the Vercel env.
- In-memory rate limiter is per-instance on serverless (best-effort).
- Authenticated admin flows were not exercised (no credentials used in testing).

## Before this goes to a real client

- [ ] Per-client unique long random secrets in the host env
- [ ] Per-user auth (hashed pw / MFA) if the salon needs multiple logins
- [ ] Distributed rate limiting (Upstash / `@vercel/kv`) if real traffic
- [ ] DSGVO: Impressum, Datenschutzerklärung, data minimization, processors/DPAs (Vercel, Neon, Resend)
- [ ] Transactional email: SPF + DKIM + DMARC on the sending domain
- [ ] DB backups / PITR enabled on Neon
- [ ] Error monitoring without PII; alert if the daily reminder cron fails
- [ ] Least-privilege DB user / scoped API keys / function roles
- [ ] Final live pass (headers, no exposed files, authz, injection, logic)

## Reporting a vulnerability

Please contact the maintainer directly rather than opening a public issue.
