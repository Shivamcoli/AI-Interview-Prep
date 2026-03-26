import { Trash } from "@phosphor-icons/react";
import { getInitials } from "../../helper";

const SummaryCard = ({
    role,
    colors,
    topicsToFocus,
    experience,
    questions,
    description,
    lastUpdated,
    onSelect,
    onDelete
}) => {
    return (
        <div
            className="p-4 border border-gray-400 w-fit rounded-2xl flex flex-col gap-6 text-gray-800 m-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-orange-400 hover:bg-gradient-to-br hover:from-orange-50 hover:to-white cursor-pointer group"
            onClick={onSelect}
        >
            <div
                className="relative flex gap-10 px-4 py-2 items-center group-hover:shadow-lg transition-all duration-300"
                style={{ background: colors.bgcolor }}
            >
                <span className="bg-white w-10 h-10 flex items-center justify-center text-black font-bold text-xs rounded-xl transition-transform duration-300 group-hover:scale-110">
                    {getInitials(role)}
                </span>
                <div>
                    <span className="font-bold group-hover:text-orange-600 transition-colors duration-300">{role}</span>
                    <div className="text-xs">{topicsToFocus}</div>
                </div>
                <div
                    className="bg-red-200 px-3 py-1 absolute top-0 right-0 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-400 hover:text-white cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering onSelect
                        onDelete();
                    }}
                >
                    <Trash size={16} />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3 justify-center">
                    <div className="px-2 py-1 text-xs text-gray-600 border border-gray-400 rounded-3xl group-hover:bg-orange-100 transition-colors duration-300 flex items-center">
                        Experience: {experience} {experience === 1 ? "Year" : "Years"}
                    </div>
                    <div className="px-2 py-1 text-xs text-gray-600 border border-gray-400 rounded-3xl group-hover:bg-orange-100 transition-colors duration-300 flex items-center">
                        {questions.length} Q&A
                    </div>
                    <div className="px-2 py-1 text-xs text-gray-600 border border-gray-400 rounded-3xl group-hover:bg-orange-100 transition-colors duration-300 flex items-center sm:max-w-none truncate sm:whitespace-normal">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
                <div className="text-xs">
                    {description}
                </div>
            </div>

        </div>
    )
}

export default SummaryCard;