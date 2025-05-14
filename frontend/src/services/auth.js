const API_URL = "http://127.0.0.1:8000/api";

export const getToken = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        if (!response.ok) {
            throw new Error("Ошибка авторизации");
        }

        const data = await response.json();
        return data.access;
    } catch (error) {
        console.error("Ошибка при получении токена:", error);
        throw error;
    }
};
