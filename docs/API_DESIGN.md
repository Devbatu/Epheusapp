# API Design — Ephesus Mediterranean Delights

## Conventions

- Base URL: `https://api.ephesus.com/api/v1`
- All responses: `application/json`
- Authentication: `Authorization: Bearer <sanctum_token>`
- Dates: ISO 8601 (`2024-01-15T14:30:00Z`)
- Pagination: `?page=1&per_page=20`
- Filtering: `?filter[status]=active&filter[branch_id]=uuid`
- Sorting: `?sort=-created_at` (prefix `-` for DESC)
- Includes: `?include=branch,items.product`

## Response Envelope

```json
{
  "data": { ... },       // single resource
  "message": "Created."
}

{
  "data": [ ... ],       // collection
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 20,
    "total": 198
  }
}

{
  "message": "Validation failed.",  // error
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

## Auth Endpoints

| Method | Endpoint                 | Description              | Rate Limit |
|--------|--------------------------|--------------------------|------------|
| POST   | /auth/login              | Login → returns token    | 10/min     |
| POST   | /auth/logout             | Revoke current token     | —          |
| GET    | /auth/me                 | Current user profile     | —          |
| POST   | /auth/refresh            | Rotate token             | —          |
| POST   | /auth/password/forgot    | Send reset link          | 5/min      |
| POST   | /auth/password/reset     | Reset with token         | —          |
| POST   | /auth/2fa/enable         | Enable 2FA               | —          |
| POST   | /auth/2fa/verify         | Verify 2FA code          | 5/min      |
| POST   | /auth/2fa/disable        | Disable 2FA              | —          |

---

## Admin API  `/api/v1/admin/*`

Roles: `super-admin`, `company-admin`

### Branches
| Method | Endpoint                           | Permission         |
|--------|------------------------------------|--------------------|
| GET    | /admin/branches                    | branches.view      |
| POST   | /admin/branches                    | branches.create    |
| GET    | /admin/branches/:id                | branches.view      |
| PUT    | /admin/branches/:id                | branches.edit      |
| DELETE | /admin/branches/:id                | branches.delete    |
| PATCH  | /admin/branches/:id/toggle-status  | branches.edit      |
| GET    | /admin/branches/:id/dashboard      | branches.view      |
| GET    | /admin/branches/:id/performance    | branches.view      |

### Products
| Method | Endpoint                              | Permission       |
|--------|---------------------------------------|------------------|
| GET    | /admin/products                       | products.view    |
| POST   | /admin/products                       | products.create  |
| GET    | /admin/products/:id                   | products.view    |
| PUT    | /admin/products/:id                   | products.edit    |
| DELETE | /admin/products/:id                   | products.delete  |
| POST   | /admin/products/:id/images            | products.edit    |
| DELETE | /admin/products/:id/images/:media_id  | products.edit    |

### Dealers
| Method | Endpoint                           | Permission        |
|--------|------------------------------------|-------------------|
| GET    | /admin/dealers                     | dealers.view      |
| GET    | /admin/dealers/:id                 | dealers.view      |
| POST   | /admin/dealers/:id/approve         | dealers.approve   |
| POST   | /admin/dealers/:id/reject          | dealers.approve   |
| PUT    | /admin/dealers/:id/pricing         | dealers.manage    |
| PUT    | /admin/dealers/:id/credit          | dealers.manage    |

### Reports
| Method | Endpoint                           | Permission       |
|--------|------------------------------------|------------------|
| GET    | /admin/reports/stock               | reports.view     |
| GET    | /admin/reports/sales               | reports.view     |
| GET    | /admin/reports/branch-performance  | reports.view     |
| GET    | /admin/reports/transfers           | reports.view     |
| GET    | /admin/reports/profitability       | reports.view     |
| GET    | /admin/reports/dealer-sales        | reports.view     |
| POST   | /admin/reports/export/:type        | reports.export   |

---

## Branch API  `/api/v1/branch/*`

Roles: `branch-manager`, `warehouse-manager`, `sales-representative`

### Inventory
| Method | Endpoint                          | Permission         |
|--------|-----------------------------------|--------------------|
| GET    | /branch/inventory                 | inventory.view     |
| GET    | /branch/inventory/:product_id     | inventory.view     |
| POST   | /branch/inventory/adjust          | inventory.adjust   |
| GET    | /branch/inventory/low-stock       | inventory.view     |
| GET    | /branch/inventory/expiring        | inventory.view     |
| GET    | /branch/stock-movements           | inventory.view     |

### Transfers
| Method | Endpoint                              | Permission          |
|--------|---------------------------------------|---------------------|
| GET    | /branch/transfers                     | transfers.view      |
| POST   | /branch/transfers                     | transfers.create    |
| GET    | /branch/transfers/:id                 | transfers.view      |
| POST   | /branch/transfers/:id/approve         | transfers.approve   |
| POST   | /branch/transfers/:id/reject          | transfers.approve   |
| POST   | /branch/transfers/:id/ship            | transfers.ship      |
| POST   | /branch/transfers/:id/receive         | transfers.receive   |
| POST   | /branch/transfers/:id/cancel          | transfers.create    |

### Orders
| Method | Endpoint                          | Permission       |
|--------|-----------------------------------|------------------|
| GET    | /branch/orders                    | orders.view      |
| POST   | /branch/orders                    | orders.create    |
| GET    | /branch/orders/:id                | orders.view      |
| PATCH  | /branch/orders/:id/status         | orders.edit      |

---

## Customer API  `/api/v1/customer/*`

### Public (no auth)
| Method | Endpoint                         |
|--------|----------------------------------|
| GET    | /shop/products                   |
| GET    | /shop/products/:slug             |
| GET    | /shop/categories                 |
| GET    | /shop/categories/:slug/products  |

### Authenticated (role: customer)
| Method | Endpoint                       |
|--------|--------------------------------|
| GET    | /customer/profile              |
| PUT    | /customer/profile              |
| GET    | /customer/orders               |
| POST   | /customer/orders               |
| GET    | /customer/orders/:id           |
| POST   | /customer/orders/:id/cancel    |
| GET    | /customer/cart                 |
| POST   | /customer/cart                 |
| PUT    | /customer/cart/:id             |
| DELETE | /customer/cart/:id             |
| POST   | /customer/cart/checkout        |
| GET    | /customer/wishlist             |
| POST   | /customer/wishlist/:product_id |

---

## Dealer API  `/api/v1/dealer/*`

| Method | Endpoint                      |
|--------|-------------------------------|
| POST   | /dealer/register              |
| POST   | /dealer/login                 |
| GET    | /dealer/profile               |
| PUT    | /dealer/profile               |
| GET    | /dealer/credit                |
| GET    | /dealer/products              |
| GET    | /dealer/products/:slug        |
| GET    | /dealer/orders                |
| POST   | /dealer/orders                |
| GET    | /dealer/orders/:id            |
| POST   | /dealer/orders/:id/cancel     |

---

## Error Codes

| HTTP Code | Meaning                        |
|-----------|-------------------------------|
| 200       | OK                             |
| 201       | Created                        |
| 204       | No Content (delete)            |
| 400       | Bad Request                    |
| 401       | Unauthenticated                |
| 403       | Forbidden (no permission)      |
| 404       | Not Found                      |
| 409       | Conflict (duplicate, state)    |
| 422       | Validation Error               |
| 429       | Too Many Requests              |
| 500       | Internal Server Error          |
