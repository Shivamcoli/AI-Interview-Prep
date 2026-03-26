import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";


// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) return;

        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            }
            catch (error) {
                setUser(null);
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateUser = (userData) => {
        localStorage.setItem("token", userData.token);
        setUser((prev) => {
            return {
                ...prev,
                ...userData
            }
        })
    };

    const clearUser = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <UserContext.Provider
            value={{ user, loading, updateUser, clearUser }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;