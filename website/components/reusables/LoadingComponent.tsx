import { assertUnreachable } from 'shared/utils/assertUnreachable';
import Spinner from './Spinner';

type Variant = 'small' | 'tall' | 'fullscreen';

const getClassnamesForVariant = (variant: Variant): string => {
    switch (variant) {
        case 'small':
            return 'w-full h-full my-4';

        case 'tall':
            return 'w-full h-full my-16 md:my-56';

        case 'fullscreen':
            return 'w-full h-screen';

        default:
            assertUnreachable(variant);
    }
};

const LoadingComponent = (props: { variant: Variant }) => {
    return (
        <div
            className={`${getClassnamesForVariant(
                props.variant
            )} justify-center items-center flex`}
        >
            <Spinner />
        </div>
    );
};

export default LoadingComponent;
