import { useCallback, useEffect, useState } from 'react';
import { v1APIRoute } from 'shared/api/routes';
import { FetchFormInput, FetchFormOutput } from 'shared/api/types/fetchForm';
import { ExtensionScreen } from 'shared/api/types/loadExtension';
import { executeApiRequest } from 'shared/executeApiRequest';
import { PUBLIC_EXT_SCREEN_URL_PARAM } from 'shared/extensions/public-ext';
import { FrontendPublicExtensionContext } from 'shared/extensions/PublicExtensionContext';
import { LoadingState } from 'shared/utils/loadingState';
import makeId from 'shared/utils/makeId';

import PublicExtension from '../';
import { logError } from '../../../utils/logError';
import ErrorMessage from '../../reusables/ErrorMessage';
import LoadingComponent from '../../reusables/LoadingComponent';

type FormExtensionLoaderBaseProps = {
    context: FrontendPublicExtensionContext;
    onSuccess?: (extensionSessionId: string) => void;
};

export type FormExtensionLoaderProps = {
    extensionId: string;
} & FormExtensionLoaderBaseProps;

export const FormExtensionLoader = (props: FormExtensionLoaderProps) => {
    const [extensionSessionId] = useState(makeId(5));

    const [result, setFormResult] = useState<LoadingState<FetchFormOutput>>({
        type: 'notLoaded',
    });

    const loadData = useCallback(async () => {
        setFormResult({ type: 'loading' });
        const search = new URL(location.href).searchParams;
        const screen =
            (search.get(PUBLIC_EXT_SCREEN_URL_PARAM) as
                | ExtensionScreen
                | undefined) ?? ExtensionScreen.FORM_LOADED;

        try {
            const body: FetchFormInput = {
                screen,
                query: Object.fromEntries(search.entries()),
                recordId:
                    props.context.type === 'direct-url'
                        ? props.context.potentialRecordIdFromUrl
                        : props.context.recordId,
                extensionId: props.extensionId,
            };
            const result = await executeApiRequest<
                FetchFormInput,
                FetchFormOutput
            >({
                route: v1APIRoute.fetchForm,
                body,
                source: {
                    type: 'website',
                },
            });

            if (result.type == 'error') throw new Error(result.message);

            setFormResult({
                type: 'loaded',
                data: result.data,
            });

            if (props.onSuccess) props.onSuccess(extensionSessionId);
        } catch (e) {
            logError({
                error: e,
                extensionId: props.extensionId,
                doNotThrowInDev: true,
            });
            setFormResult({ type: 'failed', errorMessage: e.message });
        }
    }, [props, extensionSessionId]);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (result.type === 'loaded') {
        return (
            <PublicExtension
                context={props.context}
                extensionSessionId={extensionSessionId}
                result={result.data}
                reload={loadData}
            />
        );
    }

    if (result.type === 'failed') {
        return <ErrorMessage message={result.errorMessage} />;
    }

    return (
        <LoadingComponent
            variant={props.context.type === 'modal' ? 'tall' : 'fullscreen'}
        />
    );
};
