interface SignUpResponse {
  access_token: string;
}

interface LoginResponse {
  access_token: string;
}

interface User {
  username: string;
  email: string;
  name?: string;
  bio?: string;
}

interface ProfileResponse {
  user: User;
}

interface UpdateProfileFields {
  username?: string;
  email?: string;
  name?: string;
  bio?: string;
}

class Apis {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8000/api';
  }

  async sign_up(username: string, email: string, password: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'email': email,
        'username': username,
        'password': password,
      }),
    });
    const result: SignUpResponse = await response.json();
    if (!response.ok) {
      throw new Error((result as any).error);
    }
    return result.access_token;
  }

  async login(email: string, password: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'email': email,
        'password': password,
      }),
    });

    const result: LoginResponse = await response.json();
    if (!response.ok) {
      throw new Error((result as any).error);
    }
    return result.access_token;
  }

  async get_profile(token: string): Promise<ProfileResponse> {
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result: ProfileResponse = await response.json();
    if (!response.ok) {
      throw new Error((result as any).error);
    }
    return result;
  }

  async update_profile(token: string, changed_fields: UpdateProfileFields): Promise<ProfileResponse> {
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changed_fields),
    });

    const result: ProfileResponse = await response.json();
    if (!response.ok) {
      throw new Error((result as any).error);
    }
    return result;
  }
}

// Export a singleton instance
export default new Apis();
