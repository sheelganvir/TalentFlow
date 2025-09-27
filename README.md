# TalentFlow – Modern ATS Dashboard

A modern, opinionated Applicant Tracking System (ATS) UI built with Next.js App Router, Tailwind CSS v4, shadcn/ui, and Recharts. It ships with realistic mock data via MSW so you can preview and iterate without a backend.

- Live preview: use the v0 preview panel
- One-click deploy: Publish to Vercel from the v0 UI

## Features

- Dashboard with KPIs and charts (Area, Bar, Pie) using Recharts
- Jobs, Candidates, and Assessments pages with list/detail routes
- Accessible, themeable UI via shadcn/ui + Tailwind CSS v4 tokens
- Mock Service Worker (MSW) for realistic API responses
- Type-safe client-side API layer (lib/api/*)
- Dark mode toggle (Geist fonts preconfigured)

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- UI: Tailwind CSS v4, shadcn/ui, Lucide Icons
- Charts: Recharts
- Data mocking: MSW (Mock Service Worker)
- Fonts: Geist Sans & Geist Mono
- Analytics: @vercel/analytics

## Project Structure

```text
app/
  layout.tsx                # Root layout, fonts, Analytics, MSWProvider, FloatingSidebar
  globals.css               # Tailwind v4 + theme tokens
  page.tsx                  # Dashboard
  jobs/
    page.tsx
    [jobId]/
      page.tsx
  candidates/
    page.tsx
    [id]/
      page.tsx
  assessments/
    page.tsx
    builder/[id]/page.tsx
components/
  floating-sidebar.tsx
  msw-provider.tsx
  ui/*                      # shadcn/ui primitives
lib/
  api/                      # Typed API clients used by pages
    jobs.ts
    candidates.ts
    assessments.ts
  msw/                      # Mock Service Worker setup + handlers
    setup.ts
    handlers/*
  utils.ts
public/
  professional-*.png|jpg    # Avatars used across the UI
