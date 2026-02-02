// app/lib/cloudflare/client.ts
// This replaces firebaseClient.ts

// Cloudflare Client SDK - For browser use only
export class CloudflareClient {
  private static instance: CloudflareClient;
  private token: string | null = null;
  private user: any = null;

  private constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('cf_token');
      const userData = localStorage.getItem('cf_user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
  }

  static getInstance(): CloudflareClient {
    if (!CloudflareClient.instance) {
      CloudflareClient.instance = new CloudflareClient();
    }
    return CloudflareClient.instance;
  }

  // ========== AUTHENTICATION ==========

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        this.token = data.token;
        this.user = data.user;
        
        // Store in localStorage
        localStorage.setItem('cf_token', data.token);
        localStorage.setItem('cf_user', JSON.stringify(data.user));
        
        return { user: data.user };
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async createUserWithEmailAndPassword(email: string, password: string, displayName?: string) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName })
      });

      const data = await response.json();

      if (data.success) {
        this.token = data.token;
        this.user = data.user;
        
        // Store in localStorage
        localStorage.setItem('cf_token', data.token);
        localStorage.setItem('cf_user', JSON.stringify(data.user));
        
        return { user: data.user };
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      if (this.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      this.user = null;
      localStorage.removeItem('cf_token');
      localStorage.removeItem('cf_user');
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  }

  // ========== USER STATE ==========

  getCurrentUser() {
    return this.user;
  }

  getAuthToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // ========== DATABASE (KV Simulation) ==========

  async getFromKV(key: string): Promise<any> {
    try {
      const response = await fetch(`/api/kv/${encodeURIComponent(key)}`, {
        headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {}
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('KV get error:', error);
      return null;
    }
  }

  async setInKV(key: string, value: any): Promise<boolean> {
    try {
      const response = await fetch(`/api/kv/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
        },
        body: JSON.stringify({ value })
      });
      
      return response.ok;
    } catch (error) {
      console.error('KV set error:', error);
      return false;
    }
  }

  // ========== REAL-TIME (WebSocket Simulation) ==========

  subscribeToPrice(symbol: string, callback: (price: number) => void) {
    // In a real implementation, you'd use WebSockets
    // For now, we'll simulate with polling
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/live-prices/${symbol}`);
        if (response.ok) {
          const data = await response.json();
          callback(data.price);
        }
      } catch (error) {
        console.error('Price fetch error:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }
}

// Singleton instance for easy import
export const cfClient = CloudflareClient.getInstance();