
# WayGuard AI - Complete Frontend Implementation Plan
## The Compliance Firewall for Logistics | SNR Automations

---

## 🎨 Phase 1: Design System & Foundation

### Theme Configuration
- **Base:** Deep Zinc/Slate Dark Mode (no light mode toggle)
- **Backgrounds:** `bg-zinc-950` for page, `bg-zinc-900` for cards with `border-zinc-800`
- **Accent Colors:**
  - Emerald Green (#10B981) → Dispatch Approved
  - Rose Red (#E11D48) → Dispatch Blocked  
  - Amber (#F59E0B) → Expiring/Warning states

### Typography Setup
- **Inter** → All UI elements, headers, body text
- **JetBrains Mono** → Vehicle numbers, GSTINs, E-Way Bills, PIN codes

### Custom Components
- Status badges (Approved, Blocked, Warning, Expired)
- Alert cards with severity levels
- Shield icons (green/red) for verdict displays
- Monospace data display components

### Branding Footer
- "Powered by SNR Automations | Architected by Joshua Haniel J" in sidebar footer

---

## 📊 Phase 2: Mock Data (mockData.ts)

### Vehicles (15+ entries)
- Format: TN-01-AB-1234, KA-05-MJ-5678, MH-12-CD-9012
- Types: Truck, Trailer, Container, Tanker
- Insurance status with expiry dates

### Drivers
- Indian names with license numbers
- Phone numbers (10-digit Indian format)
- Vehicle assignments

### E-Way Bills
- 12-digit numeric strings (421000000000 format)
- Associated with vehicles and routes

### GSTINs
- Format: 33AAAAA0000A1Z5
- Active/Suspended statuses

### Live Operations Data
- 15+ active trips with realistic origins/destinations
- ETAs, departure times, statuses (On Route, Delayed, At Destination)

### Audit Logs
- Historical verification records with full forensic trails
- User IPs, timestamps, API responses

---

## 🧭 Phase 3: Sidebar Navigation

### Structure
- **Command Center** → LayoutDashboard icon
- **The Gate** → Shield icon
- **Live Operations** → Activity icon
- **Fleet Guard** → Truck icon
- **Audit Logs** → FileText icon

### Features
- Collapsible for mobile
- Active route highlighting with emerald accent
- Dark zinc styling with subtle borders
- Branding footer at bottom

---

## 🏠 Phase 4: Command Center (Dashboard)

### KPI Row (4 Cards)
1. **Risk Score** → RadialBar chart (Low/Med/High with colors)
2. **Active Blocks** → Counter with red accent
3. **Saved Penalties** → ₹ value with green accent
4. **Compliance Rate** → Percentage with progress indicator

### Split View Layout
**Left Panel - Live Feed:**
- Scrolling list of recent gate events
- Each row: Shield icon (green/red), Vehicle No (mono font), Timestamp
- Real-time feel with staggered entries

**Right Panel - Trend Analysis:**
- Stacked Bar Chart (Recharts)
- "Pass vs Blocked" over last 7 days
- Emerald for Pass, Rose for Blocked

---

## 🚧 Phase 5: The Gate (Core Feature - High Polish)

### State 1: The Input
- Large, centered form with dark zinc styling
- **Vehicle Number** input (monospace placeholder)
- **E-Way Bill Number** input (monospace placeholder)
- **"INITIATE SCAN"** button (prominent, emerald accent)

### State 2: The Audit (System Scan Animation)
- Full-screen scanning overlay
- Animated shield with pulse effect
- Checklist appearing sequentially (500ms delays):
  1. ⏳ "Connecting to Vahan API..."
  2. ✓ "RC Status Verified (Active)"
  3. ✓ "Insurance Validity Confirmed"
  4. ✓ "Tax Compliance Check Passed"
  5. ⏳ "Calculating Route Distance..."
  6. ✓ "GSTIN Status Validated"

### State 3A: Approved Verdict
- Massive pulsing green shield with glow effect
- "DISPATCH APPROVED" in bold
- Summary of all passed checks
- **"ISSUE GATE PASS"** button

**Gate Pass Modal:**
- Printable format preview
- QR Code placeholder (static image)
- Vehicle details, timestamp, E-Way Bill
- Large "CLEARED" stamp overlay
- Download/Print buttons

### State 3B: Blocked Verdict
- Massive red shield with warning pulse
- "DISPATCH BLOCKED" in bold
- **Violation Report Card** listing exact failures:
  - "Insurance Expired 2 Days Ago"
  - "PIN Code Gap Exceeds 10%"
  - "GSTIN Status: Suspended"

---

## 🚛 Phase 6: Live Operations (Traffic Control)

### High-Density Data Table
**Columns:**
- Status Dot (Green = On Route, Yellow = Delayed, Blue = At Destination)
- Vehicle No (mono font)
- Driver Name
- Origin → Destination
- ETA (countdown/time remaining)
- Action Menu (View Details, Contact Driver)

### Features
- Search bar for Vehicle No filtering
- Filter tabs: "All" | "On Route" | "Delayed" | "At Destination"
- 15+ rows with horizontal scroll on mobile
- Click row for expanded details

---

## 🛡️ Phase 7: Fleet Guard (Registry)

### Tab Structure: [Vehicles] | [Drivers]

**Vehicles Tab:**
| Column | Notes |
|--------|-------|
| Reg No | Mono font |
| Type | Truck/Trailer/Container |
| Insurance Expiry | Color-coded (green/amber/red) |
| Driver Assigned | Link to driver |
| Status | Active/Inactive badge |
| Blacklist | Toggle switch (turns row red when ON) |

**Drivers Tab:**
| Column | Notes |
|--------|-------|
| Driver Name | Full name |
| License No | Mono font |
| License Expiry | Color-coded |
| Phone | Indian format |
| Assigned Vehicle | Link to vehicle |
| Status | Badge |

### Interactions
- Blacklist toggle shows toast: "Vehicle Blacklisted Successfully"
- Search and filter capabilities
- Add Vehicle/Driver buttons (modal forms)

---

## 📋 Phase 8: Audit Logs (Forensics)

### Main View
- List of all past verification attempts
- Columns: Date/Time, Vehicle No, E-Way Bill, Outcome, Operator

### Drill-Down (Accordion Expansion)
Clicking a row expands to show **Forensic Trail**:
- User IP Address
- Exact timestamp with timezone
- API Responses:
  - Vahan API response
  - GST API response
  - Insurance verification result
- All checks performed with individual results
- Error details if blocked

### Filters
- Date range picker
- Status filter (All/Approved/Blocked)
- Search by Vehicle/E-Way Bill
- Export to CSV button

---

## 📱 Phase 9: Responsive Design

### Mobile Optimizations (Priority: The Gate page)
- Hamburger menu for sidebar
- Full-width inputs on Gate page
- Stacked KPI cards
- Touch-friendly scanning animation
- Simplified Gate Pass preview

### Desktop Experience
- Full sidebar always visible
- Dense data tables with all columns
- Split-panel layouts
- Hover states and tooltips

---

## ✨ Phase 10: Animations & Notifications

### Transitions
- Smooth state transitions on The Gate page
- Pulse animations for verdict shields
- Fade-in for checklist items during scan
- Skeleton loaders for data tables

### Toast Notifications (Sonner)
- "Gate Pass Generated Successfully"
- "Vehicle Blacklisted"
- "Scan Complete"
- "Export Downloaded"

---

## 📁 File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── AppLayout.tsx
│   ├── dashboard/
│   │   ├── KPICard.tsx
│   │   ├── LiveFeed.tsx
│   │   └── TrendChart.tsx
│   ├── gate/
│   │   ├── ScanForm.tsx
│   │   ├── ScanAnimation.tsx
│   │   ├── VerdictDisplay.tsx
│   │   └── GatePassModal.tsx
│   ├── fleet/
│   │   ├── VehicleTable.tsx
│   │   └── DriverTable.tsx
│   └── audit/
│       └── AuditLogTable.tsx
├── pages/
│   ├── CommandCenter.tsx
│   ├── TheGate.tsx
│   ├── LiveOperations.tsx
│   ├── FleetGuard.tsx
│   └── AuditLogs.tsx
├── data/
│   └── mockData.ts
└── lib/
    └── utils.ts
```

