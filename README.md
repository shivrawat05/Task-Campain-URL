# Campaign URL Manager & Link Analytics

> An industry-standard, production-grade Campaign URL Management application built with **Node.js (Express)**, **SQLite3**, and **React (Vite)**. Features unique tracking URLs, click redirection (HTTP 302), visitor analytics recording, and an administrative dashboard.

## Core Features

- **Campaign Management**:
  - Create campaigns with **Campaign Name**, unique **Campaign ID (Slug)**, **Destination URL**, and **Status** (`active` | `paused`).
  - Automatic slugification of Campaign IDs with uniqueness validation.
  - Full URL validation (`http://` and `https://` protocol enforcement).
  - Edit existing campaign details (Name, Destination URL, Status).
  - Delete campaigns with safety confirmation modal and automatic cascade of click logs.

- **Unique Tracking & Redirection**:
  - Each campaign receives a unique tracking URL: `http://localhost:5000/r/:campaignId`.
  - When visited:
    - **Active Campaign**: Asynchronously records click metadata (IP address, User Agent, Referer, Timestamp) and immediately redirects (HTTP 302) to the destination URL.
    - **Paused Campaign**: Safely intercepts traffic and displays a branded "Campaign Paused" alert page.

- **Administrative Dashboard & Analytics**:
  - **KPI Metrics Cards**: Total Campaigns, Active Campaigns, Paused Campaigns, Total Clicks, and top-performing campaign indicator.
  - **Real-Time Search & Status Filtering**: Instant search across names, IDs, and destination URLs, with tabs for `All`, `Active`, and `Paused`.
  - **Table & Grid Views**: Flexible view switching suitable for desktop and mobile displays.
  - **One-Click Link Copy**: Copy tracking URLs to clipboard with instant toast notifications.
  - **Quick Status Toggle**: Activate/Pause campaigns in one click with optimistic UI updates.
  - **Deep-Dive Click Analytics Modal**: View detailed visitor audit logs (timestamp, IP, referer, device/browser user-agent).

---

## Architecture & Industry-Standard File Structure

This project follows clean layered architecture (**Controller - Service - Model / Repository pattern**), separation of concerns, defensive validation, and unified error handling:

```
Interview/
├── client/                              # Frontend (React 18 + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # Reusable UI components
│   │   │   │   ├── Modal.jsx            # Accessible modal dialog
│   │   │   │   └── Toast.jsx            # Toast notifications container
│   │   │   ├── campaigns/               # Campaign-specific views
│   │   │   │   ├── CampaignTable.jsx    # Data table with actions & copy link
│   │   │   │   ├── CampaignCard.jsx     # Responsive grid view
│   │   │   │   ├── CampaignFormModal.jsx# Create & Edit modal with live preview
│   │   │   │   ├── DeleteConfirmModal.jsx # Confirmation dialog
│   │   │   │   └── ClickAnalyticsModal.jsx # Visitor stream & click history
│   │   │   └── dashboard/               # Dashboard layout blocks
│   │   │       ├── Header.jsx           # Top navbar with quick actions
│   │   │       └── StatsOverview.jsx    # High-level KPI metrics cards
│   │   ├── context/
│   │   │   └── CampaignContext.jsx      # Centralized state management & toast dispatcher
│   │   ├── services/
│   │   │   └── api.js                   # REST API client with standard error wrapper
│   │   ├── utils/
│   │   │   └── formatters.js            # Date, URL truncation, & number utilities
│   │   ├── App.jsx                      # Main dashboard assembler
│   │   ├── main.jsx                     # React root mount
│   │   └── index.css                    # Modern CSS design system (glassmorphism)
│   ├── index.html
│   ├── vite.config.js                   # Vite dev server + proxy configuration
│   └── package.json
│
├── server/                              # Backend (Node.js + Express + SQLite3)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js              # SQLite connection, migrations & seed data
│   │   │   └── env.js                   # Validated environment configuration
│   │   ├── controllers/
│   │   │   ├── campaign.controller.js   # CRUD & analytics route controllers
│   │   │   └── redirect.controller.js   # 302 redirection & click recording
│   │   ├── services/
│   │   │   └── campaign.service.js      # Business logic & URL formatting
│   │   ├── models/
│   │   │   ├── campaign.model.js        # Campaign queries & aggregations
│   │   │   └── click.model.js           # Click logging & visitor audit queries
│   │   ├── routes/
│   │   │   ├── campaign.routes.js       # /api/v1/campaigns endpoints
│   │   │   ├── redirect.routes.js       # /r/:campaignId tracking endpoint
│   │   │   └── index.js                 # Central route aggregator
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js          # Global error & 404 middlewares
│   │   │   └── validator.js             # Payload & schema validation
│   │   ├── utils/
│   │   │   ├── apiResponse.js           # Standard JSend/REST envelope
│   │   │   └── apiError.js              # Operational HTTP error class
│   │   ├── app.js                       # Express app configuration & middlewares
│   │   └── server.js                    # Server startup & graceful shutdown
│   ├── data/                            # Persistent SQLite database storage
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── package.json                         # Root runner (runs client & server concurrently)
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (Tested on v22.16.0)
- **npm**: v9.0.0 or later

### Quick Start (Run Both Frontend & Backend Together)

From the project root directory:

npm run install:all

# 2. Start both server and client concurrently

npm run dev

````

- Frontend Dashboard: [http://localhost:5173](http://localhost:5173)
- Backend API Server: [http://localhost:5000](http://localhost:5000)
- Health Check: [http://localhost:5000/health](http://localhost:5000/health)

---

### Running Services Separately (Optional)

#### Running the Backend Only
```bash
cd server
npm install
npm run dev
````

_The server will start on port `5000` and automatically initialize `server/data/campaigns.db` with sample seed data._

#### Running the Frontend Only

```bash
cd client
npm install
npm run dev
```

_The Vite frontend will start on port `5173` and automatically proxy `/api` and `/r` requests to the backend._

---

## API Reference

### 1. Campaigns API (`/api/v1/campaigns`)

| Method   | Endpoint                           | Description                                                              |
| -------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `GET`    | `/api/v1/campaigns`                | List all campaigns (supports `?search=...` and `?status=active\|paused`) |
| `GET`    | `/api/v1/campaigns/overview/stats` | High-level metrics counters                                              |
| `GET`    | `/api/v1/campaigns/:id`            | Get single campaign by numeric ID                                        |
| `POST`   | `/api/v1/campaigns`                | Create a new campaign                                                    |
| `PUT`    | `/api/v1/campaigns/:id`            | Update campaign name, destination URL, or status                         |
| `PATCH`  | `/api/v1/campaigns/:id/status`     | Quick toggle/update status (`active` \| `paused`)                        |
| `DELETE` | `/api/v1/campaigns/:id`            | Delete campaign and associated click records                             |
| `GET`    | `/api/v1/campaigns/:id/analytics`  | Get detailed click log & visitor stream                                  |

#### Sample Create Campaign Payload (`POST /api/v1/campaigns`)

```json
{
  "name": "Black Friday Sale",
  "campaign_id": "black-friday-2026",
  "destination_url": "https://example.com/black-friday",
  "status": "active"
}
```

### 2. Tracking & Redirection Endpoint (`/r/:campaignId`)

| Method | Endpoint         | Description                                                                                                                                  |
| ------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/r/:campaignId` | Records visitor IP, User Agent, Referer, and redirects (HTTP 302) to `destination_url` if active. If paused, displays a paused alert screen. |

---
