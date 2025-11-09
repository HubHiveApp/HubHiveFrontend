class Apis {
    constructor() {
        this.baseUrl = 'http://localhost:8000/api';
    }

    async sign_up(username, email, password) {
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
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error);
        }
        return result.access_token;
    }

    async login(email, password) {
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

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error);
        }
        return result.access_token;
    }

    async get_profile(token) {
        const response = await fetch(`${this.baseUrl}/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error);
        }
        return result;
    }

    async update_profile(token, changed_fields) {
        const response = await fetch(`${this.baseUrl}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changed_fields),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error);
        }
        return result;
    }

    async get_chatrooms(token, coords, radius) {
        const response = await fetch(`${this.baseUrl}/chat/rooms`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            throw new Error(result.error);
        }
        return result.chatrooms;
    }

    async join_chatroom(token, room_id) {
        const response = await fetch(`${this.baseUrl}/chat/rooms/${room_id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            throw new Error(result.error);
        }
        return result;
    }
}

// Export a singleton instance
export default new Apis();