# GateZero Render Deployment Guide
> Zero Penalties. Zero Friction.

This guide explains how to deploy GateZero on Render.

---

## 🌐 Web Application (Frontend + Server)

### Step 1: Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository: `joshuahanielgts/gatezero-ai`

### Step 2: Configure the Web Service

| Setting | Value |
|---------|-------|
| **Name** | `gatezero-web` |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | *(leave empty)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free (or Starter for production) |

### Step 3: Add Environment Variables

Click **Environment** and add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Your Supabase anon/public key |
| `VITE_GEMINI_API_KEY` | `AIza...` | *(Optional)* Google Gemini API key for AI features |
| `NODE_ENV` | `production` | Environment mode |

### Step 4: Deploy

1. Click **Create Web Service**
2. Wait for the build to complete (~2-3 minutes)
3. Your app will be live at `https://gatezero-web.onrender.com`

---

## 📱 Mobile App (Expo)

> **Note:** React Native/Expo apps cannot be deployed on Render as web services. They must be built as native mobile apps.

### Option A: Expo EAS Build (Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Navigate to mobile directory:
   ```bash
   cd mobile
   ```

3. Login to Expo:
   ```bash
   eas login
   ```

4. Configure the project:
   ```bash
   eas build:configure
   ```

5. Build for platforms:
   ```bash
   # Android APK
   eas build --platform android --profile preview
   
   # iOS (requires Apple Developer account)
   eas build --platform ios --profile preview
   ```

6. Submit to stores:
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

### Option B: Expo Go (Development)

For testing purposes, use Expo Go app:

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go app on your phone.

### Mobile Environment Variables

Create `mobile/.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=https://gatezero-web.onrender.com
```

---

## 🔧 Supabase Setup

Before deploying, ensure your Supabase project is configured:

### 1. Get Your Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create new)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 2. Run Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Run the contents of `supabase/schema.sql`
3. Run the contents of `supabase/schema-v2.sql` (premium features)
4. *(Optional)* Run `supabase/seed.sql` for demo data

### 3. Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. *(Optional)* Configure OAuth providers (Google, GitHub)

### 4. Configure RLS Policies

The schema files include Row Level Security policies. Verify they're enabled:
- Go to **Database** → **Tables**
- Check that RLS is enabled on all tables

---

## 🔐 Google Gemini API (Optional)

For AI-powered features:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to Render environment variables as `VITE_GEMINI_API_KEY`

---

## 📋 Deployment Checklist

### Web Service
- [ ] GitHub repository connected
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `node server.js`
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_ANON_KEY` set
- [ ] `NODE_ENV=production` set
- [ ] *(Optional)* `VITE_GEMINI_API_KEY` set

### Supabase
- [ ] Project created
- [ ] Schema executed
- [ ] RLS policies enabled
- [ ] Authentication configured

### Mobile (EAS Build)
- [ ] Expo account created
- [ ] EAS CLI installed
- [ ] `eas.json` configured
- [ ] Environment variables set

---

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version compatibility (18+)
- Ensure all dependencies are in `package.json`
- Review build logs in Render dashboard

### App Not Loading
- Verify environment variables are set correctly
- Check browser console for errors
- Ensure Supabase URL doesn't have trailing slash

### Supabase Connection Issues
- Verify anon key is the **public** key (not service role)
- Check RLS policies allow the operations
- Ensure your IP isn't blocked in Supabase

### Health Check Failing
- App should respond on `/health` endpoint
- Check server logs in Render dashboard

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## 📞 Support

For issues specific to GateZero, check:
- GitHub Issues: [gatezero-ai/issues](https://github.com/joshuahanielgts/gatezero-ai/issues)
