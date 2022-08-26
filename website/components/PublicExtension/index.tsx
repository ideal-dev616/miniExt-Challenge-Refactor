import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FetchFormOutput } from 'shared/api/types/fetchForm';
import { FrontendPublicExtensionContext } from 'shared/extensions/PublicExtensionContext';

import LoadedPublicExtensionScreen from '../../components/PublicExtension/LoadedPublicExtensionScreen';
import { getScreenStateForLoadExtensionOutput } from './getScreenStateHelpers';
import { publicExtensionActions } from './redux/publicExtensionReducer';

export type PublicExtensionProps = {
    result: FetchFormOutput;
    context: FrontendPublicExtensionContext;
    reload?: () => Promise<void>;
    extensionSessionId: string;
};

const PublicExtension = (props: PublicExtensionProps) => {
    const router = useRouter();
    const dispatch = useDispatch();

    // This is a hack to make sure that the extension is loaded before the
    // extension screen is rendered. This is so that we don't have to wait for a
    // useEffect to load the extension.
    const didDispatchAction = useRef(false);

    if (!didDispatchAction.current) {
        didDispatchAction.current = true;

        const screenState = getScreenStateForLoadExtensionOutput({
            result: props.result,
        });

        if (screenState) {
            dispatch(
                publicExtensionActions.setScreenStateForSession({
                    extensionSessionId: props.extensionSessionId,
                    screenState,
                })
            );
        }
    }

    return (
        <LoadedPublicExtensionScreen
            context={props.context}
            reload={
                props.reload ??
                (async () => {
                    router.reload();
                })
            }
            extensionId={props.result.extensionId}
            extensionSessionId={props.extensionSessionId}
        />
    );
};

export default PublicExtension;
