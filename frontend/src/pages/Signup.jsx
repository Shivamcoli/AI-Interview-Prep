import { useContext, useState } from "react";
import Input from "../components/Input";
import { UserContext } from "../context/UserProvider";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import SpinnerLoader from "../components/Loader/SpinnerLoader";

const SignUp = (props) => {

    const { setCurrentPage } = props;

    const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
    const [formErrors, setFormErrors] = useState({});
    const { updateUser } = useContext(UserContext);
    const [dataLoading, setDataLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setSignupData((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const uploadImage = async (profilePhoto) => {
        try {
            if (!profilePhoto) {
                throw new Error("No file selected");
            }

            const formData = new FormData();
            formData.append("image", profilePhoto); // 'image' should match the multer field name

            const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            console.error("Image upload failed:", error);
            throw error;
        }
    }

    const formDataValidation = (data) => {
        const { name, email, password } = data;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const errors = {};

        //name check
        if (name.length === 0) {
            errors.name = "Name is required";
        }

        //email check
        if (!emailRegex.test(email)) {
            errors.email = "Enter a valid email address";
        }

        //password check
        if (password.length < 8) {
            errors.password = "Password must be at least 8 characters long.";
        } else if (!/[A-Z]/.test(password)) {
            errors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[a-z]/.test(password)) {
            errors.password = "Password must contain at least one lowercase letter.";
        } else if (!/[0-9]/.test(password)) {
            errors.password = "Password must contain at least one number.";
        }
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.password = "Password must contain at least one special character.";
        }
        else if (/\s/.test(password)) {
            errors.password = "Password must not contain spaces.";
        }

        setFormErrors(errors);

        if (Object.keys(formErrors).length === 0) return true;
        else return false;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formDataValidation(signupData)) {
            setDataLoading(true);
            try {
                let profileImageUrl;
                if (profilePhoto) {
                    const imageUploadRes = await uploadImage(profilePhoto);
                    profileImageUrl = imageUploadRes.imageUrl || "";
                }

                const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                    name: signupData.name,
                    email: signupData.email,
                    password: signupData.password,
                    profileImageUrl
                });

                const { token } = response.data;

                if (token) {
                    localStorage.setItem("token", token);
                    updateUser(response.data);
                    navigate('/dashboard');
                }
            }
            catch (error) {
                if (error.response && error.response.data.message) {
                    console.log(error.response.data.message);
                }
                else {
                    console.log('Something went wrong. Please try again.')
                }
            }
            finally {
                setDataLoading(false)
            }
        }
    }

    const handleRedirect = () => {
        setCurrentPage("login")
    }

    return (
        <div className="flex flex-col lg:px-12 max-h-screen">
            <header className="mb-8">
                <h2 className="font-bold text-2xl">Welcome</h2>
                <span className="text-xs">Please enter your details</span>
            </header>
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex flex-col gap-6 w-full mb-10">
                    <ProfilePhotoSelector setImage={setProfilePhoto} />
                    <div>
                        <Input
                            value={signupData.name}
                            placeholder="John Darwin"
                            name="name"
                            handleInputChange={handleInputChange}
                            label="Full Name"
                        />
                        {formErrors.name &&
                            <span className="text-xs text-red-600">{formErrors.name}</span>}
                    </div>
                    <div>
                        <Input
                            value={signupData.email}
                            placeholder="john@example.com"
                            name="email"
                            handleInputChange={handleInputChange}
                            label="Email"
                        />
                        {formErrors.email &&
                            <span className="text-xs text-red-600">{formErrors.email}</span>}
                    </div>
                    <div>
                        <Input
                            value={signupData.password}
                            placeholder="Minimum 8 characters"
                            name="password"
                            handleInputChange={handleInputChange}
                            label="Password"
                        />
                        {formErrors.password &&
                            <span className="text-xs text-red-600">{formErrors.password}</span>}
                    </div>

                </div>
                <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md w-full">
                    {dataLoading ? <SpinnerLoader /> : "Sign Up"}
                </button>
            </form >
            <div className="text-xs">Do not have an account ? <span className="cursor-pointer underline font-bold text-primary" onClick={handleRedirect}>Login</span></div>
        </div >
    );
}

export default SignUp;