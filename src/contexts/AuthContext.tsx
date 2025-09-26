import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'admin';
  village?: string;
  district?: string;
  designation?: string;
  permissions?: string[];
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  handleServerRestart: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use a shared session ID across all tabs in the same browser
  const SESSION_ID_KEY = 'healthnet_session_id';
  const USER_KEY = 'healthnet_user';
  
  // Get or create a shared session ID for this browser instance
  const getSessionId = (): string => {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = Math.random().toString(36) + Date.now().toString(36);
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  };

  const getInitialUser = (): User | null => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Check if user data has a session ID and if it matches current session
        if (userData.sessionId === getSessionId()) {
          // Check if session has expired (24 hours)
          const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          const now = Date.now();
          const loginTime = userData.loginTime || now;
          
          if (now - loginTime > sessionTimeout) {
            // Session expired - clear user data
            console.log('Session expired, clearing user data');
            localStorage.removeItem(USER_KEY);
            return null;
          }
          
          return userData;
        } else {
          // Session mismatch - clear user data (server restart scenario)
          localStorage.removeItem(USER_KEY);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  };

  const [user, setUser] = useState<User | null>(getInitialUser());

  // Add effect to handle storage events and server restart detection
  useEffect(() => {
    // Listen for storage events (when localStorage is modified in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_KEY && e.newValue === null) {
        // User was logged out in another tab
        setUser(null);
      } else if (e.key === USER_KEY && e.newValue) {
        // User was logged in in another tab
        try {
          const userData = JSON.parse(e.newValue);
          if (userData.sessionId === getSessionId()) {
            // Check if session has expired
            const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            const now = Date.now();
            const loginTime = userData.loginTime || now;
            
            if (now - loginTime <= sessionTimeout) {
              setUser(userData);
            } else {
              // Session expired - clear user data
              localStorage.removeItem(USER_KEY);
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Error parsing user data from storage event:', error);
        }
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Add effect to periodically check for server restart
  useEffect(() => {
    if (!user) return; // Only check if user is logged in

    const checkServerStatus = async () => {
      try {
        // Try to fetch a simple endpoint to check if server is running
        const response = await fetch('/Data-UAD/DATAUAD.json', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        if (!response.ok) {
          // Server might be down or restarted
          console.log('Server appears to be down, clearing session');
          handleServerRestart();
        }
      } catch {
        // Network error or server down
        console.log('Server connection failed, clearing session');
        handleServerRestart();
      }
    };

    // Check server status every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      // Fetch users from DATAUAD.json file
      const response = await fetch('/Data-UAD/DATAUAD.json');
      if (!response.ok) {
        console.error('Failed to fetch users for authentication');
        return false;
      }

      const data = await response.json();
      const users = data.users || [];

      // Find user by email
      const foundUser = users.find((user: { email: string; phone: string; role: string; id: string; name: string; district: string }) => user.email === email);

      if (!foundUser) {
        console.log('User not found with email:', email);
        return false;
      }

      // Validate password (mobile number)
      if (foundUser.phone !== password) {
        console.log('Invalid password for user:', email);
        return false;
      }

      // Validate role compatibility
      let userRole: 'staff' | 'admin';
      let designation: string;
      let permissions: string[];

      // Check if user has admin privileges
      if (foundUser.role === 'Admin' || foundUser.role === 'Administrator' || foundUser.role === 'District Health Officer' || foundUser.role === 'Health Officer') {
        if (role !== 'admin') {
          console.log('Role mismatch: user is admin but selected role is', role);
          return false;
        }
        userRole = 'admin';
        designation = foundUser.role === 'District Health Officer' ? 'District Health Officer' : 
                     foundUser.role === 'Health Officer' ? 'Health Officer' : 'Administrator';
        permissions = ['view_all_reports', 'manage_users', 'view_analytics', 'manage_alerts', 'view_predictions'];
      } else if (['ASHA Workers', 'ANM', 'Nurses', 'Health Staff', 'Government Officials', 'Staff'].includes(foundUser.role)) {
        if (role !== 'staff') {
          console.log('Role mismatch: user is staff but selected role is', role);
          return false;
        }
        userRole = 'staff';
        designation = foundUser.role;
        permissions = ['view_reports', 'submit_water_tests', 'distribute_medicine'];
      } else {
        console.log('Invalid user role:', foundUser.role);
        return false;
      }

      // Create authenticated user object with session ID and login time
      const userData: User & { sessionId: string; loginTime: number } = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: userRole,
        village: foundUser.district, // Use district as village for now
        district: foundUser.district,
        designation: designation,
        permissions: permissions,
        sessionId: getSessionId(),
        loginTime: Date.now(),
      };

      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      console.log('Login successful for user:', foundUser.name);
      return true;

    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    // Note: We don't remove the session ID here to allow for potential re-login
    // The session ID will be cleared when the browser is closed or server restarts
  };

  // Function to handle server restart detection
  const handleServerRestart = () => {
    // Clear all session data
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
    setUser(null);
  };

  const isAuthenticated = user !== null;

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasPermission, handleServerRestart }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}