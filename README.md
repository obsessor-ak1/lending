# BorrowBee - Lending Platform Monorepo

A full-stack peer-to-peer lending platform with:

- A Next.js web app for borrowers and lenders
- A FastAPI ML inference service for default-risk prediction
- Prisma + PostgreSQL persistence
- Supporting data and notebook artifacts

## Repository Layout

```text
lending/
  artifacts/                # Generated artifacts and outputs
  data/                     # Dataset files used for model work
  default_pred_api/         # FastAPI default prediction service
  lending/                  # Next.js application (main product)
  notebooks/                # Analysis/baseline notebooks
```

## What This Project Does

### Product capabilities

- User signup/login with session-based auth
- Email verification flow (OTP style code)
- Borrower profile management
- Lender profile settings (limits and interest boundaries)
- Loan application creation and review
- Request approval/rejection workflow
- Pending-request risk assessment using external ML API

### ML capabilities

- Authenticated default prediction endpoint
- Hugging Face-hosted model download at startup
- Structured prediction payload using credit features

## Tech Stack

### Web app (lending/)

- Next.js 16 (App Router)
- React 19
- Prisma + PostgreSQL adapter
- iron-session for cookie sessions
- Nodemailer (SMTP) for verification emails
- Tailwind CSS 4

### Prediction API (default_pred_api/)

- FastAPI
- Pydantic + pydantic-settings
- pandas + scikit-learn + joblib
- huggingface_hub for model artifact download
- uvicorn runtime

## Data Model Overview

Key entities in Prisma schema:

- User
- Profile
- VerificationCode
- Application

Application status lifecycle:

- PENDING
- APPROVED
- REJECTED

## Local Development

## 1) Prerequisites

- Node.js 20+
- npm 10+
- Python 3.10+
- PostgreSQL database

## 2) Clone and install

From repository root:

```bash
cd lending
npm install
```

From repository root for ML API:

```bash
cd default_pred_api
pip install -r requirements.txt
```

## 3) Configure environment variables

### Next.js app env file

Create lending/.env with values for:

- DATABASE_URL
- SESSION_COOKIE_PASSWORD
- SMTP_USER
- SMTP_PASSWORD
- DEFAULT_PREDICTION_API_URL
- DEFAULT_PREDICTION_API_KEY
- DEFAULT_PREDICTION_API_HEADER (optional, defaults to X-API-Key)
- NODE_ENV (development locally)

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
SESSION_COOKIE_PASSWORD="replace-with-32+-char-secret"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
DEFAULT_PREDICTION_API_URL="http://127.0.0.1:8000"
DEFAULT_PREDICTION_API_KEY="your-api-key"
DEFAULT_PREDICTION_API_HEADER="X-API-Key"
NODE_ENV="development"
```

### FastAPI service env file

Create default_pred_api/.env with values for:

- API_HEADER
- API_KEY
- HF_TOKEN
- HF_REPO_NAME
- HF_MODEL_FILENAME

Example:

```env
API_HEADER="X-API-Key"
API_KEY="your-api-key"
HF_TOKEN="hf_xxx"
HF_REPO_NAME="your-org-or-user/your-model-repo"
HF_MODEL_FILENAME="logistic_regression.pkl"
```

## 4) Database migrations

From lending/:

```bash
npx prisma migrate deploy
npx prisma generate
```

For development-only migration creation:

```bash
npx prisma migrate dev
```

## 5) Run services

Start ML API first:

```bash
cd default_pred_api
uvicorn api.api:app --host 0.0.0.0 --port 8000
```

Start Next.js app:

```bash
cd lending
npm run dev
```

Open:

- Web app: http://localhost:3000
- ML API docs: http://localhost:8000/docs

## API Surface

### Web app routes

- POST /api/auth              Signup
- POST /api/auth/login        Login
- POST /api/auth/logout       Logout
- GET/POST/PUT /api/profile   Profile operations
- GET /api/applications       Borrower applications list
- POST/PUT /api/application   Create application / decision update

### ML API route

- POST /default_pred/default
  - Requires API key header (default header name: X-API-Key)
  - Body: credit profile payload
  - Returns: default_probability array from model predict_proba

## Prediction Integration

In the request detail flow, risk prediction is computed only for pending applications.

High-level behavior:

- Build prediction payload from borrower profile + application fields
- Call ML endpoint server-side
- Parse probability and map to loan quality band
- Render probability + quality only while status is PENDING

## Deployment

## Deploy Next.js app on Vercel

Project settings:

- Root Directory: lending
- Install Command: npm ci
- Build Command: npx prisma generate && npm run build
- Output Directory: leave default (do not override)

Required Vercel environment variables:

- DATABASE_URL
- SESSION_COOKIE_PASSWORD
- SMTP_USER
- SMTP_PASSWORD
- DEFAULT_PREDICTION_API_URL
- DEFAULT_PREDICTION_API_KEY
- DEFAULT_PREDICTION_API_HEADER (optional)

Note: If Vercel fails with npm ci lockfile sync errors, run npm install locally in lending/, commit package-lock.json, and redeploy.

## Deploy default_pred_api on Render

Service settings:

- Root Directory: default_pred_api
- Build Command: pip install --upgrade pip && pip install -r requirements.txt
- Start Command: uvicorn api.api:app --host 0.0.0.0 --port $PORT

Required Render environment variables:

- API_HEADER
- API_KEY
- HF_TOKEN
- HF_REPO_NAME
- HF_MODEL_FILENAME

## Security Notes

- Never commit real secrets in .env files.
- Rotate any leaked API keys, SMTP credentials, database passwords, or HF tokens.
- Use platform secret managers (Vercel/Render dashboard env vars).

## Troubleshooting

### npm ci fails on Vercel with package-lock mismatch

Cause:

- package-lock.json out of sync with package.json

Fix:

```bash
cd lending
npm install
git add package-lock.json
git commit -m "sync lockfile"
git push
```

### Prisma connection issues

- Verify DATABASE_URL format and SSL options
- Ensure database is reachable from deployment environment

### ML API startup fails

- Confirm HF_TOKEN has access to HF_REPO_NAME
- Confirm HF_MODEL_FILENAME exists in the model repo

## Development Notes

- Generated Prisma client is committed under lending/generated/prisma.
- Notebook and data folders are included for model exploration and baseline analysis.
- The web app and ML service are independently deployable but connected via environment-based service URL.
