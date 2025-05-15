const API_URL = "http://127.0.0.1:8000/api";

export const getToken = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Ошибка от сервера:", errorData);
            throw new Error(errorData.error || errorData.detail || "Ошибка авторизации");
        }

        const data = await response.json();
        return {
            access: data.access,
            refresh: data.refresh,
          };
    } catch (error) {
        throw error; 
    }
};
