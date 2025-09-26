/**
 * User Data Manager Utility
 * Handles reading and writing user data to/from DATAUAD.json
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'ASHA Workers' | 'ANM' | 'Nurses' | 'Health Staff' | 'Government Officials' | 'District Health Officer';
  status: 'Active' | 'Inactive' | 'Suspended';
  district: string;
  lastActive: string;
  joinDate: string;
  permissions: string[];
  state?: string;
  mobile?: string;
  originalRole?: string;
}

export interface UserData {
  users: User[];
}

class UserDataManager {
  private static instance: UserDataManager;
  private users: User[] = [];
  private readonly STORAGE_KEY = 'healthnet_users_data';
  private readonly JSON_FILE_PATH = '/DATAUAD.json';
  private readonly API_BASE_URL = '/api';

  private constructor() {
    this.loadUsers();
  }

  public static getInstance(): UserDataManager {
    if (!UserDataManager.instance) {
      UserDataManager.instance = new UserDataManager();
    }
    return UserDataManager.instance;
  }

  /**
   * Load users from API or fallback to JSON file
   */
  private async loadUsers(): Promise<void> {
    try {
      // Try to load from API first
      const response = await fetch(`${this.API_BASE_URL}/users`);
      if (response.ok) {
        const data: UserData = await response.json();
        this.users = data.users || [];
        
        // Store in localStorage as backup
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        return;
      }
    } catch (error) {
      console.log('API not available, falling back to JSON file');
    }

    try {
      // Fallback to JSON file (public access)
      const response = await fetch(this.JSON_FILE_PATH);
      if (response.ok) {
        const data: UserData = await response.json();
        this.users = data.users || [];
        
        // Store in localStorage as backup
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } else {
        // Fallback to localStorage if file fetch fails
        const storedData = localStorage.getItem(this.STORAGE_KEY);
        if (storedData) {
          const data: UserData = JSON.parse(storedData);
          this.users = data.users || [];
        }
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      // Fallback to localStorage
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const data: UserData = JSON.parse(storedData);
        this.users = data.users || [];
      }
    }
  }

  /**
   * Get all users
   */
  public getUsers(): User[] {
    return [...this.users];
  }

  /**
   * Add a new user
   */
  public async addUser(userData: Omit<User, 'id' | 'lastActive' | 'joinDate'>): Promise<User> {
    try {
      // Try to add via API first
      const response = await fetch(`${this.API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        this.users.push(newUser);
        await this.saveUsers();
        return newUser;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add user');
      }
    } catch (error) {
      console.log('API not available, using local storage');
      
      // Fallback to local storage
      const newUser: User = {
        ...userData,
        id: this.generateUserId(),
        lastActive: new Date().toISOString(),
        joinDate: new Date().toISOString(),
        mobile: userData.phone, // Set mobile same as phone
        originalRole: userData.role // Set originalRole same as role
      };

      // Check for duplicate email
      if (this.users.some(user => user.email === newUser.email)) {
        throw new Error('User with this email already exists');
      }

      // Check for duplicate phone
      if (this.users.some(user => user.phone === newUser.phone)) {
        throw new Error('User with this phone number already exists');
      }

      this.users.push(newUser);
      await this.saveUsers();
      return newUser;
    }
  }

  /**
   * Update an existing user
   */
  public async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      // Try to update via API first
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = updatedUser;
        }
        await this.saveUsers();
        return updatedUser;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
    } catch (error) {
      console.log('API not available, using local storage');
      
      // Fallback to local storage
      const userIndex = this.users.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUser = { ...this.users[userIndex], ...userData };
      this.users[userIndex] = updatedUser;
      await this.saveUsers();
      return updatedUser;
    }
  }

  /**
   * Delete a user
   */
  public async deleteUser(userId: string): Promise<void> {
    try {
      // Try to delete via API first
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          this.users.splice(userIndex, 1);
        }
        await this.saveUsers();
        return;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
    } catch (error) {
      console.log('API not available, using local storage');
      
      // Fallback to local storage
      const userIndex = this.users.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      this.users.splice(userIndex, 1);
      await this.saveUsers();
    }
  }

  /**
   * Save users to localStorage and provide download option
   */
  private async saveUsers(): Promise<void> {
    const userData: UserData = { users: this.users };
    
    // Save to localStorage as primary storage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
    
    // Dispatch event to notify that data has been updated
    const event = new CustomEvent('userDataUpdated', { 
      detail: { userData, timestamp: Date.now() } 
    });
    window.dispatchEvent(event);
    
    console.log('User data updated and saved to localStorage');
  }


  /**
   * Generate a unique user ID
   */
  private generateUserId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Refresh users from the source
   */
  public async refreshUsers(): Promise<void> {
    await this.loadUsers();
  }

  /**
   * Export users data as JSON
   */
  public exportUsers(): string {
    const userData: UserData = { users: this.users };
    return JSON.stringify(userData, null, 2);
  }

  /**
   * Import users data from JSON string
   */
  public async importUsers(jsonData: string): Promise<void> {
    try {
      const userData: UserData = JSON.parse(jsonData);
      if (userData.users && Array.isArray(userData.users)) {
        this.users = userData.users;
        await this.saveUsers();
      } else {
        throw new Error('Invalid user data format');
      }
    } catch (error) {
      throw new Error('Failed to import user data: ' + error);
    }
  }
}

export default UserDataManager;
