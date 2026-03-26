const Modal = ({ children, ...props }) => {
    const { onClose, open } = props;

    if (!open) return null;

    return (
        <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-lg p-6 shadow-lg relative min-w-80 w-[40vw] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer m-2"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
