import React from 'react';
import { useRouter } from 'next/router';

import { FormExtensionLoader } from './Form/FormExtensionLoader';
import ErrorMessage from '../reusables/ErrorMessage';
import LoadingComponent from '../reusables/LoadingComponent';

const PublicExtensionScreenLoader = () => {
    const router = useRouter();

    if (!router.isReady) {
        return <LoadingComponent variant={'fullscreen'} />;
    }

    const ids = router.query.ids as string[];

    const extensionId: string | null = ids && ids.length > 0 ? ids[0] : null;
    const potentialRecordIdFromUrl: string | null =
        ids && ids.length > 1 ? ids[1] : null;

    if (!extensionId) {
        return <ErrorMessage message='No form ID was provided in the URL.' />;
    }

    return (
        <FormExtensionLoader
            context={{
                type: 'direct-url',
                potentialRecordIdFromUrl: potentialRecordIdFromUrl ?? null,
            }}
            extensionId={extensionId}
        />
    );
};

export default PublicExtensionScreenLoader;
