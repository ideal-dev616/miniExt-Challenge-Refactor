import { isDev } from '../pages/api/helpers/isDev';

export const logError = (args: {
    error: Error;
    extensionId: string | null;
    doNotThrowInDev?: boolean;
}) => {
    const message = args.error ? args.error.message || '' : '';

    if (!message) {
        return;
    }

    if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        args.error && // @ts-ignore
        args.error.status === 401
    ) {
        // Ignore unauthenticated errors.
        return;
    }

    if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        args.error && // @ts-ignore
        args.error.status === 429
    ) {
        // Ignore rate limiting errors.
        return;
    }

    console.log(message);

    if (isDev) {
        if (!args.doNotThrowInDev) {
            throw args.error;
        } else {
            console.error(args.error);
        }
    }
};

export const simpleLogError = (args: { error: Error }) =>
    logError({ error: args.error, extensionId: null });
