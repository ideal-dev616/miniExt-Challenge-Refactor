/* This example requires Tailwind CSS v2.0+ */
import { XCircleIcon } from '@heroicons/react/solid';

const ErrorMessage = (props: {
    message: string;
    containerClassname?: string;
}): JSX.Element => {
    return (
        <div className={`${props.containerClassname} rounded-md bg-red-50 p-4`}>
            <div className='flex'>
                <div className='flex-shrink-0'>
                    <XCircleIcon
                        className='w-5 h-5 text-red-400'
                        aria-hidden='true'
                    />
                </div>
                <div className='ml-3'>
                    <p className='text-sm font-medium text-red-800 whitespace-pre-wrap'>
                        {props.message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
