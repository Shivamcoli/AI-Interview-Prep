function normalizeBaseUrl(url) {
    if (!url) return "";
    return url.endsWith("/") ? url : `${url}/`;
}

export const BASE_URL = normalizeBaseUrl(
    import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8000"
);


export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile"
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },

    AI: {
        GENERATE_QUESTIONS: "/api/ai/generate-questions",
        GENERATE_EXPLANATION: "/api/ai/generate-explanation",
    },

    SESSION: {
        CREATE_SESSION: "/api/sessions/create",
        GET_ALL: "/api/sessions/my-sessions",
        GET_ONE: (id) => `/api/sessions/${id}`,
        DELETE: (id) => `/api/sessions/${id}`,
    },
    QUESTION: {
        ADD_QUESTION: "/api/questions/add",
        PIN: (id) => `/api/questions/${id}/pin`,
        ADD_NOTE: (id) => `/api/questions/${id}/note`
    }
}