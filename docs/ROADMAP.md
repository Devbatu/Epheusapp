# Development Roadmap — Ephesus Mediterranean Delights

---

## Phase 1 — Foundation (Weeks 1–4)

### Backend
- [ ] Laravel 12 project bootstrap
- [ ] Docker environment (PHP 8.4 + PostgreSQL + Redis)
- [ ] Authentication (Sanctum + 2FA)
- [ ] Spatie Permission — roles & permissions
- [ ] Audit logging (Spatie Activity Log)
- [ ] Branch CRUD + basic management
- [ ] Warehouse CRUD
- [ ] Product CRUD (simple products)
- [ ] Database migrations (all tables)
- [ ] Base seeder (roles, permissions, 5 branches)

### Frontend
- [ ] Vite + React 19 + TypeScript bootstrap
- [ ] Routing (admin/branch/dealer/customer)
- [ ] Auth store (Zustand + persist)
- [ ] Login / logout flow
- [ ] Admin layout + sidebar
- [ ] Branch layout + sidebar
- [ ] Role-based guards

**Deliverable:** Authenticated multi-role app with branch & product management.

---

## Phase 2 — Inventory & Transfers (Weeks 5–8)

### Backend
- [ ] Stock model + movements ledger
- [ ] Batch / lot / expiration tracking
- [ ] StockService (add, deduct, reserve, adjust)
- [ ] Transfer workflow (pending → approved → shipped → received)
- [ ] Transfer events & notifications
- [ ] Low stock alerts (scheduled command)
- [ ] Expiration alerts (scheduled command)

### Frontend
- [ ] Inventory dashboard per branch
- [ ] Stock adjustment UI
- [ ] Transfer list / detail pages
- [ ] Transfer creation wizard
- [ ] Approve / reject / ship / receive flow
- [ ] Low stock alert widget

**Deliverable:** Full inventory + inter-branch transfer system.

---

## Phase 3 — Orders & Commerce (Weeks 9–13)

### Backend
- [ ] Order management (customer, dealer, branch)
- [ ] Order status workflow + events
- [ ] Cart (persistent + guest session)
- [ ] Wishlist
- [ ] Product search (Meilisearch)
- [ ] Product variants, attributes, images
- [ ] E-Commerce public API
- [ ] Customer registration + profile

### Frontend
- [ ] Public e-commerce storefront
- [ ] Product listing + filters
- [ ] Product detail page
- [ ] Cart + checkout flow
- [ ] Customer account + order history
- [ ] Branch order management UI
- [ ] Admin order management UI

**Deliverable:** Working B2C e-commerce + branch order management.

---

## Phase 4 — B2B Dealer Portal (Weeks 14–16)

### Backend
- [ ] Dealer registration + approval workflow
- [ ] Dealer-specific pricing engine
- [ ] Credit limit management
- [ ] Dealer order flow
- [ ] Minimum order quantity enforcement
- [ ] Dealer dashboard API

### Frontend
- [ ] Dealer registration + status page
- [ ] Dealer shop with B2B prices
- [ ] Dealer order placement
- [ ] Credit limit indicator
- [ ] Admin dealer approval UI

**Deliverable:** Complete B2B dealer portal.

---

## Phase 5 — Finance & Purchase (Weeks 17–19)

### Backend
- [ ] Supplier CRUD
- [ ] Purchase Order workflow
- [ ] PO receiving → auto stock update
- [ ] Supplier payment tracking
- [ ] Finance transactions (income/expense)
- [ ] Cash flow reports

### Frontend
- [ ] Supplier management UI
- [ ] Purchase order creation + receiving
- [ ] Finance dashboard (income/expense)
- [ ] Cash flow chart

**Deliverable:** Purchase management + financial module.

---

## Phase 6 — Analytics, Reports & Notifications (Weeks 20–22)

### Backend
- [ ] Analytics dashboard APIs (with Redis cache)
- [ ] Stock report (export PDF/Excel)
- [ ] Sales report
- [ ] Branch performance report
- [ ] Transfer report
- [ ] Profitability report
- [ ] Dealer sales report
- [ ] Email notifications (SES/Mailgun)
- [ ] SMS notifications (Vonage)
- [ ] WhatsApp notifications (Twilio)
- [ ] In-app notification center

### Frontend
- [ ] Admin analytics dashboard
- [ ] Recharts revenue/sales charts
- [ ] Report generation pages + export
- [ ] Notification bell + dropdown

**Deliverable:** Full reporting, analytics, and notification system.

---

## Phase 7 — Security & Hardening (Weeks 23–24)

- [ ] Penetration testing checklist
- [ ] Rate limiting fine-tuning
- [ ] SQL injection review
- [ ] XSS protection headers
- [ ] CSRF token validation
- [ ] Input sanitization audit
- [ ] Audit log review
- [ ] Password policy enforcement
- [ ] Session management review
- [ ] 2FA enforcement for admin roles
- [ ] Security headers (HSTS, CSP, X-Frame-Options)

---

## Phase 8 — Deployment & Go-Live (Week 25)

- [ ] AWS EC2 provisioning
- [ ] RDS PostgreSQL (Multi-AZ)
- [ ] ElastiCache Redis
- [ ] S3 + CloudFront (media + frontend)
- [ ] Route 53 DNS
- [ ] SSL via ACM
- [ ] GitHub Actions CI/CD
- [ ] Sentry error monitoring
- [ ] CloudWatch alarms
- [ ] Backup strategy (Spatie Backup → S3)
- [ ] Load testing (k6)
- [ ] Rollback plan

---

## Phase 9 — International Expansion Prep (Post-launch)

- [ ] Multi-currency support
- [ ] Multi-language (i18n)
- [ ] Country-specific tax rules
- [ ] International warehouse support
- [ ] Timezone per branch
- [ ] Regional manager dashboards
