import { useContext } from "react";
import { UserContext } from "../../context/UserProvider";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/");
    }

    return (
        <div className="flex gap-4 items-center">
            <img src={user?.profileImageUrl} className="h-12 w-12 rounded-4xl" />
            <div className="flex flex-col gap-1">
                <span className="text-gray-700">{user?.name}</span>
                <span className="text-sm text-primary font-medium cursor-pointer" onClick={handleLogout}>Logout</span>
            </div>
        </div>
    );
}

export default ProfileInfoCard;