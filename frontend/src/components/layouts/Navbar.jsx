import ProfileInfoCard from "../Card/ProfileInfoCard";

const Navbar = () => {
    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-gray-200/100">
            <h1 className="font-semibold text-xl text-gray-800">Interview Preparation</h1>
            <ProfileInfoCard />
        </div>
    )
}

export default Navbar;