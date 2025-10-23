# 🎨 ParkWise Frontend - Enhanced Edition

> **A modern, production-ready React frontend with complete backend integration**

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-cyan)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🌟 Features

### **Core Capabilities**
- ✅ **AI-Powered Insights** - Donor scoring & personalized recommendations
- ✅ **Geospatial Explorer** - Interactive maps with geofencing
- ✅ **Citizen Science** - Species identification with AI
- ✅ **Blockchain Integration** - MetaMask wallet & reputation NFTs
- ✅ **A/B Testing** - Thompson Sampling experiments dashboard
- ✅ **GDPR Compliance** - Privacy center with data export/deletion
- ✅ **Real-time Notifications** - WebSocket-powered updates
- ✅ **Admin Dashboard** - Complete system management

### **Technical Highlights**
- 🚀 **100+ API Endpoints** integrated
- 🎨 **50+ React Components** with modern UI
- 📊 **Interactive Charts** with Recharts
- 🗺️ **Interactive Maps** with Leaflet
- 🔗 **Web3 Integration** with Ethers.js
- 📱 **Mobile Responsive** design
- 🔒 **Secure Authentication** with JWT + Web3
- ⚡ **Fast Performance** with Vite

---

## 📦 Installation

### Prerequisites
- Node.js v18+ (recommended v20)
- npm v9+ or yarn v1.22+
- Backend running on `http://localhost:8080`

### Quick Start
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR
npm run dev -- --host  # Expose to network

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint code
npm run format       # Format code
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/                    # Page components
│   │   ├── AIInsights.jsx       # AI donor insights
│   │   ├── Geospatial.jsx       # Interactive maps
│   │   ├── SpeciesPortal.jsx    # Citizen science
│   │   ├── ExperimentsDashboard.jsx  # A/B testing
│   │   ├── BlockchainHub.jsx    # Blockchain features
│   │   ├── PrivacyCenter.jsx    # GDPR compliance
│   │   ├── NotificationsCenter.jsx   # Notifications
│   │   └── AdminDashboard.jsx   # Admin panel
│   │
│   ├── components/               # Reusable components
│   │   ├── BehavioralInterventions/
│   │   ├── SpeciesIdentification/
│   │   ├── Integration/
│   │   ├── dashboard/
│   │   ├── auth/
│   │   └── ui/
│   │
│   ├── services/                 # API services
│   │   ├── apiEnhanced.js       # Complete API layer
│   │   ├── api.js               # Legacy API
│   │   └── auth.js              # Auth service
│   │
│   ├── stores/                   # State management
│   │   ├── authStore.js         # Auth state
│   │   ├── donationStore.js     # Donation state
│   │   └── experimentStore.js   # Experiment state
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useWallet.js
│   │   └── useWebSocket.js
│   │
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
│
├── public/                       # Static assets
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── README_ENHANCED.md           # This file
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws

# Blockchain Configuration
VITE_BLOCKCHAIN_NETWORK=polygon
VITE_CHAIN_ID=137
VITE_RPC_URL=https://polygon-rpc.com

# Optional Features
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=
```

---

## 🎯 Feature Guide

### 1. AI Insights (`/ai-insights`)
**Donor scoring and personalized recommendations**

- View your donor score (0-100)
- See classification (CHAMPION/LOYAL/POTENTIAL/PROSPECT)
- Get personalized project recommendations
- Explore trending conservation projects

### 2. Geospatial Explorer (`/geospatial`)
**Interactive maps with geofencing**

- View all conservation projects on map
- Use GPS to find nearby projects
- Adjust search radius (5-200km)
- Verify location within geofence boundaries

### 3. Species Portal (`/species-portal`)
**Citizen science and species identification**

- Upload species photos
- AI-powered identification
- GPS location capture
- View global sightings map
- Compete on leaderboard
- Browse species catalog

### 4. Experiments Dashboard (`/experiments`)
**A/B testing with Thompson Sampling**

- Monitor active experiments
- View variant performance
- Analyze conversion rates
- Statistical significance testing
- Identify winning variants

### 5. Blockchain Hub (`/blockchain`)
**Web3 integration and reputation badges**

- Connect MetaMask wallet
- Mint reputation NFTs (5 tiers)
- View transaction history
- Monitor blockchain status
- Track gas prices

### 6. Privacy Center (`/privacy`)
**GDPR compliance and data management**

- Export all your data (JSON)
- Delete account and data
- Manage privacy settings
- Control consent preferences
- View data usage

### 7. Notifications (`/notifications`)
**Real-time notification management**

- View all notifications
- Filter by type/status
- Mark as read/unread
- Manage preferences
- Delete notifications

### 8. Admin Dashboard (`/admin-dashboard`)
**System administration (Admin only)**

- Manage users (ban/unban)
- Update user roles
- View system metrics
- Monitor experiments
- Check audit logs

---

## 🛠️ Technology Stack

### Core
- **React** 18.2.0 - UI library
- **Vite** 5.0.0 - Build tool
- **React Router** 6.8.0 - Routing
- **Axios** 1.6.0 - HTTP client
- **Zustand** 5.0.8 - State management

### UI/UX
- **TailwindCSS** 3.3.6 - Styling
- **Lucide React** 0.288.0 - Icons
- **React Hot Toast** 2.6.0 - Notifications
- **Framer Motion** 10.16.0 - Animations
- **Headless UI** 1.7.19 - Accessible components

### Data Visualization
- **Recharts** 2.8.0 - Charts
- **React Leaflet** 4.2.1 - Maps
- **Leaflet** 1.9.4 - Map library

### Blockchain
- **Ethers.js** 6.9.0 - Web3 library
- **MetaMask Detect Provider** 2.0.0 - Wallet detection

### State & Query
- **TanStack React Query** 5.90.5 - Server state
- **Socket.io Client** 4.8.1 - WebSocket

---

## 📱 Mobile Support

All pages are fully responsive and mobile-optimized:

- Touch-friendly interactions
- GPS integration
- Camera access for photos
- Swipe gestures
- Adaptive layouts
- Mobile navigation

### Test on Mobile
```bash
npm run dev -- --host
# Access from mobile: http://YOUR_IP:5173
```

---

## 🔐 Authentication

### Traditional Login
```javascript
import { authAPI } from './services/apiEnhanced';

const response = await authAPI.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### Web3 Login
```javascript
import { authAPI } from './services/apiEnhanced';

const response = await authAPI.web3Login({
  walletAddress: '0x...',
  message: 'Sign in to ParkWise',
  signature: '0x...'
});
```

---

## 🎨 Styling Guide

### Color Palette
```css
/* Primary Colors */
--green-600: #059669;   /* Conservation */
--blue-600: #2563eb;    /* Technology */
--purple-600: #9333ea;  /* AI/Innovation */

/* Status Colors */
--red-600: #dc2626;     /* Error/Danger */
--yellow-600: #ca8a04;  /* Warning */
--orange-600: #ea580c;  /* Alert */
```

### Component Classes
```jsx
// Card
<div className="bg-white rounded-xl shadow-md p-6">

// Button Primary
<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">

// Badge
<span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">

// Input
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
```

---

## 🧪 Testing

### Unit Tests (Recommended)
```bash
npm run test
```

### E2E Tests (Recommended)
```bash
npm run test:e2e
```

### Manual Testing Checklist
- [ ] Login/Register flow
- [ ] AI insights display
- [ ] Map interactions
- [ ] Species upload
- [ ] Blockchain connection
- [ ] Privacy export/delete
- [ ] Notifications
- [ ] Admin functions

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

### Deploy to Vercel
```bash
vercel --prod
```

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## 📊 Performance

### Bundle Size
- Initial: ~500KB (gzipped)
- Code splitting: Enabled
- Lazy loading: Images & routes

### Optimization Tips
- Use production build
- Enable compression
- Implement CDN
- Cache static assets
- Optimize images

---

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
```bash
# Check backend is running
curl http://localhost:8080/api/health

# Verify .env configuration
cat .env
```

**MetaMask Not Detected**
- Install MetaMask extension
- Refresh page
- Check browser console

**Map Not Loading**
- Verify internet connection
- Check Leaflet CSS import
- Review browser console

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- [Complete Enhancement Guide](../FRONTEND_ENHANCEMENT_COMPLETE.md)
- [Quick Start Guide](../FRONTEND_QUICKSTART.md)
- [Executive Summary](../FRONTEND_ENHANCEMENT_SUMMARY.md)
- [Backend Architecture](../BACKEND_ARCHITECTURE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) file

---

## 🙏 Acknowledgments

- **React Team** - Amazing UI library
- **Vite Team** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Leaflet** - Open-source mapping library
- **Ethers.js** - Ethereum library
- **Open Source Community** - All contributors

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Ashmit-Singh/parkwise/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Ashmit-Singh/parkwise/discussions)
- **Email**: support@parkwise.org

---

## 🎉 Status

**Frontend Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: October 24, 2025  
**Backend Parity**: 100%  
**API Coverage**: 100+  endpoints  
**Features**: 8 major modules  
**Components**: 50+  
**Lines of Code**: 5,000+

---

**Built with ❤️ for conservation** 🌍💚

*ParkWise - Making conservation technology accessible and impactful*
