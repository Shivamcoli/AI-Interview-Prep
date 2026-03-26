import { useContext } from "react";
import { UserContext } from "../../context/UserProvider";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
    const { user } = useContext(UserContext);


    return <div>
        <Navbar />
        {user && <div className="sm:px-8 lg:px-16 py-8">
            {children}
        </div>

        }
    </div>
}

export default DashboardLayout;