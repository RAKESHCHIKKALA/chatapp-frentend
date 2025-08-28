import axios from "axios";

export const getloguser = async () => {
    try {
        const response = await axios.get("http://localhost:5409/users/loguser", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data; // Return the actual response data, not the full axios response
    } catch (error) {
        console.error("Error in getloguser:", error);
        // Return a proper error object instead of undefined
        return {
            ok: false,
            error: error.response?.data?.error || error.message || "Failed to get user data"
        };
    }
};
