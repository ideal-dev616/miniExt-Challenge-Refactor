import { ButtonHTMLAttributes } from 'react';

export enum ButtonVariant {
    primary = 'primary',
    danger = 'danger',
    secondary = 'secondary',
    dangerOutline = 'danger-outline',
}

const getClassesForButtonVariant = (buttonVariant: ButtonVariant) => {
    switch (buttonVariant) {
        case ButtonVariant.danger:
            return `justify-center inline-flex items-center px-2.5 py-1.5 bg-red-500 shadow-sm text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 hover:text-white border  p-2 rounded`;
        case ButtonVariant.primary:
            return `justify-center inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`;
        case ButtonVariant.secondary:
            return 'inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
        case ButtonVariant.dangerOutline:
            return 'justify-center inline-flex items-center px-2.5 py-1.5 border-red-600 shadow-sm text-xs font-medium text-red-600 bg-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:text-white border p-2 rounded';
    }
};

const Button = ({
    children,
    onClick,
    btnClasses,
    variant,
    type,
    disabled,
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`${getClassesForButtonVariant(
                variant ?? ButtonVariant.primary
            )} ${btnClasses ?? ''} ${
                disabled ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export interface ButtonProps
    extends React.DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    btnClasses?: string;
    variant?: ButtonVariant;
}

Button.defaultProps = {
    variant: ButtonVariant.primary,
    type: 'button',
};

export default Button;
