const SkeletonLoader = () => {
    return (
        <div
            role="status"
            className="animate-pulse space-y-4 max-w-3xl w-full mx-auto"
        >
            {/* Top Section */}
            <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-400 w-1/2"></div>

            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-400 w-full"></div>
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-400 w-11/12"></div>
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-400 w-10/12"></div>
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-400 w-9/12"></div>
            </div>

            {/* Card Section */}
            <div className="bg-gray-100 dark:bg-gray-400 rounded p-4 space-y-2">
                <div className="h-2.5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-2.5 bg-gray-300 rounded w-2/3"></div>
                <div className="h-2.5 bg-gray-300 rounded w-1/2"></div>
            </div>

            {/* Bottom Section */}
            <div
                role="status"
                className="animate-pulse space-y-4 max-w-3xl mt-10 w-full"
            >
                <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-400 w-1/2"></div>

                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded dark:bg-gray-400 w-full"></div>
                    <div className="h-3 bg-gray-200 rounded dark:bg-gray-400 w-11/12"></div>
                    <div className="h-3 bg-gray-200 rounded dark:bg-gray-400 w-10/12"></div>
                    <div className="h-3 bg-gray-200 rounded dark:bg-gray-400 w-9/12"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
