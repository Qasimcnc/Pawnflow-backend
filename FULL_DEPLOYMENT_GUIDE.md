# Complete End-to-End Deployment Guide

## Deployment Summary
This document outlines the COMPLETE deployment of PawnFlow system to production.

**Components:**
- Backend: Node.js + Express + PostgreSQL → Railway.app
- Frontend: React App → Vercel
- Database: PostgreSQL → Railway.app
- Domain: Custom domain pointing to Vercel

---

## Part 1: Backend Deployment (Railway)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Start New Project"
3. Sign up with GitHub (Qasimcnc account)
4. Authorize Railway to access your repositories

### Step 2: Deploy Backend
1. Click "New Project" → "Deploy from GitHub"
2. Select `Qasimcnc/Pawnflow-backend` repository
3. Railway auto-detects Node.js and creates a service
4. Deployment starts automatically (3-5 minutes)

### Step 3: Add PostgreSQL
1. In Railway project, click "New" button
2. Select "Database" → "PostgreSQL"
3. Wait for provisioning (1-2 minutes)
4. PostgreSQL is now running and connected

### Step 4: Set Environment Variables
In Railway dashboard for Node.js service → Variables tab:

```
DATABASE_URL=postgresql://user:pass@host:port/railway  (auto-created by Railway)
PORT=5000
NODE_ENV=production
JWT_SECRET=aB3$xK9@mL2#pQ8^vR5&nT4%jS7!hG1*fD6wE0cY(iO)uA
```

**⚠️ Change JWT_SECRET to something random (32+ characters)**

### Step 5: Run Database Migrations
Get PostgreSQL URI from Railway → Connect tab

Then run in PowerShell:
```powershell
$DB_URL = "postgresql://user:pass@host:5432/railway"

& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -d "$DB_URL" -f "C:\Users\HP\pawn-flow\migrations\001_initial_schema.sql"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -d "$DB_URL" -f "C:\Users\HP\pawn-flow\migrations\004_add_customer_fields.sql"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -d "$DB_URL" -f "C:\Users\HP\pawn-flow\migrations\005_add_extended_customer_fields.sql"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -d "$DB_URL" -f "C:\Users\HP\pawn-flow\migrations\006_complete_schema.sql"
```

### Step 6: Get Backend URL
In Railway → Node.js service → Domains section
Copy your public URL (example: `https://pawnflow-backend-production-xxxx.railway.app`)

**Keep this URL** - you'll need it for frontend

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend Code
The frontend has hardcoded API URLs that need to be replaced.

### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up" → Choose "GitHub"
3. Authorize Vercel to access Qasimcnc account

### Step 3: Deploy Frontend
1. Click "New Project" or "Import Project"
2. Select `Qasimcnc/Pawnflow-Frontend`
3. Click "Import"
4. Vercel auto-detects React and deploys

### Step 4: Set Environment Variables
In Vercel project settings → Environment Variables:

```
REACT_APP_API_URL=<your-railway-backend-url>
```

Example: `REACT_APP_API_URL=https://pawnflow-backend-production-xxxx.railway.app`

### Step 5: Wait for Deployment
- Vercel redeploys automatically with new environment variables
- Initial deploy: 3-5 minutes

### Step 6: Get Frontend URL
In Vercel → Deployments → Production
Copy your public URL (example: `https://pawnflow-frontend.vercel.app`)

---

## Part 3: Testing Deployed System

### Test Backend
```powershell
# Test search endpoint
Invoke-WebRequest -Uri "https://your-railway-backend-url/search-loan" -Method Get

# Test create loan
$json = @{
    firstName = "Test"
    lastName = "User"
    email = "test@example.com"
    loanAmount = 1000
    interestRate = 5
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://your-railway-backend-url/create-loan" -Method Post -ContentType "application/json" -Body $json
```

### Test Frontend
1. Open your Vercel URL in browser: `https://pawnflow-frontend.vercel.app`
2. Create a new loan
3. Search for loans
4. Download PDF invoice
5. Verify all features work

---

## URLs After Deployment

| Component | URL |
|-----------|-----|
| **Backend API** | `https://pawnflow-backend-production-xxxx.railway.app` |
| **Frontend App** | `https://pawnflow-frontend.vercel.app` |
| **PostgreSQL** | Managed by Railway (internal connection) |

---

## Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` environment variable in Vercel
- Verify backend URL is correct (no trailing slash)
- Check browser console for CORS errors

### Database migrations failed
- Verify PostgreSQL URI is correct
- Check all migration files exist locally
- Run migrations one by one with verbose output

### Backend crashes on Railway
- Check Railway logs: Click service → "Logs" tab
- Verify all environment variables are set
- Check DATABASE_URL is valid

---

## Deployment Complete! 🎉

Your full-stack pawn shop management system is now live on production servers!

- **Frontend**: Deployed to Vercel (global CDN)
- **Backend**: Deployed to Railway (auto-scaling)
- **Database**: PostgreSQL on Railway (managed)
- **Git Integration**: Auto-redeploys on push

### Next Steps:
1. Share URLs with users
2. Set up custom domain (optional)
3. Monitor application performance
4. Set up automated backups

