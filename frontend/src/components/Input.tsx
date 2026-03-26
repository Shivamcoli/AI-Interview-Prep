const Input = (props) => {
    const {placeholder, name, value, handleInputChange, label} = props;

    return (
        <div className="flex flex-col gap-4">
            <label>{label}{`  `}{props.required && <span className="text-red-500">*</span>}</label>
            <input type="input" placeholder={placeholder} name={name} value={value} onChange={(e) => handleInputChange(e)}
                className="border-2 border-gray-500 p-2" />
        </div>
    );
}

export default Input;