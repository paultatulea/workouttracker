const API_URL = 'http://localhost:5000/api/v1';

export async function createUser(email, password) {
    const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    if (!res.ok) {
        // handle errors
        console.log('Something bad happened')
    }
    return res.json();
}

export async function authenticateUser(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    if (!res.ok) {
        // handle errors
        console.log('Could not authenticate user')
    }
    return res.json();
}

export async function validateAuthToken(token) {
    const res = await fetch(`${API_URL}/validateAuthToken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    })
    if (!res.ok) {
        // handle errors
        console.log('Could not validate token');
    }
    return res.json();
}
