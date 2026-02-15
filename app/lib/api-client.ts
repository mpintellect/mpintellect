// lib/api-client.ts
const API_BASE = process.env.NODE_ENV === 'development' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8789')
  : '';

class APIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE;
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export const api = new APIClient();