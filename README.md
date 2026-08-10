# MediWave HMS — Hospital Management System

A full-featured, wave-driven hospital management platform built with **React 18 + TypeScript + Vite + Zustand + Tailwind CSS**.

## Overview

MediWave HMS maps the **Drips Wave** open-source collaboration model to healthcare operations — structuring care delivery into time-boxed wave cycles with case assignments, peer reviews, and performance scorecards.

## Modules

| Module | Description |
|---|---|
| 🏥 Dashboard | Real-time KPIs, bed occupancy, department charts |
| 👤 Patients | Registration, medical records, EHR tabs |
| 📅 Appointments | Calendar (month/day/list), check-in workflow |
| 🗂 Cases | Kanban board, complexity scoring (Trivial/Medium/High) |
| 🌊 Programs & Waves | Sprint-based care programs with rollover logic |
| ⭐ Reviews | Two-way anonymous peer & patient reviews |
| 👨‍⚕️ Staff | Directory, onboarding, appeals workflow |
| 📊 Reports | Analytics charts across all domains |

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool & HMR
- **Zustand** — client state with localStorage persistence
- **Tailwind CSS** — utility-first styling
- **Recharts** — dashboard charts
- **React Hook Form** + **Zod** — form validation
- **date-fns** — date arithmetic
- **React Router v6** — routing with route guards
- **Sonner** — toast notifications

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Type check
npm run typecheck

# Build for production
npm run build
```

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@hospital.com` | `admin123` |
| Doctor | `dr.simmons@hospital.com` | `doctor123` |
| Doctor | `dr.patel@hospital.com` | `doctor123` |
| Receptionist | `l.garcia@hospital.com` | `reception123` |
| Pharmacist | `k.chen@hospital.com` | `pharmacy123` |

## Drips Wave Guidelines

This project follows the [Drips Wave](https://drips.network) contribution workflow:

- **Trivial** issues (100 pts) — typos, small fixes, copy changes
- **Medium** issues (150 pts) — standard features, bug fixes
- **High** issues (200 pts) — complex features, new integrations

Issues unresolved in a wave automatically roll over to the next cycle.

## Project Structure

```
src/
├── components/       # Reusable UI + layout components
│   ├── dashboard/    # Dashboard-specific cards
│   ├── layout/       # AppLayout, Sidebar, TopBar
│   └── ui/           # Button, Badge, Card, Table, etc.
├── data/             # Seed data, constants, lookup tables
├── hooks/            # useAuth, usePermissions, useWaveCountdown
├── pages/            # Route-level page components
├── services/         # authService
├── store/            # Zustand store + slices
├── types/            # TypeScript models and enums
└── utils/            # formatters, metrics, patientSearch, dates
```

## License

MIT
# vibe-code
