import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import { FC, ReactNode } from 'react';
import Button, { ButtonVariant } from './Button';

export interface AlertProps {
    heading?: string;
    body: ReactNode;
    variant?: 'success' | 'error';
    positiveAction?: () => void;
    positiveText?: string;
    negativeAction?: () => void;
    negativeText?: string;
}

export const Alert: FC<AlertProps> = ({
    heading,
    variant = 'success',
    body,
    ...props
}) => {
    return (
        <div
            className={`min-w-full p-4 rounded-md ${
                variant === 'success' ? 'bg-green-50' : 'bg-red-50'
            } `}
        >
            <div className='flex items-center min-w-full'>
                {variant == 'success' ? (
                    <CheckCircleIcon
                        className={`w-5 h-5 text-green-400`}
                        aria-hidden='true'
                    />
                ) : (
                    <XCircleIcon className='w-5 h-5 text-red-400' />
                )}
                <div className='ml-3'>
                    {heading ? (
                        <h3
                            className={`mb-2 font-bold text-sm  ${
                                variant === 'success'
                                    ? 'text-green-800'
                                    : 'text-red-800'
                            }`}
                        >
                            {heading}
                        </h3>
                    ) : null}
                    <div
                        className={`text-sm  text-justify ${
                            variant === 'success'
                                ? 'text-green-700'
                                : 'text-red-700'
                        }`}
                    >
                        {body}
                    </div>
                    {props.positiveAction || props.negativeAction ? (
                        <>
                            <div className='mt-4'>
                                {props.negativeAction ? (
                                    <Button
                                        variant={ButtonVariant.secondary}
                                        onClick={props.negativeAction}
                                    >
                                        {props.negativeText ?? 'No'}
                                    </Button>
                                ) : null}
                                {props.positiveAction ? (
                                    <Button
                                        variant={
                                            variant === 'success'
                                                ? ButtonVariant.primary
                                                : ButtonVariant.danger
                                        }
                                        onClick={props.positiveAction}
                                    >
                                        {props.positiveText ?? 'Okay'}
                                    </Button>
                                ) : null}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export const AlertDialog: FC<
    AlertProps & { isOpen: boolean; onClose: () => void }
> = ({ isOpen, onClose, positiveAction, negativeAction, ...alertProps }) => {
    const effectivePositiveAction = positiveAction
        ? () => {
              onClose();
              positiveAction();
          }
        : undefined;
    const effectiveNegativeAction = negativeAction
        ? () => {
              onClose();
              negativeAction();
          }
        : undefined;

    return isOpen ? (
        <div
            className='fixed inset-0 flex w-screen h-screen'
            onClick={(e) => {
                e.stopPropagation();
                if (e.currentTarget === e.target) {
                    onClose();
                }
            }}
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
            <div className='m-auto mt-48 w-96'>
                <Alert
                    {...alertProps}
                    positiveAction={effectivePositiveAction}
                    negativeAction={effectiveNegativeAction}
                />
            </div>
        </div>
    ) : null;
};
