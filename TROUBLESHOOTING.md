# 🔧 ParkWise - Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. **npm install fails**

#### Error: `EACCES` or permission denied
```bash
# Windows: Run as Administrator
# Or clear npm cache
npm cache clean --force
npm install
```

#### Error: `ERESOLVE` dependency conflicts
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or force install
npm install --force
```

#### Error: Network timeout
```bash
# Increase timeout
npm install --timeout=60000

# Or use different registry
npm config set registry https://registry.npmjs.org/
npm install
```

---

### 2. **Frontend won't start**

#### Error: `Port 5173 already in use`
```bash
# Find and kill process on Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

#### Error: `Cannot find module`
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Error: `Vite not found`
```bash
# Install Vite globally
npm install -g vite

# Or use npx
npx vite
```

---

### 3. **Backend connection issues**

#### Error: `Network Error` or `CORS`
```bash
# Check backend is running
curl http://localhost:8080/api/health

# Verify .env file
cat frontend/.env

# Check VITE_API_URL is correct
VITE_API_URL=http://localhost:8080/api
```

#### Error: `401 Unauthorized`
```bash
# Clear browser storage
# Open DevTools > Application > Clear storage

# Or logout and login again
```

---

### 4. **Build errors**

#### Error: `out of memory`
```bash
# Increase Node memory
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

#### Error: `TypeScript errors`
```bash
# Skip type checking (temporary)
npm run build -- --skipTypeCheck

# Or fix TypeScript issues
npm run type-check
```

---

### 5. **Map not loading**

#### Issue: Blank map or tiles not loading
```javascript
// Check Leaflet CSS is imported in main.jsx or index.css
import 'leaflet/dist/leaflet.css'

// Verify internet connection for tile loading
// Check browser console for errors
```

#### Issue: Markers not showing
```javascript
// Fix Leaflet marker icons
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})
```

---

### 6. **MetaMask issues**

#### Error: `MetaMask not detected`
```bash
# Install MetaMask browser extension
# Refresh page after installation
# Check window.ethereum is available
```

#### Error: `Wrong network`
```javascript
// Switch to Polygon network in MetaMask
// Or update VITE_CHAIN_ID in .env
VITE_CHAIN_ID=137  # Polygon Mainnet
VITE_CHAIN_ID=80001  # Polygon Mumbai Testnet
```

#### Error: `User rejected transaction`
```bash
# User cancelled in MetaMask
# Try again and approve the transaction
```

---

### 7. **Image upload issues**

#### Error: `File too large`
```bash
# Check file size (max 10MB)
# Compress image before upload
# Or increase backend limit
```

#### Error: `Invalid file type`
```bash
# Only jpg, png, gif supported
# Convert file to supported format
```

---

### 8. **WebSocket connection failed**

#### Error: `WebSocket connection failed`
```bash
# Check backend WebSocket endpoint
# Verify VITE_WS_URL in .env
VITE_WS_URL=ws://localhost:8080/ws

# Test with wscat
npm install -g wscat
wscat -c ws://localhost:8080/ws
```

---

### 9. **Styling issues**

#### Issue: Tailwind classes not working
```bash
# Rebuild Tailwind
npm run build

# Check tailwind.config.js content paths
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

#### Issue: Icons not showing
```bash
# Verify lucide-react is installed
npm install lucide-react

# Check import
import { Icon } from 'lucide-react'
```

---

### 10. **Performance issues**

#### Issue: Slow page load
```bash
# Enable production build
npm run build
npm run preview

# Check bundle size
npm run build -- --analyze
```

#### Issue: Memory leaks
```javascript
// Clean up useEffect hooks
useEffect(() => {
  // Setup
  return () => {
    // Cleanup
  }
}, [])
```

---

## 🔍 Debugging Tips

### Check Browser Console
```javascript
// Open DevTools (F12)
// Check Console tab for errors
// Check Network tab for failed requests
```

### Check Environment Variables
```bash
# Verify all VITE_ variables are set
echo %VITE_API_URL%

# Restart dev server after changing .env
```

### Check Backend Status
```bash
# Test backend health
curl http://localhost:8080/api/health

# Check backend logs
# Look for CORS or authentication errors
```

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear browser cache
# DevTools > Application > Clear storage

# Clear Vite cache
rm -rf node_modules/.vite
```

---

## 📋 Pre-flight Checklist

Before starting the frontend:

- [ ] Node.js v18+ installed
- [ ] Backend running on port 8080
- [ ] `.env` file configured
- [ ] Dependencies installed (`npm install`)
- [ ] No port conflicts (5173 available)
- [ ] Internet connection (for maps & tiles)
- [ ] MetaMask installed (for blockchain features)

---

## 🆘 Still Having Issues?

### 1. Check Documentation
- [Frontend Enhancement Complete](./FRONTEND_ENHANCEMENT_COMPLETE.md)
- [Quick Start Guide](./FRONTEND_QUICKSTART.md)
- [README Enhanced](./frontend/README_ENHANCED.md)

### 2. Verify Setup
```bash
# Check Node version
node --version  # Should be v18+

# Check npm version
npm --version  # Should be v9+

# Check backend
curl http://localhost:8080/api/health
```

### 3. Clean Install
```bash
# Complete clean install
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

### 4. Check Logs
```bash
# Frontend logs
# Check terminal output

# Backend logs
# Check backend console

# Browser logs
# Check DevTools Console
```

---

## 🔄 Quick Fixes

### Reset Everything
```bash
# Stop all servers
# Clear all caches
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json .vite
npm cache clean --force
npm install
npm run dev
```

### Test Backend Connection
```bash
# Simple test
curl http://localhost:8080/api/health

# Test with auth
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/ai/trending
```

### Verify Environment
```bash
# Check .env exists
ls frontend/.env

# Check content
cat frontend/.env

# Verify variables loaded
# In browser console:
console.log(import.meta.env.VITE_API_URL)
```

---

## 📞 Getting Help

If you're still stuck:

1. **Check the error message carefully**
2. **Search the error in browser/terminal**
3. **Review the documentation**
4. **Check GitHub issues**
5. **Ask for help with:**
   - Exact error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Browser console logs
   - Network tab screenshots

---

**Remember**: Most issues are related to:
- Missing dependencies
- Wrong environment variables
- Backend not running
- Port conflicts
- Cache issues

**Quick fix**: Clean install usually solves 80% of issues! 🚀
