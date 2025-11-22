# 🚀 Complete Deployment Checklist

## BACKEND DEPLOYMENT (Railway.app)

### ✅ Prerequisites
- [x] Backend code pushed to https://github.com/Qasimcnc/Pawnflow-backend
- [x] All migrations created (001, 004, 005, 006)
- [x] Environment variables configured in code
- [ ] Railway account created

### Step 1: Create Railway Account
- [ ] Go to https://railway.app
- [ ] Click "Start New Project"
- [ ] Sign up with GitHub → Authorize
- [ ] Select Qasimcnc account

### Step 2: Deploy Backend to Railway
- [ ] Click "New Project" → "Deploy from GitHub"
- [ ] Select `Qasimcnc/Pawnflow-backend`
- [ ] Click "Import"
- [ ] Wait 3-5 minutes for deployment
- [ ] Check "Logs" tab - should see "Server is running on port 5000"

### Step 3: Add PostgreSQL Database
- [ ] In Railway project, click "New" → "Database" → "PostgreSQL"
- [ ] Wait 1-2 minutes for provisioning
- [ ] Confirm PostgreSQL service is running

### Step 4: Set Environment Variables
In Railway → Node.js service → Variables tab:
- [ ] `PORT` = `5000`
- [ ] `NODE_ENV` = `production`
- [ ] `JWT_SECRET` = (random 32+ char string)
- [ ] `DATABASE_URL` (auto-created by Railway - verify it exists)

### Step 5: Run Database Migrations
- [ ] Get PostgreSQL URI from Railway → PostgreSQL → "Connect"
- [ ] Copy the "Postgres URI"
- [ ] Run migrations with psql command:
  ```powershell
  $DB_URL = "postgresql://..."
  & psql -d "$DB_URL" -f migrations\001_initial_schema.sql
  & psql -d "$DB_URL" -f migrations\004_add_customer_fields.sql
  & psql -d "$DB_URL" -f migrations\005_add_extended_customer_fields.sql
  & psql -d "$DB_URL" -f migrations\006_complete_schema.sql
  ```
- [ ] Verify no errors

### Step 6: Get Backend URL
- [ ] Railway → Node.js service → "Domains" section
- [ ] Copy your public URL
- [ ] **SAVE THIS URL** (needed for frontend)

**Your Backend URL:** `_________________________`

---

## FRONTEND DEPLOYMENT (Vercel)

### ✅ Prerequisites
- [ ] Frontend pushed to https://github.com/Qasimcnc/Pawnflow-Frontend
- [ ] Backend URL from Railway ready
- [ ] Vercel account created

### Step 1: Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Click "Sign Up"
- [ ] Choose "GitHub" → Authorize
- [ ] Select Qasimcnc account

### Step 2: Deploy Frontend
- [ ] Click "New Project" → "Import Project"
- [ ] Select `Qasimcnc/Pawnflow-Frontend`
- [ ] Click "Import"
- [ ] Vercel auto-detects React

### Step 3: Set Environment Variables
In Vercel → Project Settings → Environment Variables:
- [ ] Add new variable:
  - **Name:** `REACT_APP_API_URL`
  - **Value:** (Your Railway backend URL)
  - Example: `https://pawnflow-backend-production-xxxx.railway.app`

### Step 4: Trigger Deployment
- [ ] Environment variables are set
- [ ] Vercel redeploys automatically (3-5 min)
- [ ] Check "Deployments" tab for status
- [ ] When blue checkmark appears - deployment complete!

### Step 5: Get Frontend URL
- [ ] Vercel → Deployments → "Production" deployment
- [ ] Copy the "Domains" URL
- [ ] Click it to open your live app

**Your Frontend URL:** `_________________________`

---

## FINAL TESTING

### ✅ Backend API Tests
```powershell
# Replace with your actual Railway URL
$backend = "https://your-railway-url"

# Test 1: Search endpoint (should return JSON)
Invoke-WebRequest -Uri "$backend/search-loan" -Method Get

# Test 2: Create loan
$json = @{
    firstName = "TestUser"
    lastName = "TestLast"
    email = "test@example.com"
    idType = "Passport"
    idNumber = "AB123456"
    loanAmount = 1000
    interestRate = 5.5
} | ConvertTo-Json

Invoke-WebRequest -Uri "$backend/create-loan" -Method Post -ContentType "application/json" -Body $json
```

### ✅ Frontend Tests
1. [ ] Open frontend URL in browser
2. [ ] Page loads without errors
3. [ ] Create a new loan
4. [ ] Search for loans
5. [ ] Download PDF invoice
6. [ ] All API calls successful (check browser console)

---

## DEPLOYMENT COMPLETE ✨

Once all steps are done, your system is live!

**Share these URLs with users:**

| Service | URL |
|---------|-----|
| **Frontend App** | `_________________________` |
| **Backend API** | `_________________________` |

**What's running in production:**
- ✅ React frontend on Vercel (auto-scaling, global CDN)
- ✅ Node.js backend on Railway (auto-scaling, always on)
- ✅ PostgreSQL database on Railway (managed, automatic backups)
- ✅ Auto-redeploys on GitHub push

**Monitoring & Support:**
- Railway logs: Check service → "Logs" for errors
- Vercel logs: Check deployments → select deployment → "View logs"
- Database: Railway PostgreSQL is managed and automatically backed up

🎉 **Congratulations! Your pawn shop management system is deployed to production!**

