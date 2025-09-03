import * as SecureStore from 'expo-secure-store';
import { AuthResult, LoginCredentials, User } from '../types/auth';

const STORAGE_KEY = 'user_credentials';
const USER_KEY = 'user_data';

// Mock user database for demonstration
const mockUsers: { [key: string]: { password: string; user: User } } = {
  'admin': {
    password: 'password123',
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@example.com'
    }
  },
  'user1': {
    password: '123456',
    user: {
      id: '2',
      username: 'user1',
      email: 'user1@example.com'
    }
  },
  'demo': {
    password: 'demo',
    user: {
      id: '3',
      username: 'demo',
      email: 'demo@example.com'
    }
  }
};

export class AuthService {
  /**
   * Validates user credentials against mock database
   */
  static async validateCredentials(username: string, password: string): Promise<AuthResult> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userRecord = mockUsers[username.toLowerCase()];
      
      if (!userRecord) {
        return {
          success: false,
          error: 'Username not found'
        };
      }

      if (userRecord.password !== password) {
        return {
          success: false,
          error: 'Invalid password'
        };
      }

      return {
        success: true,
        user: userRecord.user
      };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed. Please try again.'
      };
    }
  }

  /**
   * Stores user credentials securely
   */
  static async storeCredentials(credentials: LoginCredentials, user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(credentials));
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store credentials:', error);
      throw new Error('Failed to save credentials');
    }
  }

  /**
   * Retrieves stored user credentials
   */
  static async getStoredCredentials(): Promise<{ credentials: LoginCredentials; user: User } | null> {
    try {
      const credentialsString = await SecureStore.getItemAsync(STORAGE_KEY);
      const userString = await SecureStore.getItemAsync(USER_KEY);

      if (!credentialsString || !userString) {
        return null;
      }

      const credentials: LoginCredentials = JSON.parse(credentialsString);
      const user: User = JSON.parse(userString);

      return { credentials, user };
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return null;
    }
  }

  /**
   * Clears stored credentials
   */
  static async clearStoredCredentials(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Failed to clear credentials:', error);
      // Don't throw error as this might be called during logout
    }
  }

  /**
   * Checks if user is authenticated by validating stored credentials
   */
  static async isAuthenticated(): Promise<{ isAuthenticated: boolean; user?: User }> {
    try {
      const stored = await this.getStoredCredentials();
      
      if (!stored) {
        return { isAuthenticated: false };
      }

      // Validate stored credentials are still valid
      const result = await this.validateCredentials(stored.credentials.username, stored.credentials.password);
      
      if (result.success) {
        return { isAuthenticated: true, user: stored.user };
      } else {
        // Clear invalid credentials
        await this.clearStoredCredentials();
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Performs complete login process
   */
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    const result = await this.validateCredentials(credentials.username, credentials.password);
    
    if (result.success && result.user) {
      await this.storeCredentials(credentials, result.user);
    }
    
    return result;
  }

  /**
   * Performs logout by clearing stored credentials
   */
  static async logout(): Promise<void> {
    await this.clearStoredCredentials();
  }
}