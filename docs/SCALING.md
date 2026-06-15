# Scaling Plan — Ephesus Mediterranean Delights

---

## Targets

| Metric         | Current (5 branches) | Target (100+ branches) |
|----------------|----------------------|------------------------|
| Branches       | 5                    | 100+                   |
| Products       | ~500                 | 5,000+                 |
| Customers      | ~5,000               | 100,000+               |
| Orders/month   | ~1,000               | 1,000,000+             |
| Concurrent req | ~50                  | 2,000+                 |

---

## Database Strategy

### Read / Write Splitting

```
App → Write → PostgreSQL Primary
App → Read  → PostgreSQL Replica(s)
```

Laravel config:
```php
'pgsql' => [
    'read'  => ['host' => env('DB_READ_HOST')],
    'write' => ['host' => env('DB_HOST')],
    ...
]
```

### Partitioning (PostgreSQL)

- `stock_movements` — partitioned by month (`created_at`)
- `audit_logs`      — partitioned by month (`created_at`)
- `orders`          — range partition by year/quarter

### Indexing Strategy

All foreign keys indexed. Additional compound indexes:
- `(branch_id, status)` on orders, transfers, stock_movements
- `(product_id, moved_at)` on stock_movements
- `(status, channel)` on orders
- GIN index on `products.name` for full-text search

---

## Caching Strategy

```
Layer 1 — Redis Cache
  ├── Analytics dashboard: TTL 5 min
  ├── Product catalog:     TTL 30 min
  ├── Branch settings:     TTL 60 min
  └── Auth sessions:       TTL 120 min

Layer 2 — HTTP Cache
  ├── Public product pages: Cache-Control public, max-age=300
  └── Static assets:        Cache-Control public, max-age=31536000 (immutable)

Layer 3 — CDN (CloudFront)
  └── All public reads served from edge
```

---

## Queue Architecture (Horizon)

```
Queue Workers (Redis)
├── high   — notifications, order confirms   (5 workers)
├── default — stock movements, emails        (3 workers)
└── low    — reports, exports, analytics     (2 workers)
```

Horizon supervisor config in `config/horizon.php`:
- Auto-scaling based on queue size
- Supervisors per environment (local/production)

---

## Application Scaling (AWS)

```
Internet → Route 53 → CloudFront (CDN)
                           ↓
              Application Load Balancer
              ↙            ↘
        EC2 Auto Scaling Group
        (PHP-FPM + Nginx)
              ↓
        ElastiCache Redis (cluster mode)
              ↓
        RDS PostgreSQL (Multi-AZ + Read Replicas)
```

### Auto Scaling Rules
- CPU > 70% for 5 min → scale out
- CPU < 30% for 15 min → scale in
- Min: 2 instances, Max: 20 instances

---

## Meilisearch Scaling

- Dedicated Meilisearch instance (EC2 c6i.xlarge)
- Indexes: `products` (primary), `dealers`
- Scout queue driver for async indexing

---

## Event-Driven Architecture

Heavy operations go through queued events:

| Event                    | Handler                          | Queue   |
|--------------------------|----------------------------------|---------|
| `OrderConfirmed`         | Send confirmation email          | high    |
| `TransferApproved`       | Notify destination branch        | high    |
| `TransferReceived`       | Update stock + send notification | default |
| `StockBelowThreshold`    | Alert branch manager             | default |
| `BatchExpiringSoon`      | Alert warehouse manager          | default |
| `DealerApproved`         | Send welcome email + SMS         | default |
| `ReportRequested`        | Generate PDF in background       | low     |

---

## Multi-Region Expansion

For international branches:
1. Deploy read replicas in nearest AWS region (EU, APAC, US)
2. Use CloudFront regional edge caches
3. Implement multi-tenancy by `country` + `region_id` on Branch model
4. Timezone stored per branch, all DB timestamps in UTC
5. Multi-currency: store all amounts in base currency + exchange rate at time of transaction

---

## Performance Budget

| Endpoint type    | P50  | P95  | P99  |
|------------------|------|------|------|
| Auth             | 50ms | 200ms| 500ms|
| Dashboard KPIs   | 100ms| 400ms| 800ms|
| Product listing  | 80ms | 300ms| 600ms|
| Order creation   | 150ms| 600ms| 1.5s |
| Stock adjustment | 100ms| 400ms| 800ms|

All exceeded P99 thresholds trigger CloudWatch alarm.
