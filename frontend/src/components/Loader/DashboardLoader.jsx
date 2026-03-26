export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Cards grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl bg-white shadow-sm"
                            aria-hidden
                        >
                            <div className="space-y-4">
                                <div className="h-40 w-full rounded-xl bg-gray-200 animate-pulse" />
                                <div className="h-5 w-3/4 bg-gray-200  rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
