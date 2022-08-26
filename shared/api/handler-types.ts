export interface ParsedCookies {
    [key: string]: string;
}

export type V1APIHandlerExtras = {
    /**
     * If a user is logged in, then we attached the logged in user's UID here.
     */
    loggedInUserUID: string | null;
    loggedInUserEmail: string | null;
    userIPAddress?: string;
    userAgent?: string;

    urlOrigin: string;
    reqQuery: { [key: string]: string | string[] };

    parsedCookies: ParsedCookies;
};

export type v1APIHandler<Input, Output> = (
    input: Input,
    extras: V1APIHandlerExtras
) => Promise<Output>;
