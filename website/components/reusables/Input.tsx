import { InputHTMLAttributes } from 'react';

const Input = (
    props: React.DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >
) => {
    return (
        <input
            {...props}
            className={`${props.className} shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md`}
        />
    );
};

export default Input;
