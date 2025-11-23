# Server Start Guide - Fix CORS Error

## 🚨 Issue
The backend server is not running on port 5001, causing "Failed to fetch" errors.

## ✅ Solution

### Step 1: Update .env File
Edit `server/.env` and change:
```
PORT=5000
```
to:
```
PORT=5001
```

### Step 2: Start the Backend Server

**Option A: Using npm start**
```bash
cd server
npm start
```

**Option B: Using node directly**
```bash
cd server
node server.js
```

**Option C: Using nodemon (if installed)**
```bash
cd server
npx nodemon server.js
```

### Step 3: Verify Server is Running

You should see:
```
✅ Connected to MongoDB
🚀 Server is running on port 5001
📡 API available at http://localhost:5001/api
```

### Step 4: Clear Browser Cache & Service Worker

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. Click **Unregister** for any registered service workers
5. Go to **Storage** → Click **Clear site data**
6. Refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Step 5: Test Registration

Try registering again - it should work now!

## 🔍 Troubleshooting

### If server won't start:
- Check if MongoDB is running
- Check if port 5001 is available: `lsof -i :5001`
- Check server logs for errors

### If still getting CORS errors:
- Make sure server is running on port 5001
- Check browser console for specific error messages
- Verify `CLIENT_URL` in server `.env` is set to `http://localhost:5173`

### If service worker is interfering:
- Unregister service worker (see Step 4)
- Hard refresh the page
- The updated service worker will skip caching API requests

## 📝 Quick Start Command

```bash
# Terminal 1 - Start Backend
cd server
PORT=5001 node server.js

# Terminal 2 - Start Frontend (if not already running)
cd client
npm run dev
```

