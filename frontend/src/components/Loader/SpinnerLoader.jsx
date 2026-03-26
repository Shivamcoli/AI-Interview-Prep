
const SpinnerLoader = ({ size = "w-8 h-8", color = "border-blue-500" }) => {
    return (
        <div className="flex justify-center items-center">
            <div
                className={`animate-spin rounded-full ${size} border-4 border-gray-200 ${color} border-t-transparent`}
            ></div>
        </div>
    );
};

export default SpinnerLoader;
