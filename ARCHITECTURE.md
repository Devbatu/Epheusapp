# Ephesus Mediterranean Delights — Enterprise System Architecture

## Overview

A production-ready, multi-branch ERP + E-Commerce + B2B platform for a Mediterranean food company
with 5 physical branches and international expansion plans.

---

## Technology Stack

### Backend
| Layer        | Technology                 |
|--------------|----------------------------|
| Framework    | Laravel 12                 |
| Language     | PHP 8.4                    |
| Database     | PostgreSQL 16              |
| Cache        | Redis 7                    |
| Queue        | Laravel Horizon (Redis)    |
| Auth         | Laravel Sanctum            |
| Permissions  | Spatie Permission          |
| Search       | Laravel Scout + Meilisearch|
| Storage      | AWS S3 / MinIO             |
| Mail         | AWS SES / Mailgun          |

### Frontend
| Layer        | Technology            |
|--------------|-----------------------|
| Framework    | React 19              |
| Language     | TypeScript 5          |
| Build        | Vite 6                |
| Styling      | TailwindCSS 4         |
| UI Library   | Shadcn UI             |
| State Server | Tanstack Query v5     |
| State Client | Zustand               |
| Forms        | React Hook Form + Zod |
| Charts       | Recharts              |
| Tables       | Tanstack Table        |

### Infrastructure
| Layer        | Technology               |
|--------------|--------------------------|
| Container    | Docker + Docker Compose  |
| Web Server   | Nginx                    |
| CI/CD        | GitHub Actions           |
| Cloud        | AWS (EC2, RDS, S3, SES)  |
| Monitoring   | Sentry + AWS CloudWatch  |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTS                              │
│  [Admin SPA] [Branch SPA] [Dealer Portal] [E-Commerce] │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│                   NGINX (Load Balancer)                 │
│              SSL Termination / Rate Limiting            │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│               Laravel 12 API Application                │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────────┐  │
│  │ /admin  │ │ /branch  │ │/dealer │ │  /customer   │  │
│  └────┬────┘ └────┬─────┘ └───┬────┘ └──────┬───────┘  │
│       └───────────┴───────────┴──────────────┘          │
│              Domain Service Layer (DDD)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Branch│Warehouse│Inventory│Product│Order│Transfer│   │
│  │Finance│Purchase │Dealer   │User   │Analytics    │   │
│  └──────────────────────────────────────────────────┘   │
│              Repository + Event Layer                   │
└─────────┬──────────────┬────────────────────────────────┘
          │              │
┌─────────▼──┐    ┌──────▼──────────────────────────────┐
│ PostgreSQL │    │     Redis                            │
│            │    │  ┌─────────┐  ┌──────────────────┐  │
│ Primary DB │    │  │  Cache  │  │  Queue (Horizon)  │  │
│ Read       │    │  └─────────┘  └──────────────────┘  │
│ Replicas   │    └─────────────────────────────────────┘
└────────────┘
```

---

## Domain-Driven Design Modules

```
Domain/
├── Branch/          — Branch CRUD, dashboards, settings
├── Warehouse/       — Warehouses, zones, shelves
├── Inventory/       — Stock, movements, batches, lots
├── Product/         — Products, variants, categories
├── Order/           — Customer/dealer/branch orders
├── Transfer/        — Inter-branch stock transfers
├── Purchase/        — Suppliers, POs, receiving
├── Finance/         — Income, expenses, cash flow
├── Dealer/          — B2B portal, pricing, credit
├── User/            — Users, roles, permissions
├── Notification/    — Email, SMS, WhatsApp, in-app
└── Analytics/       — Dashboards, KPIs, reports
```

---

## Role Hierarchy

```
SuperAdmin
  └── CompanyAdmin
        ├── RegionalManager
        │     └── BranchManager
        │           ├── WarehouseManager
        │           └── SalesRepresentative
        ├── Customer
        └── Dealer
```

---

## Transfer Workflow

```
[Branch A Request] → PENDING → APPROVED → SHIPPED → RECEIVED
                          ↘ REJECTED
                          ↘ CANCELLED
```

## Order Workflow

```
DRAFT → PENDING → CONFIRMED → PROCESSING → PACKED → SHIPPED → DELIVERED
                                                          ↘ RETURNED
                                           ↘ CANCELLED
```
