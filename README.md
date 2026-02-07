# GateZero - Zero Penalties. Zero Friction.

A real-time vehicle compliance verification platform for logistics operations. GateZero automates RC, insurance, permit, and E-Way Bill validation at entry gates, reducing manual checks and ensuring regulatory compliance.

## Features

### Core Features
- **🚪 The Gate** - Real-time vehicle scanning with compliance verification
- **📊 Command Center** - Dashboard with KPIs, risk gauges, and trend analytics
- **🚛 Fleet Guard** - Vehicle and driver management with blacklist controls
- **📡 Live Operations** - Real-time trip tracking and monitoring
- **📋 Audit Logs** - Complete scan history with export capabilities
- **🔐 Authentication** - Role-based access (Admin, Dispatcher, Guard)

### Premium Features
- **🚨 Alert Center** - Real-time compliance alerts with severity levels and auto-resolve
- **📈 Predictive Analytics** - ML-powered compliance predictions and risk scoring
- **🧮 Penalty Calculator** - Automated fine calculation based on Indian transport regulations
- **⚡ AI Command Bar** - Ctrl+K powered natural language assistant
- **⚙️ Settings** - Configurable preferences and system settings

### Mobile App (Expo React Native)
- **📱 Dashboard** - Quick stats and compliance overview
- **🔍 Vehicle Verification** - Scan and verify vehicles on-the-go
- **🚛 Fleet Management** - View and manage fleet status
- **🔔 Alerts** - Push notifications for compliance issues
- **👤 Profile** - User settings and preferences

## Tech Stack

### Web Application
- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Lucide Icons
- **State**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Charts**: Recharts
- **AI**: Google Gemini API

### Mobile Application
- **Framework**: Expo (React Native)
- **Navigation**: Expo Router
- **UI**: Custom components with Linear Gradient
- **Camera**: Expo Camera for scanning

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun
- Supabase account

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd wayguard-scan-shield

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Add your credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the database schema in Supabase SQL Editor:
   ```bash
   # Copy contents of supabase/schema.sql and execute in SQL Editor
   ```

4. Seed initial data (optional):
   ```bash
   # Copy contents of supabase/seed.sql and execute in SQL Editor
   ```

### Development

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

### Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

## Project Structure

```
src/
├── components/
│   ├── ai/            # AI Command Bar
│   ├── alerts/        # Alert Center components
│   ├── analytics/     # Predictive analytics
│   ├── dashboard/     # KPI cards, charts, live feed
│   ├── gate/          # Scan form, animation, verdict display
│   ├── layout/        # App layout, sidebar
│   ├── tools/         # Penalty calculator
│   └── ui/            # shadcn/ui components
├── contexts/          # Auth & CommandBar contexts
├── hooks/             # Data fetching hooks (useVehicles, useDrivers, etc.)
├── lib/               # Utilities, Supabase client
├── pages/             # Route pages
├── services/          # Verification engine, Gemini AI
└── types/             # TypeScript definitions

mobile/
├── app/               # Expo Router pages
│   ├── (tabs)/        # Tab navigation screens
│   └── scan.tsx       # Camera scanning screen
├── app.json           # Expo configuration
└── package.json       # Mobile dependencies

supabase/
├── schema.sql         # Database schema with RLS policies
├── schema-v2.sql      # Schema migrations
└── seed.sql           # Sample data for testing
```

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles with roles |
| `vehicles` | Vehicle registry with compliance data |
| `drivers` | Driver information and license details |
| `gate_logs` | Scan audit trail |
| `live_trips` | Active trip tracking |
| `dashboard_metrics` | Aggregated KPIs |

## Verification Engine

The verification engine performs multi-point compliance checks:

- ✅ RC (Registration Certificate) validity
- ✅ Insurance expiry verification
- ✅ Permit status check
- ✅ GST compliance
- ✅ Blacklist screening
- ✅ E-Way Bill validation

Verdicts: `APPROVED` | `WARNING` | `BLOCKED`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_GEMINI_API_KEY` | Google Gemini API key (optional, for AI insights) |

## AI-Powered Features

GateZero uses Google Gemini for intelligent insights:

- **Bill Insights** - AI analysis of E-Way Bill verification results
- **Risk Assessment** - Automated risk level estimation (LOW/MEDIUM/HIGH)
- **Recommendations** - Actionable compliance suggestions
- **Pattern Analysis** - Historical compliance pattern detection
- **AI Command Bar** - Natural language queries with Ctrl+K (e.g., "show blocked vehicles", "calculate penalty for expired RC")
- **Predictive Analytics** - ML-powered compliance trend forecasting

To enable AI features, add your Gemini API key to `.env`:
```env
VITE_GEMINI_API_KEY=your-gemini-api-key
```

Get an API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `⌘+K` | Open AI Command Bar |
| `Escape` | Close dialogs/modals |

## License

MIT
