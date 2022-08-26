import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { useCallableModalIsShown } from './modalSelectors';

type Props = {
    title: ReactNode | string | null;
    children: React.ReactNode;
    dismiss: () => void;
    removePadding?: boolean;
    hideDismissButton?: boolean;
    initialFocus?: React.RefObject<HTMLElement>;
    isCallableModal?: boolean;
    fullscreen?: boolean;
};

const Modal = (props: Props) => {
    const callableModalIsShown = useCallableModalIsShown();

    const dismiss =
        !props.isCallableModal && callableModalIsShown
            ? () => {}
            : props.dismiss;

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog
                as='div'
                className='fixed inset-0 z-10 h-1 min-h-screen px-6 py-6 overflow-y-auto'
                onClose={dismiss}
            >
                <div
                    className={clsx(
                        'flex items-center justify-center text-center sm:p-0 min-h-full',
                        !props.removePadding && 'px-4 pt-4',
                        props.fullscreen && 'h-1'
                    )}
                >
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <Dialog.Overlay className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75' />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                        enterTo='opacity-100 translate-y-0 sm:scale-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                        leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                    >
                        <div
                            className={clsx(
                                'flex flex-col text-left transition-all transform bg-white rounded-lg shadow-xl overflow-hidden',
                                !props.removePadding && 'pt-5 pb-4',
                                props.fullscreen ? 'h-full w-full' : 'w-[500px]'
                            )}
                        >
                            <div
                                className={clsx(
                                    'flex items-center',
                                    props.title && 'border-b pb-4'
                                )}
                            >
                                {props.title ? (
                                    <Dialog.Title as='h3' className='leading-6'>
                                        <div className='px-4 text-xl text-gray-900'>
                                            {props.title}
                                        </div>
                                    </Dialog.Title>
                                ) : null}

                                {!props.hideDismissButton ? (
                                    <div
                                        className={
                                            props.title
                                                ? 'flex items-center justify-center ml-auto mr-3'
                                                : 'absolute right-2 top-2'
                                        }
                                    >
                                        <button
                                            type='button'
                                            className='text-gray-400 rounded-md hover:text-gray-500 focus:outline-none'
                                            onClick={props.dismiss}
                                        >
                                            <span className='sr-only'>
                                                Close
                                            </span>
                                            <XCircleIcon
                                                className='w-6 h-6'
                                                aria-hidden='true'
                                            />
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                            <div
                                className={
                                    props.removePadding
                                        ? undefined
                                        : 'pt-4 px-4 flex-auto'
                                }
                            >
                                {props.children}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default Modal;
