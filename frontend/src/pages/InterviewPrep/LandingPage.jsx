import { APP_FEATURES } from "../../utils/data";
import { useContext, useState } from "react";
import { Sparkle } from "@phosphor-icons/react";
import Modal from "../../components/Modal";
import Login from "../Login";
import SignUp from "../Signup";
import { UserContext } from "../../context/UserProvider";
import { useNavigate } from "react-router-dom";
import ProfileInfoCard from "../../components/Card/ProfileInfoCard";
import LandingPageImage from "../../assets/Interview-Preparation-Page.png"


const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext)
    const [openAuthModal, setOpenAuthModal] = useState(false)

    const [currentPage, setCurrentPage] = useState("login")

    const handleLoginSignUp = () => {
        setOpenAuthModal(true);
        setCurrentPage("login");
    }

    const handleCTA = () => {
        if (!user) {
            setOpenAuthModal(true);
        }
        else {
            navigate("/dashboard");
        }
    }

    const onClose = () => {
        setOpenAuthModal(false)
    }
    return (
        <div className="h-full w-full flex flex-col items-center bg-orange-100">
            <div className="py-6 px-10 md:px-20 w-full bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 min-h-full pb-56">
                <nav className="relative top-0 flex flex-col sm:flex-row gap-6 sm:gap-0 justify-between mb-20 items-center">
                    <h1 className="text-xl font-bold text-black">Interview Prep AI</h1>
                    {user ?
                        <ProfileInfoCard />
                        : <button onClick={handleLoginSignUp} className="bg-orange-400 px-4 py-2 rounded-3xl text-white cursor-pointer">Login / Signup</button>}
                </nav>
                <div className="flex flex-col xl:flex-row justify-between items-center">
                    <div className="mb-10 xl:mb-0">
                        <div className="flex gap-2 items-center bg-orange-200 px-4 py-2 w-fit rounded-3xl text-orange-700 font-bold mb-10"><Sparkle size={16} /> AI Powered</div>
                        <div className="text-[50px] font-bold leading-tight">Ace Interview with <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                            AI powered <> </>
                        </span>

                            Learning</div>
                    </div>
                    <div className="flex flex-col gap-10 items-center xl:self-end">
                        <div className="max-w-[500px] text-[17px] font-semibold">Get role specific questions, expand answers when you need them. Dive deeper into concepts and organize everything your way.
                            From preparation to mastery - ultimate toolkit is here.
                        </div>
                        <button onClick={handleCTA} className="bg-black text-white text-md font-bold px-4 py-2 rounded-3xl w-[200px] mb-4 cursor-pointer">Get Started</button>
                    </div>
                </div>
            </div>
            <div className="w-full min-h-full bg-white z-10">
                <div className="-mt-36 flex items-center justify-center bg-color">
                    <div className="p-1 bg-orange-200 rounded-lg">
                        <img src={LandingPageImage} alt="interview-prep-dashboard" className="min-h-50 min-w-50 h-[35vw] sm:w-[70vw] border-2 border-orange-300 shadow-orange-400 shadow-lg" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-12 py-20 items-center justify-center">
                <div className="font-bold text-[1.5rem]">Features that make you shine</div>
                <div className="flex flex-wrap gap-12 items-center justify-center max-w-11/12">
                    {APP_FEATURES.map((list) => {
                        return <div key={list.id} className="bg-white px-10 py-6 flex flex-col gap-6 max-w-100 border-2 border-gray-300 rounded-2xl">
                            <div className="font-bold">{list.title}</div>
                            <div>{list.description}</div>
                        </div>
                    })}
                </div>
            </div>
            <Modal onClose={onClose} open={openAuthModal} >
                {
                    (
                        currentPage === "login" ?
                            <Login setCurrentPage={setCurrentPage} />
                            :
                            <SignUp setCurrentPage={setCurrentPage} />
                    )
                }
            </Modal>
        </div>
    );
}

export default LandingPage;