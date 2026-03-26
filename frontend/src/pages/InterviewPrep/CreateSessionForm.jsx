import { useState } from "react";
import Input from "../../components/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { useNavigate } from "react-router-dom";

const CreateSessionForm = () => {
    const [formData, setFormData] = useState({ role: "", experience: "", topicsToFocus: "", description: "" });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { role, topicsToFocus, experience } = formData;

        if (!role || !topicsToFocus || !experience) {
            setError("Fill out the mandatory fields to create a session");
            return;
        }

        setLoading(true);

        try {
            const questionsResult = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
                role,
                experience,
                topicsToFocus,
                numberOfQuestions: 10,
            });

            const aiQuestions = questionsResult.data.data;

            const response = await axiosInstance.post(API_PATHS.SESSION.CREATE_SESSION, {
                ...formData,
                questions: aiQuestions,
            });

            if (response.data?.session._id) {
                navigate(`/interview-prep/${response.data?.session._id}`)
            }
        }
        catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError("Something went wrong");
            }
        }
        finally {
            setLoading(false)
        }
    }

    return <div>
        <h3 className="font-bold text-xl mb-2">Start a new Interview Journey</h3>
        <span className="text-[14px]">Fill out the form details and unlock you personal set of interview questions.</span>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-md mt-10">
            <Input
                value={formData.role}
                placeholder="(e.g., Frontend Developer, UI/UX Developer etc.)"
                name="role"
                handleInputChange={handleChange}
                label="Target Role"
                required
            />
            <Input
                value={formData.experience}
                placeholder="(e.g., 1 year, 3 years, 5+ years etc.)"
                name="experience"
                handleInputChange={handleChange}
                label="Years of Experience"
                required
            />
            <Input
                value={formData.topicsToFocus}
                placeholder="(e.g., React, Node.js, MongoDB etc.)"
                name="topicsToFocus"
                handleInputChange={handleChange}
                label="Topics to Focus on"
                required
            />
            <Input
                value={formData.description}
                placeholder="(Any specific goals or notes for this session.)"
                name="description"
                handleInputChange={handleChange}
                label="Description"
            />
            {error && <div className="text-red-600">{`*`}{error}</div>}
            <button type="submit" className="self-center bg-black text-white w-full py-3 rounded-md mt-10 hover:bg-orange-200 hover:text-black">
                {loading ? <SpinnerLoader /> : "Create Session"}
            </button>
        </form>
    </div>
}

export default CreateSessionForm;