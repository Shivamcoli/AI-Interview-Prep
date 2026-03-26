const RoleInfoHeader = ({
    role,
    topicsToFocus,
    experience,
    questions,
    description,
    lastUpdated,
}) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="font-bold text-3xl">{role}</div>
            <div className="text-md mb-4">{topicsToFocus}</div>
            <div className="flex gap-2 items-center">
                <div className="bg-black text-white px-2 py-1 text-xs rounded-2xl">Experience: {experience} years</div>
                <div className="bg-black text-white px-2 py-1 text-xs rounded-2xl">{questions} Q&A</div>
                <div className="bg-black text-white px-2 py-1 text-xs rounded-2xl">Last Updated: {lastUpdated}</div>
            </div>
        </div>
    )
}

export default RoleInfoHeader;

