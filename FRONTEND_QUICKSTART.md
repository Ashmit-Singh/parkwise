# 🚀 ParkWise Frontend - Quick Start Guide

## 📦 Prerequisites

- **Node.js**: v18+ (recommended v20)
- **npm**: v9+ or **yarn**: v1.22+
- **Backend**: ParkWise backend running on `http://localhost:8080`
- **MetaMask**: Browser extension for blockchain features

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create `.env` file in `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws

# Blockchain Configuration
VITE_BLOCKCHAIN_NETWORK=polygon
VITE_CHAIN_ID=137
VITE_RPC_URL=https://polygon-rpc.com

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## 🎯 Feature Access Guide

### **Public Features** (No Login Required)
- **Home**: `/` - Landing page
- **Geospatial Explorer**: `/geospatial` - Interactive maps
- **Species Portal**: `/species-portal` - Citizen science
- **Blockchain Hub**: `/blockchain` - Blockchain features
- **Parks**: `/parks` - Park listings
- **Campaigns**: `/campaigns` - Conservation campaigns

### **User Features** (Login Required)
- **AI Insights**: `/ai-insights` - Personalized recommendations
- **Donate**: `/donate` - Make donations
- **Privacy Center**: `/privacy` - GDPR compliance
- **Notifications**: `/notifications` - Notification center

### **Researcher Features** (Researcher Role)
- **Experiments**: `/experiments` - A/B testing dashboard
- **Research**: `/research` - Research tools
- **Researcher Dashboard**: `/researcher-dashboard` - Analytics

### **Admin Features** (Admin Role)
- **Admin Panel**: `/admin` - User management
- **Admin Dashboard**: `/admin-dashboard` - System monitoring

---

## 🧪 Testing Features

### 1. **Test AI Insights**
```bash
# Login as user
# Navigate to /ai-insights
# View donor score and recommendations
```

### 2. **Test Geospatial**
```bash
# Navigate to /geospatial
# Click "Use My Location"
# Adjust search radius
# View nearby projects
```

### 3. **Test Species Portal**
```bash
# Navigate to /species-portal
# Upload a species photo
# Add location (or use GPS)
# Submit sighting
# View leaderboard
```

### 4. **Test Blockchain**
```bash
# Install MetaMask
# Navigate to /blockchain
# Connect wallet
# Mint reputation badge
# View transactions
```

### 5. **Test Experiments** (Researcher)
```bash
# Login as researcher
# Navigate to /experiments
# View experiment metrics
# Analyze variant performance
```

---

## 🔧 Development Commands

### **Start Development Server**
```bash
npm run dev
```

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

### **Lint Code**
```bash
npm run lint
```

### **Format Code**
```bash
npm run format
```

---

## 🎨 UI Components Overview

### **Layout Components**
- `Navbar` - Main navigation with role-based menu
- `Footer` - Site footer with links
- `ErrorBoundary` - Error handling wrapper
- `ProtectedRoute` - Route authentication

### **Feature Components**
- `AIRecommendations` - AI-powered suggestions
- `InteractiveMap` - Leaflet map component
- `DonateWithWeb3` - Blockchain donation
- `WalletConnect` - MetaMask integration
- `ImageUpload` - Species photo upload
- `ExperimentVisualization` - A/B test charts

### **UI Components**
- `Card` - Reusable card component
- `StatsCard` - Metric display card
- `LoadingSpinner` - Loading indicator
- `Toast` - Notification system

---

## 📱 Mobile Testing

### **Test on Mobile Device**
```bash
# Get your local IP address
ipconfig  # Windows
ifconfig  # Mac/Linux

# Start dev server with host flag
npm run dev -- --host

# Access from mobile browser
http://YOUR_IP:5173
```

---

## 🔐 Authentication Testing

### **Create Test Users**

#### **Regular User**
```json
{
  "email": "user@test.com",
  "password": "Test123!",
  "name": "Test User",
  "role": "USER"
}
```

#### **Researcher**
```json
{
  "email": "researcher@test.com",
  "password": "Test123!",
  "name": "Test Researcher",
  "role": "RESEARCHER"
}
```

#### **Admin**
```json
{
  "email": "admin@test.com",
  "password": "Test123!",
  "name": "Test Admin",
  "role": "ADMIN"
}
```

### **Web3 Login**
1. Install MetaMask
2. Create/import wallet
3. Click "Connect Wallet" on login page
4. Sign message to authenticate

---

## 🗺️ Feature Testing Checklist

### **AI Insights** ✅
- [ ] View donor score
- [ ] See classification (CHAMPION/LOYAL/POTENTIAL/PROSPECT)
- [ ] View personalized recommendations
- [ ] Check trending projects

### **Geospatial** ✅
- [ ] View all projects on map
- [ ] Use current location
- [ ] Search nearby projects
- [ ] Adjust search radius
- [ ] Check geofence boundaries

### **Species Portal** ✅
- [ ] Upload species photo
- [ ] Add location manually
- [ ] Use GPS location
- [ ] Submit sighting
- [ ] View sightings map
- [ ] Check leaderboard
- [ ] Browse species catalog

### **Blockchain** ✅
- [ ] Connect MetaMask wallet
- [ ] View blockchain status
- [ ] Mint reputation badge
- [ ] View transaction history
- [ ] Check smart contract info

### **Experiments** ✅
- [ ] View active experiments
- [ ] Check variant metrics
- [ ] Analyze conversion rates
- [ ] View statistical analysis
- [ ] Identify winning variant

### **Privacy** ✅
- [ ] Export user data
- [ ] Update privacy settings
- [ ] Manage consent preferences
- [ ] Test data deletion (use test account!)

### **Notifications** ✅
- [ ] View notifications
- [ ] Mark as read
- [ ] Delete notifications
- [ ] Update preferences

### **Admin** ✅
- [ ] View all users
- [ ] Update user roles
- [ ] Ban/unban users
- [ ] View system metrics
- [ ] Check audit logs

---

## 🐛 Common Issues & Solutions

### **Issue: API Connection Failed**
```bash
# Check backend is running
curl http://localhost:8080/api/health

# Verify VITE_API_URL in .env
echo $VITE_API_URL
```

### **Issue: MetaMask Not Detected**
```bash
# Install MetaMask browser extension
# Refresh page after installation
# Check browser console for errors
```

### **Issue: Map Not Loading**
```bash
# Check Leaflet CSS is imported
# Verify internet connection (for tiles)
# Check browser console for errors
```

### **Issue: Images Not Uploading**
```bash
# Check file size (max 10MB)
# Verify file type (jpg, png, gif)
# Check backend file upload limits
```

### **Issue: WebSocket Connection Failed**
```bash
# Verify VITE_WS_URL in .env
# Check backend WebSocket endpoint
# Test with: wscat -c ws://localhost:8080/ws
```

---

## 📊 Performance Optimization

### **Production Build Optimization**
```bash
# Build with optimizations
npm run build

# Analyze bundle size
npm run build -- --analyze

# Preview production build
npm run preview
```

### **Code Splitting**
Routes are automatically code-split. Check network tab to verify.

### **Image Optimization**
- Use WebP format when possible
- Implement lazy loading
- Compress images before upload

---

## 🔄 Integration with Backend

### **API Base URL**
All API calls use `VITE_API_URL` from `.env`:
```javascript
import { aiAPI } from './services/apiEnhanced';

// Calls http://localhost:8080/api/ai/donor-score/123
const score = await aiAPI.getDonorScore(123);
```

### **Authentication Flow**
1. User logs in → JWT token received
2. Token stored in Zustand store
3. Axios interceptor adds token to all requests
4. Token auto-refreshes on 401 response

### **WebSocket Connection**
```javascript
import useWebSocket from './hooks/useWebSocket';

const { isConnected, sendMessage } = useWebSocket();
```

---

## 📚 Additional Resources

### **Documentation**
- [Frontend Enhancement Complete](./FRONTEND_ENHANCEMENT_COMPLETE.md)
- [Backend Architecture](./BACKEND_ARCHITECTURE.md)
- [API Documentation](./API_DOCUMENTATION.md)

### **External Links**
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Leaflet](https://leafletjs.com)
- [Recharts](https://recharts.org)
- [Ethers.js](https://docs.ethers.org)

---

## 🎉 You're Ready!

Your ParkWise frontend is now fully set up with:

✅ **10 new feature pages**  
✅ **100+ API endpoints integrated**  
✅ **AI insights & recommendations**  
✅ **Interactive geospatial maps**  
✅ **Blockchain wallet integration**  
✅ **Species identification portal**  
✅ **A/B testing dashboard**  
✅ **GDPR compliance center**  
✅ **Real-time notifications**  
✅ **Admin management tools**

### **Next Steps**
1. ✅ Start development server
2. ✅ Create test users
3. ✅ Test all features
4. ✅ Connect MetaMask wallet
5. ✅ Upload test species photo
6. ✅ Run experiments
7. ✅ Monitor with admin dashboard

### **Need Help?**
- Check browser console for errors
- Review API responses in Network tab
- Verify backend is running
- Check environment variables
- Review documentation files

---

**Happy Coding! 🚀**

*ParkWise Frontend v2.0.0*  
*Last Updated: October 24, 2025*
