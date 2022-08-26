import clsx from 'clsx';

/**
 * A simple spinner.
 */
const Spinner = (props: { light?: boolean }) => (
    <svg
        className={classes.container(props.light)}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
    >
        <circle
            className={classes.circle}
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
        />
        <path
            className={classes.path}
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
    </svg>
);

const classes = {
    container: (light?: boolean) =>
        clsx('w-5 h-5 animate-spin', light ? 'text-white' : 'text-gray-500'),
    circle: 'opacity-25',
    path: 'opacity-75',
};

export default Spinner;
