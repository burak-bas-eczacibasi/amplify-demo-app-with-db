# Installation & Deployment Guide

## Project Tracker — AWS Amplify Gen 2 Demo Application

This guide walks you through deploying the Project Tracker application using **GitHub + AWS Amplify Hosting**. No local Node.js installation is required — Amplify handles the build and deployment.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Push Code to GitHub](#2-push-code-to-github)
3. [AWS Account Setup](#3-aws-account-setup)
4. [Connect GitHub to Amplify](#4-connect-github-to-amplify)
5. [Verify Deployment](#5-verify-deployment)
6. [Using the Application](#6-using-the-application)
7. [Making Changes](#7-making-changes)
8. [Custom Domain (Optional)](#8-custom-domain-optional)
9. [Cleanup & Teardown](#9-cleanup--teardown)
10. [Troubleshooting](#10-troubleshooting)
11. [Cost Estimate](#11-cost-estimate)

---

## 1. Prerequisites

You only need:

| Tool | Purpose | Download |
|------|---------|----------|
| **Git** | Push code to GitHub | https://git-scm.com/download/win |
| **GitHub Account** | Host the repository | https://github.com |
| **AWS Account** | Run the application | https://aws.amazon.com |

**You do NOT need Node.js, npm, or AWS CLI on your local machine.** Amplify's build environment handles everything.

---

## 2. Push Code to GitHub

### 2.1 GitHub Repository

Your repository is already created at:

**https://github.com/burak-bas-eczacibasi/amplify-demo-app-with-db**

### 2.2 Push Your Code

Open a terminal in your project folder and run:

```bash
cd "c:\Users\burak.bas\OneDrive - Eczacibasi Topluluğu\Belgeler\Kiro\eczacibasi-ict\amplify-demo-app-with-db"

git add .
git commit -m "Initial commit - Project Tracker with Amplify Gen 2"
git push -u origin main
```

### 2.3 Verify on GitHub

Go to https://github.com/burak-bas-eczacibasi/amplify-demo-app-with-db and confirm all files are visible, including:
- `amplify/` folder (auth, data, backend.ts)
- `src/` folder (components, lib)
- `package.json`
- `vite.config.ts`

---

## 3. AWS Account Setup

### 3.1 Sign In to AWS Console

Go to https://console.aws.amazon.com and sign in.

### 3.2 Select a Region

In the top-right corner of the AWS Console, select your preferred region:
- `EU (Ireland)` — eu-west-1
- `EU (Frankfurt)` — eu-central-1
- `US East (N. Virginia)` — us-east-1

**Important:** Use the same region throughout this guide.

### 3.3 IAM Permissions

Your AWS user needs permissions for Amplify to create resources. If you're using the root account or an admin user, you already have sufficient permissions.

If using a restricted IAM user, ensure it has access to:
- AWS Amplify
- Amazon Cognito
- AWS AppSync
- Amazon DynamoDB
- AWS CloudFormation
- AWS Lambda
- Amazon S3
- IAM (role creation)

The simplest option: attach the **`AdministratorAccess`** managed policy to your user for development.

---

## 4. Connect GitHub to Amplify

### 4.1 Open AWS Amplify Console

1. Go to **AWS Console** → search for **"Amplify"** → click **AWS Amplify**
2. Click **"Create new app"**

### 4.2 Connect Your Repository

1. Select **"GitHub"** as the source provider
2. Click **"Next"**
3. A popup will ask you to authorize AWS Amplify to access your GitHub account
4. Click **"Authorize aws-amplify-console"**
5. Select the repository: `amplify-demo-app-with-db`
6. Select the branch: `main`
7. Click **"Next"**

### 4.3 Configure Build Settings

Amplify auto-detects that this is an Amplify Gen 2 project. It will show build settings similar to:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Important:** Amplify Gen 2 automatically detects the `amplify/` folder and deploys the backend (Cognito, AppSync, DynamoDB) alongside the frontend. You don't need to configure this separately.

If Amplify doesn't auto-detect the build settings, you may need to create an `amplify.yml` file at the project root (see Section 10 Troubleshooting).

### 4.4 Review and Deploy

1. Review the settings
2. Click **"Save and deploy"**

### 4.5 Wait for Deployment

The first deployment takes **5-10 minutes**. Amplify will:

1. **Provision** — Pull code from GitHub
2. **Build** — Run `npm ci` and `npm run build`
3. **Deploy Backend** — Create Cognito User Pool, AppSync API, DynamoDB table
4. **Deploy Frontend** — Upload built files to CloudFront CDN
5. **Verify** — Run health checks

You can watch the progress in the Amplify Console. Each phase shows logs you can expand.

---

## 5. Verify Deployment

### 5.1 Get Your App URL

Once deployment succeeds, Amplify provides a URL like:

```
https://main.d1a2b3c4d5.amplifyapp.com
```

Click the URL or find it in the Amplify Console under your app → branch `main`.

### 5.2 Check AWS Resources Created

Go to these AWS services to verify resources were created:

| Service | What to look for |
|---------|-----------------|
| **Amazon Cognito** → User Pools | A new user pool for your app |
| **AWS AppSync** → APIs | A new GraphQL API |
| **Amazon DynamoDB** → Tables | A `Project` table |
| **CloudFormation** → Stacks | Amplify-created stacks |

---

## 6. Using the Application

### 6.1 Sign Up

1. Open your app URL in a browser
2. You'll see the sign-in/sign-up screen
3. Click **"Create Account"**
4. Enter:
   - **Email:** your real email (verification code will be sent)
   - **Password:** minimum 8 characters
5. Click **"Create Account"**

### 6.2 Verify Email

1. Check your email inbox for a message from `no-reply@verificationemail.com`
2. Copy the **verification code** (6 digits)
3. Enter it in the app
4. Click **"Confirm"**

### 6.3 Sign In

After verification, you're automatically signed in and see the Dashboard.

### 6.4 Create a Project

1. Click **"Create Project"**
2. Enter a title (required, 1-100 characters)
3. Enter a description (optional, up to 500 characters)
4. Select a status: "Not Started", "In Progress", or "Completed"
5. Click **"Create Project"**

### 6.5 Edit a Project

1. Click **"Edit"** on any project card
2. Modify the title, description, or status
3. Click **"Save Changes"**

### 6.6 Delete a Project

1. Click **"Delete"** on any project card
2. Confirm deletion in the dialog
3. The project is permanently removed

### 6.7 Sign Out

Click **"Sign Out"** in the header.

---

## 7. Making Changes

### 7.1 Edit Code Locally

Make changes to files in your project folder using any editor (VS Code, Kiro, etc.).

### 7.2 Push to GitHub

```bash
git add .
git commit -m "Description of your changes"
git push
```

### 7.3 Automatic Deployment

Amplify automatically detects the push and starts a new deployment. Within 3-5 minutes, your changes are live.

You can monitor the build in the **Amplify Console** → your app → **Deployments**.

### 7.4 Branch Deployments (Optional)

You can connect multiple branches for different environments:

1. In Amplify Console, click **"Branch deployments"** → **"Connect branch"**
2. Select a branch (e.g., `develop`)
3. Each branch gets its own URL and isolated backend

---

## 8. Custom Domain (Optional)

### 8.1 Add a Custom Domain

1. In Amplify Console → your app → **"Hosting"** → **"Custom domains"**
2. Click **"Add domain"**
3. Enter your domain (e.g., `projects.yourdomain.com`)
4. Amplify provides DNS records to configure

### 8.2 Configure DNS

Add the provided CNAME or ALIAS records to your domain's DNS settings (in Route 53, Cloudflare, or your DNS provider).

### 8.3 SSL Certificate

Amplify automatically provisions and manages an SSL certificate for your custom domain. HTTPS is enabled by default.

---

## 9. Cleanup & Teardown

### 9.1 Delete the Amplify App

This removes ALL resources (frontend, backend, Cognito, DynamoDB data):

1. Go to **AWS Console** → **AWS Amplify**
2. Select your app
3. Click **"App settings"** → **"General settings"**
4. Scroll down and click **"Delete app"**
5. Type the app name to confirm
6. Click **"Delete"**

**Warning:** This permanently deletes all user accounts and project data.

### 9.2 Verify Cleanup

After deletion, check that these are removed:
- **CloudFormation** → no remaining Amplify stacks
- **Cognito** → user pool deleted
- **DynamoDB** → table deleted
- **AppSync** → API deleted

### 9.3 Delete GitHub Repository (Optional)

If you no longer need the code:
1. Go to your repository on GitHub
2. **Settings** → scroll to bottom → **"Delete this repository"**

---

## 10. Troubleshooting

### Build fails: "Cannot find module"

Ensure `package.json` lists all dependencies. Check the build logs in Amplify Console for the specific missing module.

### Build fails: "amplify_outputs.json"

The `amplify_outputs.json` file in your repo should contain just `{}`. Amplify generates the real values during deployment. Make sure the file exists:

```json
{}
```

### Amplify doesn't detect Gen 2 backend

Create an `amplify.yml` file at the project root:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### "Access Denied" during deployment

Your AWS account needs permissions to create Cognito, AppSync, DynamoDB, and Lambda resources. Ensure your account has `AdministratorAccess` or the specific service permissions listed in Section 3.3.

### Email verification not received

- Check your spam/junk folder
- The sender is `no-reply@verificationemail.com`
- Wait 1-2 minutes — sometimes there's a delay
- Try signing up with a different email

### App shows blank page after deployment

1. Check the Amplify Console build logs for errors
2. Ensure `index.html` exists in the `dist/` output
3. Verify `vite.config.ts` has the correct `base` path (should be `/` for root deployment)

### CORS errors in browser console

This usually means the `amplify_outputs.json` wasn't properly generated during deployment. Check the backend deployment logs in Amplify Console.

---

## 11. Cost Estimate

### AWS Free Tier (First 12 months)

| Service | Free Tier | This App's Usage |
|---------|-----------|------------------|
| **Amplify Hosting** | 1000 build minutes/month, 15 GB served/month | ~5 builds, < 1 GB |
| **Amazon Cognito** | 50,000 monthly active users | < 10 users (demo) |
| **AWS AppSync** | 250,000 queries/month | < 1,000 queries |
| **Amazon DynamoDB** | 25 GB storage, 25 RCU/WCU | < 1 MB |
| **AWS Lambda** | 1M requests/month | < 100 requests |
| **CloudFront** | 1 TB transfer/month | < 1 GB |

**Estimated monthly cost for a demo:** $0 (within Free Tier)

**After Free Tier expires (light usage):** $1-5/month

### Cost Optimization Tips

- Delete the app when not actively using it
- Use a single branch deployment (avoid multiple environments)
- The app auto-scales to zero when not in use — no idle charges for Cognito, AppSync, or DynamoDB

---

## Quick Reference

| Action | How |
|--------|-----|
| Deploy | Push to `main` branch on GitHub |
| View app | Open URL from Amplify Console |
| View logs | Amplify Console → Deployments → click build |
| Add users | Users sign up themselves via the app |
| Delete app | Amplify Console → App settings → Delete app |
| Monitor | Amplify Console → Monitoring tab |

---

## Architecture Summary

```
GitHub Repository
       │
       ▼ (auto-trigger on push)
AWS Amplify Hosting
       │
       ├── Frontend (React + Vite)
       │     └── Hosted on CloudFront CDN
       │
       └── Backend (Amplify Gen 2)
             ├── Amazon Cognito (Authentication)
             ├── AWS AppSync (GraphQL API)
             └── Amazon DynamoDB (Database)
```

Every push to `main` triggers a full rebuild and deployment of both frontend and backend.
