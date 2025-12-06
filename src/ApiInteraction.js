import { io } from "socket.io-client";

class Apis {
    constructor() {
        this.baseUrl = 'http://localhost:8000';
        this.apiBaseUrl = `${this.baseUrl}/api`
        this._token = null;
        this._initSocket();
    }

    _initSocket() {
        const self = this;
        
        this._socket = io(this.baseUrl, {
            transports: ["websocket"],
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            auth: {
                get token() {
                    return self._token;
                }
            }
        });

        // Global listeners
        this._socket.on("connect", () => {
            console.log("Socket connected:", this._socket.id);
        });

        this._socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        this._socket.on("error", (payload) => {
            console.error("Socket error:", payload?.error || payload);
        });

        // Create socket namespace for dot notation access
        this.socket = {
            // Core socket instance access
            get instance() {
                return self._socket;
            },

            // Connection management
            setToken: (jwt) => {
                self._token = jwt;
                if (self._socket.connected) {
                    self._socket.disconnect();
                }
                self._socket.connect();
            },

            connect: () => self._socket.connect(),
            disconnect: () => self._socket.disconnect(),

            // Room management
            join: (chatroomId) => {
                self._socket.emit("join_room", {
                    chatroom_id: chatroomId,
                    token: self._token
                });
            },

            leave: (chatroomId) => {
                self._socket.emit("leave_room", {
                    chatroom_id: chatroomId,
                    token: self._token
                });
            },

            // Message operations
            send: ({ chatroomId, content, messageType = "text", mediaUrl = null }) => {
                self._socket.emit("send_message", {
                    chatroom_id: chatroomId,
                    content,
                    message_type: messageType,
                    media_url: mediaUrl,
                    token: self._token
                });
            },

            // Event listeners
            on: (event, handler) => self._socket.on(event, handler),
            off: (event, handler) => self._socket.off(event, handler),
            once: (event, handler) => self._socket.once(event, handler),

            // Convenience listener helpers
            onNewMessage: (handler) => self._socket.on("new_message", handler),
            offNewMessage: (handler) => self._socket.off("new_message", handler)
        };
    }

    async sign_up(username, email, password) {
        const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
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
        const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
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
        const response = await fetch(`${this.apiBaseUrl}/auth/profile`, {
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
        const response = await fetch(`${this.apiBaseUrl}/auth/profile`, {
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

    async upload_profile_picture(token, imageUri) {
        const formData = new FormData();
    
        const uriParts = imageUri.split('/');
        const filename = uriParts[uriParts.length - 1] || 'avatar.jpg';
    
        formData.append('file', {
            // @ts-ignore (if you’re using TS, this silences RN FormData typing)
            uri: imageUri,
            name: filename,
            type: 'image/jpeg', // backend accepts jpeg/png/webp; jpeg is a safe default
        });
    
        const response = await fetch(`${this.baseUrl}/auth/profile/picture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // DO NOT set Content-Type here; fetch will handle multipart boundary
            },
            body: formData,
        });
    
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to upload profile picture');
        }
        return result; // backend returns { message, user }
    }
    
}

// Export a singleton instance
export default new Apis();