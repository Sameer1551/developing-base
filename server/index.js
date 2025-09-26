import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to DATAUAD.json file
const DATA_FILE_PATH = path.join(__dirname, '..', 'Data-UAD', 'DATAUAD.json');
// Path to alert.json file
const ALERT_FILE_PATH = path.join(__dirname, '..', 'Data-UAD', 'alert.json');

// Helper function to read user data
async function readUserData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data:', error);
    return { users: [] };
  }
}

// Helper function to write user data
async function writeUserData(data) {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing user data:', error);
    throw error;
  }
}

// Helper function to read alert data
async function readAlertData() {
  try {
    const data = await fs.readFile(ALERT_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading alert data:', error);
    return { alerts: [] };
  }
}

// Helper function to write alert data
async function writeAlertData(data) {
  try {
    await fs.writeFile(ALERT_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing alert data:', error);
    throw error;
  }
}

// API Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const userData = await readUserData();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const userData = await readUserData();
    const newUser = req.body;
    
    // Generate unique ID
    const userId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create user object
    const user = {
      ...newUser,
      id: userId,
      lastActive: new Date().toISOString(),
      joinDate: new Date().toISOString(),
      mobile: newUser.phone,
      originalRole: newUser.role
    };
    
    // Check for duplicate email
    if (userData.users.some(u => u.email === user.email)) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Check for duplicate phone
    if (userData.users.some(u => u.phone === user.phone)) {
      return res.status(400).json({ error: 'User with this phone number already exists' });
    }
    
    // Add user to data
    userData.users.push(user);
    
    // Write back to file
    await writeUserData(userData);
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Update a user
app.put('/api/users/:id', async (req, res) => {
  try {
    const userData = await readUserData();
    const userId = req.params.id;
    const updates = req.body;
    
    const userIndex = userData.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user
    userData.users[userIndex] = { ...userData.users[userIndex], ...updates };
    
    // Write back to file
    await writeUserData(userData);
    
    res.json(userData.users[userIndex]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userData = await readUserData();
    const userId = req.params.id;
    
    const userIndex = userData.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove user
    userData.users.splice(userIndex, 1);
    
    // Write back to file
    await writeUserData(userData);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Alert API Routes

// Get all alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const alertData = await readAlertData();
    
    // Sort alerts by creation date in descending order (newest first)
    if (alertData.alerts && alertData.alerts.length > 0) {
      alertData.alerts.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    }
    
    res.json(alertData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Add a new alert
app.post('/api/alerts', async (req, res) => {
  try {
    const alertData = await readAlertData();
    const newAlert = req.body;
    
    // Generate unique ID if not provided
    if (!newAlert.id) {
      newAlert.id = Date.now().toString();
    }
    
    // Set timestamps if not provided
    const now = new Date().toISOString();
    if (!newAlert.createdAt) {
      newAlert.createdAt = now;
    }
    if (!newAlert.updatedAt) {
      newAlert.updatedAt = now;
    }
    
    // Add alert to data
    alertData.alerts.unshift(newAlert); // Add to beginning of array
    
    // Sort alerts by creation date in descending order (newest first)
    alertData.alerts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    
    // Write back to file
    await writeAlertData(alertData);
    
    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error adding alert:', error);
    res.status(500).json({ error: 'Failed to add alert' });
  }
});

// Update an alert
app.put('/api/alerts/:id', async (req, res) => {
  try {
    const alertData = await readAlertData();
    const alertId = req.params.id;
    const updates = req.body;
    
    const alertIndex = alertData.alerts.findIndex(a => a.id === alertId);
    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    // Update alert with new timestamp
    alertData.alerts[alertIndex] = { 
      ...alertData.alerts[alertIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Sort alerts by creation date in descending order (newest first)
    alertData.alerts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    
    // Write back to file
    await writeAlertData(alertData);
    
    res.json(alertData.alerts[alertIndex]);
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Delete an alert
app.delete('/api/alerts/:id', async (req, res) => {
  try {
    const alertData = await readAlertData();
    const alertId = req.params.id;
    
    const alertIndex = alertData.alerts.findIndex(a => a.id === alertId);
    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    // Remove alert
    alertData.alerts.splice(alertIndex, 1);
    
    // Write back to file
    await writeAlertData(alertData);
    
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
