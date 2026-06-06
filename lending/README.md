# Lending Web App

This directory contains the Next.js application for the lending platform.

For full project documentation (web app + ML API + deployment), see:

- ../README.md

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

Create .env in this directory with:

- DATABASE_URL
- SESSION_COOKIE_PASSWORD
- SMTP_USER
- SMTP_PASSWORD
- DEFAULT_PREDICTION_API_URL
- DEFAULT_PREDICTION_API_KEY
- DEFAULT_PREDICTION_API_HEADER (optional)

## Vercel Deployment Notes

- Root Directory: lending
- Install Command: npm ci
- Build Command: npx prisma generate && npm run build
- Output Directory: keep default
