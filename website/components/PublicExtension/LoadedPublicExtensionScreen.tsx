import React from 'react';
import { ExtensionScreen } from 'shared/api/types/loadExtension';
import { FrontendPublicExtensionContext } from 'shared/extensions/PublicExtensionContext';
import { assertUnreachable } from 'shared/utils/assertUnreachable';

import ErrorMessage from '../reusables/ErrorMessage';
import FormLoaded from './Form/FormLoaded';
import {
    useExtensionScreenType,
    usePublicExtensionErrorMessage,
} from './redux/publicExtensionSelectors';

const _LoadedPublicExtensionScreen = (props: {
    context: FrontendPublicExtensionContext;
    extensionId: string;
    reload: () => Promise<void>;
    extensionSessionId: string;
}) => {
    const screenType = useExtensionScreenType({
        extensionSessionId: props.extensionSessionId,
    });

    if (!screenType) {
        throw new Error(
            'Could not find a screen type because it is not defined.'
        );
    }

    const { context } = props;
    switch (screenType) {
        case ExtensionScreen.FORM_LOADED:
            return (
                <FormLoaded
                    context={context}
                    extensionId={props.extensionId}
                    extensionSessionId={props.extensionSessionId}
                    reload={props.reload}
                />
            );

        default:
            assertUnreachable(screenType);
    }
};

const LoadedPublicExtensionScreen = (props: {
    context: FrontendPublicExtensionContext;
    extensionId: string;
    extensionSessionId: string;
    reload: () => Promise<void>;
}) => {
    const errorMessage = usePublicExtensionErrorMessage({
        extensionSessionId: props.extensionSessionId,
    });

    if (errorMessage) {
        return <ErrorMessage message={errorMessage} />;
    } else {
        return (
            <_LoadedPublicExtensionScreen
                context={props.context}
                reload={props.reload}
                extensionId={props.extensionId}
                extensionSessionId={props.extensionSessionId}
            />
        );
    }
};

export default LoadedPublicExtensionScreen;
