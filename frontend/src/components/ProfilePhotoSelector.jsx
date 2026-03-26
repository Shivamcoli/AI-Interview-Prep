import { useState } from "react";
import { CloudArrowUp, User, Trash } from "@phosphor-icons/react";
const ProfilePhotoSelector = ({
    setImage
}) => {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
    }

    return (
        <div className="flex flex-col items-center gap-2 justify-center">
            {!preview ?
                <>
                    <label className="text-sm font-medium bg-orange-100 flex gap-2 px-6 py-6 rounded-full cursor-pointer">
                        <div className="relative">
                            <User size={48} weight="thin" className="text-primary" />
                            <div>
                                <CloudArrowUp size={32} weight="thin" className="absolute top-12 left-10 bg-primary rounded-full p-2" />
                            </div>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute opacity-0" />
                    </label>
                </> :

                <div className="relative">
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover border mt-2"
                    />
                    <Trash size={32} weight="thin" className="absolute top-18 left-15 bg-red-600 text-white rounded-full p-2"
                        onClick={handleRemoveImage} />
                </div>
            }
        </div>
    );
};

export default ProfilePhotoSelector;