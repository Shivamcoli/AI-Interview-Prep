import { useEffect, useRef, useState } from "react";
import { PushPinSimpleSlash, PushPinSimple, CaretUp, CaretDown, Sparkle } from "@phosphor-icons/react";
import AIResponsePreview from "../../pages/InterviewPrep/components/AIResponsePreview";

const QuestionCard = ({
    question,
    answer,
    onLearnMore,
    isPinned,
    onTogglePin
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [height, setHeight] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isExpanded) {
            const contentHeight = contentRef.current.scrollHeight;
            setHeight(contentHeight + 10);
        }
        else {
            setHeight(0);
        }
    }, [isExpanded]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <>
            <div className="bg-white overflow-hidden mb-4 py-4 px-5 shadow-xl shadow-gray-100/70 border border-gray-100/60 group transition-all duration-300">
                <div className="flex items-start justify-between cursor-pointer">
                    <div className="flex items-start gap-3.5">
                        <span className="text-xs md:text-[15px] font-semibold text-gray-400">
                            Q
                        </span>
                        <h3
                            className="text-xs md:text-[14px] font-medium text-gray-800 mr-0 md:mr-20"
                        >
                            {question}
                        </h3>
                    </div>

                    <div className="flex items-center justify-end ml-4 relative h-8">
                        <div
                            className={`flex ${isExpanded ? "md:flex" : "md:hidden group-hover:flex"}`}>
                            <button className="flex items-center gap-2 text-xs text-indigo-800 font-medium bg-indigo-50 px-3 py-1 mr-2 rounded text-nowrap border border-indigo-50 hover:border-indigo-200 cursor-pointer"
                                onClick={onTogglePin}>
                                {isPinned ? <PushPinSimpleSlash size={16} /> : <PushPinSimple size={16} />}
                            </button>
                            <button
                                className="flex items-center gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-3 py-1 mr-2 rounded text-nowrap border border-cyan-50 hover:border-cyan-200 cursor-pointer"
                                onClick={() => {
                                    setIsExpanded(true);
                                    onLearnMore();
                                }}>
                                <Sparkle size={16} />
                                <span className="hidden md:block">Learn More</span>
                            </button>
                        </div>
                        <button
                            className="text-gray-400 hover:text-gray-500 cursor-pointer"
                            onClick={toggleExpand}>
                            {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
                        </button>
                    </div>
                </div>
                <div className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ height: `${height}px` }}>
                    <div
                        ref={contentRef}
                        className="mt-4 text-gray-700 bg-gray-50 px-5 py-3 rounded-lg">
                        <AIResponsePreview content={answer} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionCard;