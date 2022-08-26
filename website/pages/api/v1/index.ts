// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { parseCookies } from 'nookies';
import { V1APIHandlerExtras } from 'shared/api/handler-types';
import { v1APIRoute } from 'shared/api/routes';
import { assertUnreachable } from 'shared/utils/assertUnreachable';
import { appWebsiteBaseUrl } from 'shared/utils/commonUrls';
import { getClientIp, getUserAgent } from 'shared/utils/request';

import { logError } from '../../../utils/logError';

const getHandlerForRoute = async (route: v1APIRoute) => {
    switch (route) {
        case v1APIRoute.fetchInitialLinkedRecords:
            return await import('./handlers/fetchInitialLinkedRecords');

        case v1APIRoute.fetchRecordsForLinkedRecordsSelector:
            return await import(
                './handlers/fetchRecordsForLinkedRecordsSelector'
            );

        case v1APIRoute.fetchForm:
            return await import('./handlers/fetchForm');

        default:
            assertUnreachable(route);
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Run the cors middleware
        await NextCors(req, res, {
            origin: '*',
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });

        if (req.method === 'POST') {
            const output = await executeRequest(req);

            res.status(200).json(output);
        } else if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else if (req.method === 'GET') {
            const output = await executeRequest(req);

            // Return just strings for redirecting
            if (typeof output === 'string') {
                res.redirect(output);
            } else res.status(200).json(output);
        } else {
            throw new Error('Not implemented yet');
        }
    } catch (e) {
        console.log(e);
        logError({ error: e, extensionId: null, doNotThrowInDev: true });
        res.status(200).json({ error: true, message: e.message });
    }
};

export default handler;

const executeRequest = async (req: NextApiRequest) => {
    const { route } = req.query;

    const body = req.body ? JSON.parse(req.body) : {};

    const parsedCookies = parseCookies({ req });

    const urlOrigin: string =
        req.headers && req.headers.origin
            ? (req.headers.origin as string)
            : appWebsiteBaseUrl;

    const extras: V1APIHandlerExtras = {
        loggedInUserUID: null,
        loggedInUserEmail: null,
        parsedCookies,
        urlOrigin,
        reqQuery: req.query,
        userAgent: getUserAgent(req),
        userIPAddress: getClientIp(req),
    };

    const { handler } = await getHandlerForRoute(route as v1APIRoute);
    return await handler(body, extras);
};
