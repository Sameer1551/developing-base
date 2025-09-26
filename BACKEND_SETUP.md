# Backend Setup for User Management

## Overview
The application now includes a backend Express.js server that directly writes to the `DATAUAD.json` file, ensuring that user data is properly persisted.

## What's Fixed
- ✅ **Direct DATAUAD.json persistence**: User data is now saved directly to the JSON file
- ✅ **API-first approach**: Frontend uses API endpoints for all user operations
- ✅ **Fallback mechanism**: If API is unavailable, falls back to localStorage
- ✅ **Real-time updates**: Changes are immediately reflected in the JSON file

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm run dev
```

This will start both:
- **Backend server** on `http://localhost:3001`
- **Frontend client** on `http://localhost:5173`

### 3. Alternative: Run Separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/users` - Get all users
- `POST /api/users` - Add a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/health` - Health check

## Data Flow

1. **User clicks "Add User"** → Opens AddUserModal
2. **User submits form** → Calls `userDataManager.addUser()`
3. **API call** → POST request to `/api/users`
4. **Backend processes** → Validates data and writes to `DATAUAD.json`
5. **Response** → Returns new user data to frontend
6. **UI updates** → User appears in the table immediately

## File Structure

```
├── server/
│   └── index.js          # Express server
├── Data-UAD/
│   └── DATAUAD.json      # User data file (auto-updated)
├── src/
│   └── utils/
│       └── userDataManager.ts  # Updated to use API
└── package.json          # Updated with backend dependencies
```

## Testing the Fix

1. Start the application: `npm run dev`
2. Navigate to Admin Dashboard → User Management
3. Click "Add User" button
4. Fill out the form and submit
5. Check that:
   - User appears in the table immediately
   - User data is saved to `Data-UAD/DATAUAD.json`
   - No manual export/download required

## Troubleshooting

### Backend not starting?
- Check if port 3001 is available
- Run `npm install` to ensure all dependencies are installed

### API calls failing?
- Verify backend is running on `http://localhost:3001`
- Check browser console for CORS errors
- The app will fallback to localStorage if API is unavailable

### Data not persisting?
- Check that `Data-UAD/DATAUAD.json` file exists and is writable
- Verify backend server has write permissions to the file

## Benefits

- **Automatic persistence**: No more manual export/download workflow
- **Real-time updates**: Changes are immediately saved to the JSON file
- **Better error handling**: Proper validation and error messages
- **Scalable architecture**: Easy to extend with more API endpoints
- **Fallback support**: Works even if backend is temporarily unavailable
