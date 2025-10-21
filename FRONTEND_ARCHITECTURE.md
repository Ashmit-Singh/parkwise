# ParkWise Frontend UX Architecture

## Overview
Modern, research-grade React application with Web3 integration, real-time updates, and behavioral experiment capabilities.

## Technology Stack

### Core
- **Framework**: React 18.3 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + React Query
- **Routing**: React Router v6

### Web3
- **Library**: ethers.js / wagmi
- **Wallet**: MetaMask, WalletConnect
- **Chain**: Ethereum, Polygon

### Visualization
- **Charts**: Recharts + Chart.js
- **Maps**: Leaflet / Google Maps React
- **3D**: Three.js (optional impact visualizations)

### Real-time
- **WebSocket**: Socket.io client
- **Notifications**: react-hot-toast

## Feature Modules

### 1. Donation Dashboard

#### Components
```
DonationDashboard/
├── DonationForm.tsx           # Multi-step donation flow
├── TransactionHistory.tsx     # Blockchain TX list
├── ImpactVisualization.tsx    # Charts showing conservation impact
├── VerificationBadge.tsx      # Blockchain verification status
├── RealTimeUpdates.tsx        # WebSocket feed
└── WalletConnect.tsx          # MetaMask integration
```

#### Features
- **Blockchain Transparency**
  - Live transaction status with Etherscan links
  - Gas fee estimation
  - Smart contract interaction UI
  - Transaction receipt download

- **Real-time Updates**
  - WebSocket connection for TX confirmations
  - Push notifications for milestone achievements
  - Live fundraising progress bars

- **Impact Metrics**
  - Trees planted visualization
  - CO2 offset calculator
  - Wildlife protected counters
  - Before/after photo galleries

#### UX Flow
```
1. Connect Wallet → 2. Select Project → 3. Enter Amount
   ↓
4. Review Impact Preview → 5. Sign Transaction → 6. Confirmation
   ↓
7. Share Achievement → 8. Claim Rewards
```

### 2. Geo-visualization Module

#### Components
```
GeoVisualization/
├── ConservationMap.tsx        # Interactive map
├── GeofenceBoundary.tsx       # Polygon overlays
├── ProjectMarker.tsx          # Clickable project pins
├── HeatmapLayer.tsx           # Density visualization
├── LiveTracking.tsx           # Real-time monitoring
└── LocationSubmit.tsx         # Geo-tagged photo upload
```

#### Features
- **Interactive Map**
  - Leaflet/Google Maps integration
  - Zoom controls, layer toggles
  - Custom markers for project types
  - Satellite/terrain view switching

- **Geofencing**
  - Visual polygon boundaries
  - Color-coded zones (protected, monitoring, restricted)
  - Alert indicators for intrusions
  - Distance calculations

- **Project Discovery**
  - Search by location
  - Filter by conservation type
  - "Near me" functionality
  - Route planning to projects

#### Map Layers
```javascript
{
  protectedAreas: { color: 'green', opacity: 0.3 },
  activeProjects: { color: 'blue', opacity: 0.5 },
  alertZones: { color: 'red', opacity: 0.6 },
  userSubmissions: { color: 'yellow', opacity: 0.4 }
}
```

### 3. Behavioral Experiments UI

#### Components
```
Experiments/
├── VariantLayout.tsx          # Dynamic A/B test rendering
├── DonationNudge.tsx          # Social proof messages
├── ProgressIndicator.tsx      # Goal progress bars
├── UrgencyTimer.tsx           # Countdown timers
├── ImpactBadges.tsx           # Gamification rewards
└── SocialProof.tsx            # "Others donated" widgets
```

#### Variant Types

**Control (A)**
- Standard donation form
- No urgency elements
- Basic impact statistics

**Treatment B: Social Proof**
```jsx
"🌟 342 people in Mumbai donated this week!"
"Top donor: ₹50,000 by Rajesh K."
"Join 2,847 conservationists"
```

**Treatment C: Urgency + Impact**
```jsx
"⏰ Only 48 hours left!"
"Your ₹500 = 5 trees planted"
"95% funded - Last chance!"
```

**Treatment D: Gamification**
```jsx
"🏆 Earn 'Forest Guardian' Badge"
"Next milestone: Plant 100 trees"
"Unlock exclusive NFT reward"
```

#### Event Tracking
```javascript
// Automatic event logging
trackEvent({
  type: 'PAGE_VIEW',
  variant: 'treatment_b',
  timestamp: Date.now(),
  metadata: { referrer, device }
});

trackEvent({
  type: 'DONATION_CLICKED',
  variant: 'treatment_b',
  amount: 500,
  project_id: 123
});
```

### 4. Researcher Admin Panel

#### Components
```
Admin/
├── ExperimentDashboard.tsx    # Experiment list
├── CreateExperiment.tsx       # Setup wizard
├── AnalyticsView.tsx          # Statistical results
├── ConversionFunnel.tsx       # Funnel visualization
├── Heatmap.tsx                # Click heatmap
├── ExportData.tsx             # CSV/JSON export
└── UserSegmentation.tsx       # Cohort analysis
```

#### Dashboard Features

**Experiment Management**
- Create/edit/archive experiments
- Variant configuration (weights, content)
- Start/stop controls
- Duration settings

**Analytics**
```
Metrics Displayed:
- Conversion Rate (by variant)
- Average Donation Amount
- Click-through Rate
- Time on Page
- Bounce Rate
- Statistical Significance (p-value)
```

**Visualizations**
- Line charts: Conversion over time
- Bar charts: Variant comparison
- Funnel charts: Drop-off analysis
- Heatmaps: User interaction patterns
- Cohort tables: Retention analysis

**Data Export**
- CSV: Raw event logs
- JSON: Structured analytics
- PDF: Executive reports
- API: Real-time data access

#### Example Dashboard View
```
┌─────────────────────────────────────────┐
│  Experiment: Social Proof Test          │
│  Status: ACTIVE │ 1,234 participants    │
├─────────────────────────────────────────┤
│  Control (A)     │ 2.3% CR │ ₹450 avg  │
│  Treatment (B)   │ 4.1% CR │ ₹520 avg  │
│  p-value: 0.003 ✅ Significant          │
├─────────────────────────────────────────┤
│  [View Details] [Export] [Stop Test]    │
└─────────────────────────────────────────┘
```

## Page Structure

### Public Pages
```
/                          # Landing page with hero
/projects                  # Browse conservation projects
/project/:id               # Project details + donate
/map                       # Geo-visualization
/about                     # Mission, team
/impact                    # Overall statistics
```

### Authenticated Pages
```
/dashboard                 # User dashboard
/profile                   # User settings
/donations                 # Transaction history
/badges                    # Achievements, NFTs
```

### Admin Pages
```
/admin                     # Overview
/admin/experiments         # A/B test management
/admin/analytics           # Advanced analytics
/admin/users               # User management
/admin/projects            # Project moderation
```

## Design System

### Colors (Tailwind)
```javascript
{
  primary: 'green-600',      // Conservation theme
  secondary: 'blue-500',     // Trust/transparency
  accent: 'amber-500',       // Urgency/rewards
  success: 'emerald-500',
  warning: 'orange-500',
  error: 'red-500',
  neutral: 'gray'
}
```

### Typography
```
Headings: Inter (bold, 600-700)
Body: Inter (regular, 400)
Mono: JetBrains Mono (code, data)
```

### shadcn/ui Components Used
- Button, Card, Dialog, Dropdown
- Form, Input, Select, Checkbox
- Table, Tabs, Toast, Tooltip
- Progress, Badge, Avatar
- Sheet, Popover, Command

## Responsive Breakpoints
```
sm: 640px   # Mobile
md: 768px   # Tablet
lg: 1024px  # Desktop
xl: 1280px  # Wide desktop
```

## Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Focus indicators
- Color contrast ratios
- ARIA labels

## Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90
- Bundle Size: < 500KB (gzipped)

## Animation & Interaction

### Libraries
- Framer Motion: Page transitions
- React Spring: Micro-interactions
- GSAP: Complex animations (optional)

### Effects
- Smooth scroll
- Fade-in on scroll
- Skeleton loaders
- Optimistic UI updates
- Confetti on donations 🎉

## State Management

### Zustand Stores
```javascript
useAuthStore         // User, wallet, JWT
useDonationStore     // Cart, TX status
useExperimentStore   // Assigned variants
useMapStore          // Selected projects, filters
```

### React Query
```javascript
useProjects()        // Fetch projects
useDonations()       // User donation history
useBlockchainTx()    // TX verification
```

## Real-time Features

### WebSocket Events
```
'tx:confirmed'       // Blockchain confirmation
'project:funded'     // Fundraising milestone
'badge:earned'       // Achievement unlocked
'alert:geofence'     // Geofence breach
```

## Testing Strategy
- **Unit**: Vitest + React Testing Library
- **E2E**: Playwright
- **Visual**: Chromatic (Storybook)
- **Accessibility**: axe-core

## Deployment
- **Hosting**: Vercel / Netlify
- **CDN**: Cloudflare
- **Analytics**: Plausible / Fathom
- **Error Tracking**: Sentry

## Next Steps
1. Set up Vite + TypeScript + Tailwind
2. Install shadcn/ui components
3. Implement wallet connection
4. Build donation flow
5. Create map visualization
6. Develop experiment UI
7. Build admin dashboard
8. Add real-time features
