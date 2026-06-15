# Security Checklist — Ephesus Mediterranean Delights

---

## Authentication

- [x] Laravel Sanctum tokens with expiry (30 days)
- [x] Token rotation on refresh
- [x] TOTP-based Two-Factor Authentication (2FA) per user
- [x] 2FA enforced for super-admin and company-admin roles
- [x] Bcrypt password hashing (cost factor 12)
- [x] Password minimum 8 characters, requires upper + number + special char
- [x] Brute-force protection: throttle `/auth/login` to 10 req/min
- [x] Account lockout after 5 failed attempts
- [x] Secure password reset via signed URLs (expiry: 60 min)
- [x] Last login IP + timestamp tracked

## Authorization

- [x] Spatie Permission (role + permission matrix)
- [x] Branch-level isolation via `BranchAccessMiddleware`
- [x] Policy classes per resource (`TransferPolicy`, `OrderPolicy`)
- [x] API routes scoped by role prefix (`/admin`, `/branch`, `/dealer`, `/customer`)
- [x] Frontend `AuthGuard` + `RoleGuard` prevents unauthorized UI access
- [x] Super-admin cannot be deleted via API

## API Security

- [x] Nginx rate limiting (60 req/min general, 10 req/min auth)
- [x] Laravel Throttle middleware on sensitive endpoints
- [x] CSRF protection via Sanctum stateful domains
- [x] CORS configured to allow only trusted origins
- [x] Request validation via FormRequest classes + Zod (frontend)
- [x] SQL injection protection via Eloquent ORM (parameterized queries)
- [x] No raw query string interpolation

## Transport & Infrastructure

- [x] HTTPS enforced (TLS 1.2+ via Nginx + ACM)
- [x] HSTS header (`Strict-Transport-Security: max-age=31536000`)
- [x] Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`
- [x] Content Security Policy header
- [x] `server_tokens off` in Nginx
- [x] File upload validation (type + size + extension whitelist)
- [x] Media files stored in S3 (not served via PHP)
- [x] `.env` excluded from version control
- [x] Secrets managed via AWS Secrets Manager / GitHub Actions secrets

## Audit & Monitoring

- [x] Audit log on every create/update/delete/approve/transfer
- [x] Stores: user, IP, user agent, old values, new values
- [x] Audit logs are append-only (no delete endpoint)
- [x] Sentry error tracking with PII scrubbing
- [x] CloudWatch alarms for 5xx error spikes
- [x] Slow query logging (>1000ms)
- [x] Laravel Horizon for queue monitoring

## Data

- [x] Sensitive fields (password, 2FA secret) hidden from JSON responses
- [x] Database backups daily → S3 (Spatie Backup)
- [x] Backups encrypted at rest (AWS KMS)
- [x] No PII logged in application logs
- [x] PostgreSQL connection via SSL
- [x] Read replica for analytics queries (separates from write path)

## Dependencies

- [x] Composer audit in CI (`composer audit`)
- [x] npm audit in CI (`npm audit`)
- [x] Dependabot configured for automatic security PRs
- [x] Docker images from official verified sources
- [x] Pin Docker image tags (no `latest` in production)
