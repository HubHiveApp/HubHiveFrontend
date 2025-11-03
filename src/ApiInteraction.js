export async function sign_up(username, email, password) {
    const response = await fetch('http://localhost:8000/api/auth/register', {
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
    return await result.access_token;
}