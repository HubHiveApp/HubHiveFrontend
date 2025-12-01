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

    async get_chatrooms(token, lat_coord, lng_coord, max_distance) {
        let url = new URL(`${this.apiBaseUrl}/chat/rooms`);
        url.searchParams.append("lat", lat_coord);
        url.searchParams.append("lng", lng_coord);
        url.searchParams.append("max_distance", max_distance);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();
        // console.log(result);

        if (!response.ok) {
            throw new Error(result.error);
        }
        return result.chatrooms;
    }

    async join_chatroom(token, room_id) {
        const response = await fetch(`${this.apiBaseUrl}/chat/rooms/${room_id}/join`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();
        // console.log(result);

        if (!response.ok) {
            throw new Error(result.error);
        }
        return result;
    }

    async get_chatroom(token, room_id) {
        const response = await fetch(`${this.apiBaseUrl}/chat/rooms/${room_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        return result;
    }

    async get_messages_in_chatroom(token, room_id, offset) {
        let url = new URL(`${this.apiBaseUrl}/chat/rooms/${room_id}/messages`);
        url.searchParams.append('offset', offset);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();

        if (!response.ok) {
            console.log(result.error);
            throw new Error(result.error);
        }

        return result;
    }
}

// Export a singleton instance
export default new Apis();