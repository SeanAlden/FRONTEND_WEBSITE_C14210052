// utils/apiClient.js

// const BASE_URL = 'http://127.0.0.1:8000'; // Ganti sesuai backendmu
const BASE_URL = 'https://275f-139-195-169-182.ngrok-free.app'; // Ganti sesuai backendmu

export const initSanctum = async () => {
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
    });
};

export const apiFetch = async (endpoint, method = 'GET', data = null) => {
    await initSanctum();

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const res = await fetch(`${BASE_URL}/api/${endpoint}`, options);

    // Optional: cek jika respons bukan JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Bukan respons JSON:\n${text}`);
    }

    return await res.json();
};

export const login = async (email, password) => {
    await initSanctum();

    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });

    const data = await res.json();
    return data;
};

