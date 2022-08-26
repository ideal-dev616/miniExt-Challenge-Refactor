import { v1APIHandler } from 'shared/api/handler-types';
import { FetchFormInput, FetchFormOutput } from 'shared/api/types/fetchForm';
import { ExtensionScreen } from 'shared/api/types/loadExtension';

import { loadExtension } from './loadExtension';

export const fetchForm: v1APIHandler<FetchFormInput, FetchFormOutput> = async (
    args,
    extras
) => {
    const screen = ExtensionScreen.FORM_LOADED;

    return loadExtension({
        extensionScreen: screen,
        parsedCookies: extras.parsedCookies,
        extensionId: args.extensionId,
        searchQuery: args.query ?? {},
        loggedInUserUID: extras.loggedInUserUID,
        loggedInUserEmail: extras.loggedInUserEmail,
        recordId: args.recordId,
        clientIp: extras.userIPAddress,
        userAgent: extras.userAgent,
    });
};

export const handler = fetchForm;
