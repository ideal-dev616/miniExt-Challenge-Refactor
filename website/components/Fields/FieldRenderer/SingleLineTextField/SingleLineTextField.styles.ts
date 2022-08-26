import clsx from 'clsx';

const classes = {
    container: 'relative shadow-sm',
    input: () =>
        clsx(
            'focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md transition-colors duration-100'
        ),
    remainingCharacters: (reachedLimit: boolean) =>
        clsx(
            'absolute inset-y-0 right-0 pr-3 flex items-center select-none text-xs text-gray-500',
            reachedLimit && 'text-red-500'
        ),
};

export default classes;
